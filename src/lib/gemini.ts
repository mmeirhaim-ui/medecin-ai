import {
  GoogleGenerativeAI,
  SchemaType,
  type GenerativeModel,
  type Part,
  type ResponseSchema,
} from "@google/generative-ai";
import { SYSTEM_PROMPT, DISCLAIMER_SHORT } from "./prompts";
import { buildMockResponse } from "./mock";
import { detectEmergency } from "./emergency";
import type {
  Assessment,
  ConsultRequest,
  LikelyCause,
  UrgencyLevel,
} from "./types";

const RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    likelyCauses: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          rank: { type: SchemaType.NUMBER },
          rationale: { type: SchemaType.STRING },
          confidence: { type: SchemaType.STRING },
        },
        required: ["title", "rank", "rationale", "confidence"],
      },
    },
    urgency: { type: SchemaType.STRING },
    clarifyingQuestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    nextSteps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    needsExamOrLabs: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    disclaimer: { type: SchemaType.STRING },
    reply: { type: SchemaType.STRING },
  },
  required: [
    "summary",
    "likelyCauses",
    "urgency",
    "clarifyingQuestions",
    "nextSteps",
    "needsExamOrLabs",
    "disclaimer",
    "reply",
  ],
};

export function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    undefined
  );
}

export function isMockMode(): boolean {
  return !getApiKey();
}

/** Default Flash model — gemini-2.0-flash was shut down 2026-06-01. */
export const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

/** Fallback chain if the preferred model is unavailable for the key. */
const MODEL_FALLBACKS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
] as const;

/**
 * Sanitize provider errors for clients/logs: keep status + short message,
 * strip API keys / long payloads.
 */
export function formatGeminiError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "Erreur inconnue";
  const scrubbed = raw
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redacted]")
    .replace(/(api[_-]?key|x-goog-api-key)\s*[:=]\s*["']?[^\s"',}]+/gi, "$1=[redacted]");
  const compact = scrubbed.replace(/\s+/g, " ").trim().slice(0, 320);
  return compact || "Erreur Gemini inconnue";
}

function getModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

function modelCandidates(): string[] {
  const preferred = getModelName();
  return [preferred, ...MODEL_FALLBACKS.filter((m) => m !== preferred)];
}

function normalizeUrgency(value: unknown): UrgencyLevel {
  const v = String(value ?? "").toLowerCase();
  if (v.includes("urgent")) return "urgent";
  if (v.includes("auto") || v.includes("self")) return "auto_soins";
  return "voir_medecin";
}

function normalizeConfidence(value: unknown): LikelyCause["confidence"] {
  const v = String(value ?? "").toLowerCase();
  if (v.includes("élev") || v.includes("elev") || v.includes("high"))
    return "élevée";
  if (v.includes("moy") || v.includes("med")) return "moyenne";
  return "faible";
}

function parseAssessment(raw: unknown): {
  assessment: Assessment;
  reply: string;
} {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const causesRaw = Array.isArray(obj.likelyCauses) ? obj.likelyCauses : [];
  const likelyCauses: LikelyCause[] = causesRaw.map((c, i) => {
    const item = (c ?? {}) as Record<string, unknown>;
    return {
      title: String(item.title ?? `Hypothèse ${i + 1}`),
      rank: Number(item.rank ?? i + 1),
      rationale: String(item.rationale ?? ""),
      confidence: normalizeConfidence(item.confidence),
    };
  });

  const assessment: Assessment = {
    summary: String(obj.summary ?? ""),
    likelyCauses,
    urgency: normalizeUrgency(obj.urgency),
    clarifyingQuestions: Array.isArray(obj.clarifyingQuestions)
      ? obj.clarifyingQuestions.map(String)
      : [],
    nextSteps: Array.isArray(obj.nextSteps) ? obj.nextSteps.map(String) : [],
    needsExamOrLabs: Array.isArray(obj.needsExamOrLabs)
      ? obj.needsExamOrLabs.map(String)
      : [],
    disclaimer: String(obj.disclaimer || DISCLAIMER_SHORT),
    mock: false,
  };

  const reply = String(obj.reply || assessment.summary);
  return { assessment, reply };
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Réponse modèle non JSON");
  }
}

function buildUserParts(req: ConsultRequest): Part[] {
  const historyBlock =
    req.history && req.history.length
      ? `\n\nHistorique de la conversation :\n${req.history
          .map(
            (h) =>
              `${h.role === "user" ? "Patient" : "Medecin AI"}: ${h.content}`,
          )
          .join("\n")}`
      : "";

  const followUp = req.message
    ? `\n\nMessage de suivi du patient :\n${req.message}`
    : "";

  const text = `Symptômes / description initiale :\n${req.symptoms}${historyBlock}${followUp}\n\nRéponds strictement au format JSON demandé.`;

  const parts: Part[] = [{ text }];

  for (const img of req.images ?? []) {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data,
      },
    });
  }

  if (req.images?.length) {
    parts.push({
      text: `${req.images.length} image(s) clinique(s) jointe(s). Analyse-les avec prudence et indique les limites de l’interprétation photographique.`,
    });
  }

  return parts;
}

function createModel(
  modelName: string,
  withGrounding: boolean,
): GenerativeModel {
  const key = getApiKey();
  if (!key) throw new Error("Missing API key");
  const genAI = new GoogleGenerativeAI(key);

  const base = {
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json" as const,
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  if (withGrounding) {
    return genAI.getGenerativeModel({
      ...base,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} } as any],
    });
  }

  return genAI.getGenerativeModel(base);
}

async function generateJsonText(
  modelName: string,
  parts: Part[],
): Promise<{ text: string; grounded: boolean }> {
  // Structured JSON + Google Search is often rejected together — prefer
  // reliable JSON first, then optional grounded retry without schema pressure.
  try {
    const model = createModel(modelName, false);
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    return { text: result.response.text(), grounded: false };
  } catch (primaryErr) {
    try {
      const groundedModel = createModel(modelName, true);
      const result = await groundedModel.generateContent({
        contents: [{ role: "user", parts }],
      });
      return { text: result.response.text(), grounded: true };
    } catch (groundedErr) {
      const primary = formatGeminiError(primaryErr);
      const secondary = formatGeminiError(groundedErr);
      const detail =
        secondary !== primary ? `${primary} (grounding: ${secondary})` : primary;
      throw new Error(`Gemini (${modelName}): ${detail}`);
    }
  }
}

export async function runConsultation(req: ConsultRequest): Promise<{
  assessment: Assessment;
  reply: string;
  emergencyDetected: boolean;
  mock: boolean;
}> {
  const blob = [
    req.symptoms,
    req.message,
    ...(req.history?.map((h) => h.content) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const emergency = detectEmergency(blob);

  if (isMockMode()) {
    const mock = buildMockResponse(req);
    return { ...mock, mock: true };
  }

  const parts = buildUserParts(req);

  let grounded = false;
  let textOut = "";
  let lastError: unknown;

  for (const modelName of modelCandidates()) {
    try {
      const out = await generateJsonText(modelName, parts);
      textOut = out.text;
      grounded = out.grounded;
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!textOut) {
    throw lastError instanceof Error
      ? lastError
      : new Error(`Gemini (${getModelName()}): échec d’analyse`);
  }

  const parsed = parseAssessment(extractJson(textOut));
  let { assessment, reply } = parsed;
  assessment.grounded = grounded;
  assessment.mock = false;

  if (emergency.detected) {
    assessment = {
      ...assessment,
      urgency: "urgent",
    };
    reply = `⚠️ Situation potentiellement urgente.\n\n${reply}\n\nAppelez immédiatement le 15 / 112 (France) ou le 101 (Israël — Magen David Adom).`;
  }

  return {
    assessment: {
      ...assessment,
      disclaimer: assessment.disclaimer || DISCLAIMER_SHORT,
    },
    reply,
    emergencyDetected: emergency.detected,
    mock: false,
  };
}

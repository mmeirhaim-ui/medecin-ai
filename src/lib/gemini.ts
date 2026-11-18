import {
  GoogleGenerativeAI,
  SchemaType,
  type GenerativeModel,
  type Part,
  type ResponseSchema,
} from "@google/generative-ai";
import {
  buildSystemPrompt,
  disclaimerShort,
  DISCLAIMER_SHORT,
} from "./prompts";
import { buildMockResponse } from "./mock";
import { detectEmergency } from "./emergency";
import { isLocale, type Locale } from "./i18n/locales";
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

/**
 * Prefer a fast Flash / lite model. Override with GEMINI_MODEL.
 * gemini-2.0-flash was shut down 2026-06-01.
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

/** Fallback chain if the preferred model is unavailable for the key. */
const MODEL_FALLBACKS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-2.5-flash",
] as const;

function groundingEnabled(): boolean {
  const v = process.env.GEMINI_ENABLE_GROUNDING?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

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
    .replace(
      /(api[_-]?key|x-goog-api-key)\s*[:=]\s*["']?[^\s"',}]+/gi,
      "$1=[redacted]",
    );
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

function resolveLocale(req: ConsultRequest): Locale {
  return isLocale(req.locale) ? req.locale : "en";
}

function normalizeUrgency(value: unknown): UrgencyLevel {
  const v = String(value ?? "").toLowerCase();
  if (v.includes("urgent")) return "urgent";
  if (v.includes("auto") || v.includes("self")) return "auto_soins";
  return "voir_medecin";
}

function normalizeConfidence(value: unknown): LikelyCause["confidence"] {
  const v = String(value ?? "").toLowerCase();
  if (
    v.includes("élev") ||
    v.includes("elev") ||
    v.includes("high") ||
    v.includes("גבוה") ||
    v.includes("высок")
  )
    return "élevée";
  if (
    v.includes("moy") ||
    v.includes("med") ||
    v.includes("בינונ") ||
    v.includes("средн")
  )
    return "moyenne";
  return "faible";
}

function parseAssessment(
  raw: unknown,
  locale: Locale,
): {
  assessment: Assessment;
  reply: string;
} {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const causesRaw = Array.isArray(obj.likelyCauses) ? obj.likelyCauses : [];
  const likelyCauses: LikelyCause[] = causesRaw.map((c, i) => {
    const item = (c ?? {}) as Record<string, unknown>;
    return {
      title: String(item.title ?? `Hypothesis ${i + 1}`),
      rank: Number(item.rank ?? i + 1),
      rationale: String(item.rationale ?? ""),
      confidence: normalizeConfidence(item.confidence),
    };
  });

  const fallbackDisclaimer = disclaimerShort(locale);
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
    disclaimer: String(obj.disclaimer || fallbackDisclaimer),
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
      ? `\n\nConversation:\n${req.history
          .map(
            (h) =>
              `${h.role === "user" ? "Patient" : "Doctor IA"}: ${h.content}`,
          )
          .join("\n")}`
      : "";

  const followUp = req.message ? `\n\nFollow-up:\n${req.message}` : "";

  const text = `Symptoms:\n${req.symptoms}${historyBlock}${followUp}\n\nRespond with the required JSON only.`;

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
      text: `${req.images.length} clinical image(s) attached. Interpret cautiously; photo limits apply.`,
    });
  }

  return parts;
}

function createModel(
  modelName: string,
  locale: Locale,
  withGrounding: boolean,
): GenerativeModel {
  const key = getApiKey();
  if (!key) throw new Error("Missing API key");
  const genAI = new GoogleGenerativeAI(key);

  const base = {
    model: modelName,
    systemInstruction: buildSystemPrompt(locale),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
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
  locale: Locale,
  parts: Part[],
): Promise<{ text: string; grounded: boolean }> {
  // Grounding (Google Search) is opt-in via GEMINI_ENABLE_GROUNDING — skipped by
  // default to avoid multi-second latency. Structured JSON without tools is faster.
  if (groundingEnabled()) {
    try {
      const groundedModel = createModel(modelName, locale, true);
      const groundedResult = await groundedModel.generateContent({
        contents: [{ role: "user", parts }],
      });
      return { text: groundedResult.response.text(), grounded: true };
    } catch {
      /* schema + search often incompatible — fall through to fast JSON */
    }
  }

  const model = createModel(modelName, locale, false);
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
  });
  return { text: result.response.text(), grounded: false };
}

const EMERGENCY_PREFIX: Record<Locale, string> = {
  en: "⚠️ Potentially urgent situation.\n\n",
  fr: "⚠️ Situation potentiellement urgente.\n\n",
  he: "⚠️ מצב שעלול להיות דחוף.\n\n",
  ru: "⚠️ Возможно неотложное состояние.\n\n",
};

const EMERGENCY_SUFFIX: Record<Locale, string> = {
  en: "\n\nCall 15 / 112 (France) or 101 (Israel — Magen David Adom) immediately.",
  fr: "\n\nAppelez immédiatement le 15 / 112 (France) ou le 101 (Israël — Magen David Adom).",
  he: "\n\nהתקשרו מיד ל־15 / 112 (צרפת) או ל־101 (ישראל — מגן דוד אדום).",
  ru: "\n\nНемедленно звоните 15 / 112 (Франция) или 101 (Израиль — Маген Давид Адом).",
};

export async function runConsultation(req: ConsultRequest): Promise<{
  assessment: Assessment;
  reply: string;
  emergencyDetected: boolean;
  mock: boolean;
}> {
  const locale = resolveLocale(req);
  const blob = [
    req.symptoms,
    req.message,
    ...(req.history?.map((h) => h.content) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const emergency = detectEmergency(blob);

  if (isMockMode()) {
    const mock = buildMockResponse({ ...req, locale });
    return { ...mock, mock: true };
  }

  const parts = buildUserParts(req);

  let grounded = false;
  let textOut = "";
  let lastError: unknown;

  for (const modelName of modelCandidates()) {
    try {
      const out = await generateJsonText(modelName, locale, parts);
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

  const parsed = parseAssessment(extractJson(textOut), locale);
  let { assessment, reply } = parsed;
  assessment.grounded = grounded;
  assessment.mock = false;

  if (emergency.detected) {
    assessment = {
      ...assessment,
      urgency: "urgent",
    };
    reply = `${EMERGENCY_PREFIX[locale]}${reply}${EMERGENCY_SUFFIX[locale]}`;
  }

  return {
    assessment: {
      ...assessment,
      disclaimer: assessment.disclaimer || disclaimerShort(locale) || DISCLAIMER_SHORT,
    },
    reply,
    emergencyDetected: emergency.detected,
    mock: false,
  };
}

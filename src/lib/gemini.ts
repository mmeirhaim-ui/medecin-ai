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
import {
  collectSourcesFromMatches,
  formatKnowledgeForPrompt,
  matchKnowledge,
  pickGuidanceLang,
} from "./knowledge";
import {
  GEMINI_MAX_OUTPUT_TOKENS,
  getGroundingMode,
  getModelName,
  modelCandidates,
} from "./gemini-config";
import type {
  Assessment,
  AssessmentSource,
  ConsultRequest,
  LikelyCause,
  UrgencyLevel,
} from "./types";

export {
  DEFAULT_GEMINI_MODEL,
  getGroundingMode,
  getModelName,
  type GroundingMode,
} from "./gemini-config";

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
    sources: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          url: { type: SchemaType.STRING },
          publisher: { type: SchemaType.STRING },
        },
        required: ["title", "url"],
      },
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
    "sources",
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

function groundingEnabled(): boolean {
  return getGroundingMode() !== "off";
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

function normalizeSources(raw: unknown): AssessmentSource[] {
  if (!Array.isArray(raw)) return [];
  const out: AssessmentSource[] = [];
  for (const item of raw) {
    const obj = (item ?? {}) as Record<string, unknown>;
    const url = String(obj.url ?? "").trim();
    const title = String(obj.title ?? "").trim();
    if (!url || !title || !/^https?:\/\//i.test(url)) continue;
    out.push({
      title,
      url,
      publisher: obj.publisher ? String(obj.publisher) : undefined,
    });
  }
  return out;
}

function mergeSources(
  primary: AssessmentSource[],
  secondary: AssessmentSource[],
): AssessmentSource[] {
  const seen = new Set<string>();
  const out: AssessmentSource[] = [];
  for (const s of [...primary, ...secondary]) {
    if (seen.has(s.url)) continue;
    seen.add(s.url);
    out.push(s);
  }
  return out.slice(0, 8);
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
    sources: normalizeSources(obj.sources),
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

function buildUserParts(req: ConsultRequest, knowledgeBlock: string): Part[] {
  const historyBlock =
    req.history && req.history.length
      ? `\n\nConversation:\n${req.history
          .map(
            (h) =>
              `${h.role === "user" ? "Patient" : "Doctor AI"}: ${h.content}`,
          )
          .join("\n")}`
      : "";

  const followUp = req.message ? `\n\nFollow-up:\n${req.message}` : "";

  const knowledgeSection = knowledgeBlock
    ? `\n\n${knowledgeBlock}\n`
    : "\n\n(No local knowledge-pack match — use triage rules + trusted sources.)\n";

  const text = `Symptoms:\n${req.symptoms}${historyBlock}${followUp}${knowledgeSection}\nJSON only. Keep reply/summary short. Fill "sources" with trusted public URLs when useful.`;
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

type GroundingChunk = { title: string; url: string };

function extractGroundingSources(response: {
  candidates?: Array<{
    groundingMetadata?: {
      groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
    };
  }>;
}): GroundingChunk[] {
  const chunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const out: GroundingChunk[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const url = chunk.web?.uri?.trim();
    const title = chunk.web?.title?.trim() || url;
    if (!url || !title || seen.has(url)) continue;
    seen.add(url);
    out.push({ title, url });
  }
  return out;
}

type GlobalGemini = typeof globalThis & {
  __doctorIaGenAI?: GoogleGenerativeAI;
  __doctorIaModels?: Map<string, GenerativeModel>;
};

function getGenAI(): GoogleGenerativeAI {
  const key = getApiKey();
  if (!key) throw new Error("Missing API key");
  const g = globalThis as GlobalGemini;
  if (!g.__doctorIaGenAI) {
    g.__doctorIaGenAI = new GoogleGenerativeAI(key);
  }
  return g.__doctorIaGenAI;
}

function createModel(
  modelName: string,
  locale: Locale,
  withGrounding: boolean,
): GenerativeModel {
  const g = globalThis as GlobalGemini;
  if (!g.__doctorIaModels) g.__doctorIaModels = new Map();
  const cacheKey = `${modelName}|${locale}|${withGrounding ? "g" : "n"}`;
  const cached = g.__doctorIaModels.get(cacheKey);
  if (cached) return cached;

  const genAI = getGenAI();
  const base = {
    model: modelName,
    systemInstruction: buildSystemPrompt(locale),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json" as const,
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  const model = withGrounding
    ? genAI.getGenerativeModel({
        ...base,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: [{ googleSearch: {} } as any],
      })
    : genAI.getGenerativeModel(base);

  g.__doctorIaModels.set(cacheKey, model);
  return model;
}

export type ConsultTimings = {
  knowledgeMs: number;
  modelMs: number;
  totalMs: number;
  knowledgeHits: number;
  knowledgeChars: number;
  grounded: boolean;
  mock: boolean;
};

async function tryGenerate(
  modelName: string,
  locale: Locale,
  parts: Part[],
  withGrounding: boolean,
): Promise<{
  text: string;
  grounded: boolean;
  groundingSources: GroundingChunk[];
}> {
  const model = createModel(modelName, locale, withGrounding);
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
  });
  return {
    text: result.response.text(),
    grounded: withGrounding,
    groundingSources: withGrounding
      ? extractGroundingSources(result.response)
      : [],
  };
}

async function generateJsonText(
  modelName: string,
  locale: Locale,
  parts: Part[],
): Promise<{
  text: string;
  grounded: boolean;
  groundingSources: GroundingChunk[];
}> {
  // Grounding is opt-in (default off) to keep latency low. Prefer/fallback
  // via GEMINI_GROUNDING or legacy GEMINI_ENABLE_GROUNDING=1.
  const mode = getGroundingMode();
  const attempts: boolean[] =
    mode === "off"
      ? [false]
      : mode === "prefer"
        ? [true, false]
        : [false, true];

  let lastError: unknown;
  for (const withGrounding of attempts) {
    if (withGrounding && !groundingEnabled()) continue;
    try {
      return await tryGenerate(modelName, locale, parts, withGrounding);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Gemini (${modelName}): échec d’analyse`);
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
  timings: ConsultTimings;
}> {
  const t0 = performance.now();
  const locale = resolveLocale(req);
  const blob = [
    req.symptoms,
    req.message,
    ...(req.history?.map((h) => h.content) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const emergency = detectEmergency(blob);
  const matches = matchKnowledge(blob, 3);
  const guidanceLang = pickGuidanceLang(blob, locale);
  const knowledgeBlock = formatKnowledgeForPrompt(matches, guidanceLang);
  const packSources = collectSourcesFromMatches(matches);
  const knowledgeHits = matches.map((m) => m.entry.id);
  const knowledgeMs = performance.now() - t0;

  if (isMockMode()) {
    const mock = buildMockResponse({ ...req, locale });
    const totalMs = performance.now() - t0;
    return {
      assessment: {
        ...mock.assessment,
        sources: mergeSources(mock.assessment.sources ?? [], packSources),
        knowledgeHits,
        grounded: false,
      },
      reply: mock.reply,
      emergencyDetected: mock.emergencyDetected,
      mock: true,
      timings: {
        knowledgeMs: Math.round(knowledgeMs * 100) / 100,
        modelMs: 0,
        totalMs: Math.round(totalMs * 100) / 100,
        knowledgeHits: knowledgeHits.length,
        knowledgeChars: knowledgeBlock.length,
        grounded: false,
        mock: true,
      },
    };
  }

  const parts = buildUserParts(req, knowledgeBlock);

  let grounded = false;
  let groundingSources: GroundingChunk[] = [];
  let textOut = "";
  let lastError: unknown;
  const modelStart = performance.now();

  for (const modelName of modelCandidates()) {
    try {
      const out = await generateJsonText(modelName, locale, parts);
      textOut = out.text;
      grounded = out.grounded;
      groundingSources = out.groundingSources;
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  const modelMs = performance.now() - modelStart;

  if (!textOut) {
    throw lastError instanceof Error
      ? lastError
      : new Error(`Gemini (${getModelName()}): échec d’analyse`);
  }

  const parsed = parseAssessment(extractJson(textOut), locale);
  let { assessment, reply } = parsed;
  const groundedAsSources: AssessmentSource[] = groundingSources.map((g) => ({
    title: g.title,
    url: g.url,
    publisher: "Google Search grounding",
  }));
  assessment = {
    ...assessment,
    grounded,
    knowledgeHits,
    sources: mergeSources(
      assessment.sources ?? [],
      mergeSources(packSources, groundedAsSources),
    ),
    mock: false,
  };

  if (emergency.detected) {
    assessment = {
      ...assessment,
      urgency: "urgent",
    };
    reply = `${EMERGENCY_PREFIX[locale]}${reply}${EMERGENCY_SUFFIX[locale]}`;
  }

  const totalMs = performance.now() - t0;
  return {
    assessment: {
      ...assessment,
      disclaimer: assessment.disclaimer || disclaimerShort(locale) || DISCLAIMER_SHORT,
    },
    reply,
    emergencyDetected: emergency.detected,
    mock: false,
    timings: {
      knowledgeMs: Math.round(knowledgeMs * 100) / 100,
      modelMs: Math.round(modelMs * 100) / 100,
      totalMs: Math.round(totalMs * 100) / 100,
      knowledgeHits: knowledgeHits.length,
      knowledgeChars: knowledgeBlock.length,
      grounded,
      mock: false,
    },
  };
}

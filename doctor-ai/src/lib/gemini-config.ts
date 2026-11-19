/**
 * Shared Gemini runtime config (no SDK imports) so prompts / knowledge
 * can read grounding mode without circular deps on gemini.ts.
 */

/**
 * Prefer a fast Flash / lite model. Override with GEMINI_MODEL.
 * gemini-2.0-flash was shut down 2026-06-01.
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

/** Fallback chain if the preferred model is unavailable for the key. */
export const MODEL_FALLBACKS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-2.5-flash",
] as const;

/**
 * Grounding mode:
 * - prefer: try Google Search first, then JSON-only
 * - on / 1 / true: same as prefer (legacy GEMINI_ENABLE_GROUNDING)
 * - fallback: JSON-only first, then optional grounded retry
 * - off (default): never enable googleSearch — keeps latency low
 */
export type GroundingMode = "prefer" | "fallback" | "off";

export function getGroundingMode(): GroundingMode {
  const legacy = process.env.GEMINI_ENABLE_GROUNDING?.trim().toLowerCase();
  if (legacy === "1" || legacy === "true" || legacy === "yes") return "prefer";
  const raw = (process.env.GEMINI_GROUNDING || "off").trim().toLowerCase();
  if (raw === "prefer" || raw === "on" || raw === "1" || raw === "true")
    return "prefer";
  if (raw === "fallback") return "fallback";
  return "off";
}

export function getModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function modelCandidates(): string[] {
  const preferred = getModelName();
  return [preferred, ...MODEL_FALLBACKS.filter((m) => m !== preferred)];
}

/** Cap JSON output — structured triage rarely needs 2k tokens. */
export const GEMINI_MAX_OUTPUT_TOKENS = 1400;

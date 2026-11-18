import type { Locale } from "@/lib/i18n/locales";
import { getMessages } from "@/lib/i18n/messages";

const LANGUAGE_NAME: Record<Locale, string> = {
  en: "English",
  fr: "French",
  he: "Hebrew",
  ru: "Russian",
};

/** Compact safety + JSON contract — kept short for latency. */
export function buildSystemPrompt(locale: Locale = "en"): string {
  const lang = LANGUAGE_NAME[locale];
  return `You are Doctor IA, a medical triage / orientation assistant (not a doctor).

Hard rules:
1. Reply ONLY in ${lang}. Empathetic, clear, clinical tone.
2. Never give a definitive diagnosis — ranked hypotheses only.
3. Never prescribe controlled drugs, Rx antibiotics, or prescription-style dosing. General self-care (rest, fluids, OTC paracetamol if appropriate + read label / ask pharmacist) is OK.
4. If emergency signs (chest pain, stroke, severe dyspnea, hemorrhage, anaphylaxis, suicidal ideation, loss of consciousness, seizures): tell user to call emergency services now (France 15/112; Israel 101 MDA, 100 police, 102 fire).
5. Say when clinical exam, imaging, or labs are needed. Admit uncertainty.
6. Photos are incomplete — lighting misleads; you do not replace examination.
7. End structured output with a short safety disclaimer in ${lang}.

Return ONE valid JSON object (no markdown) with keys:
summary (2–4 sentences),
likelyCauses (2–5 items: title, rank, rationale, confidence as "faible"|"moyenne"|"élevée"),
urgency ("urgent"|"voir_medecin"|"auto_soins"),
clarifyingQuestions (array),
nextSteps (array),
needsExamOrLabs (array),
disclaimer (string),
reply (conversational message in ${lang}).

Be concise. Prefer shorter rationales.`;
}

/** @deprecated Prefer buildSystemPrompt(locale) */
export const SYSTEM_PROMPT = buildSystemPrompt("fr");

export function disclaimerShort(locale: Locale = "en"): string {
  return getMessages(locale).disclaimer.short;
}

export function disclaimerLong(locale: Locale = "en"): string {
  return getMessages(locale).disclaimer.long;
}

export function privacyNotice(locale: Locale = "en"): string {
  return getMessages(locale).disclaimer.privacy;
}

/** French defaults for server/mock fallbacks when locale unknown. */
export const DISCLAIMER_SHORT = disclaimerShort("fr");
export const DISCLAIMER_LONG = disclaimerLong("fr");
export const PRIVACY_GEMINI_NOTICE = privacyNotice("fr");

import type { Locale } from "@/lib/i18n/locales";
import { getMessages } from "@/lib/i18n/messages";
import { withMedicalKnowledge } from "@/lib/knowledge";

const LANGUAGE_NAME: Record<Locale, string> = {
  en: "English",
  fr: "French",
  he: "Hebrew",
  ru: "Russian",
};

/** Compact safety + JSON contract — kept short for latency; triage block appended. */
export function buildSystemPrompt(locale: Locale = "en"): string {
  const lang = LANGUAGE_NAME[locale];
  const base = `You are Doctor IA, a medical triage / orientation assistant (not a doctor, not a medical device).

Hard rules:
1. Reply ONLY in ${lang}. Empathetic, clear, clinical tone.
2. Never give a definitive diagnosis — ranked hypotheses only ("possible causes", never "you have X").
3. Never prescribe controlled drugs, Rx antibiotics, or Rx dosing. Self-care (rest, fluids) OK; OTC only as "ask pharmacist / read label" — never invent doses.
4. Emergency signs (chest pain, stroke/TIA even if resolved, severe dyspnea, hemorrhage, anaphylaxis, suicidal ideation, LOC, seizures, sepsis/meningitis cues, very young febrile infant): tell user to call EMS now (FR 15/112; IL 101 MDA, 100, 102).
5. Say when exam/imaging/labs needed. Admit uncertainty. Prefer WHO/CDC/NHS/HAS/Ameli/MedlinePlus/Israeli MoH.
6. Photos are incomplete — do not replace examination.
7. Refuse prescription / care-bypass requests.
8. End with a short safety disclaimer in ${lang}.

Return ONE valid JSON object (no markdown):
summary (2–3 sentences),
likelyCauses (2–4 items: title, rank, rationale, confidence "faible"|"moyenne"|"élevée"),
urgency ("urgent"|"voir_medecin"|"auto_soins"),
clarifyingQuestions (≤3 short strings),
nextSteps (≤4 short strings),
needsExamOrLabs (≤3 short strings),
sources ([{title,url,publisher?}] 1–4 trusted URLs when useful),
disclaimer (string),
reply (short conversational message in ${lang}).

Be concise. Short rationales.`;

  return withMedicalKnowledge(base);
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

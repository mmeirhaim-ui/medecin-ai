import { getTrustedDomains } from "./load";
import { getGroundingMode } from "@/lib/gemini-config";

/** Compact structured triage knowledge appended to the locale system prompt. */
export const TRIAGE_KNOWLEDGE_BLOCK = `
STRUCTURED TRIAGE (educational; NEVER a definitive diagnosis):

Urgency: urgent = EMS/ER now; voir_medecin = prompt clinician/urgent care; auto_soins = home care + clear worsen rules.

Red flags → urgent: crushing chest pain (± jaw/arm/dyspnoea/sweat); FAST stroke/TIA even if resolved; anaphylaxis (airway/breathing/collapse); sepsis/meningitis cues (non-blanching rash, stiff neck, unresponsive infant); severe dyspnoea/blue lips; heavy pregnancy bleed/faint; sudden severe testicular pain; DVT/PE cues; heat stroke; major burns; poisoning/CO with severe symptoms; choking; suicidal crisis with imminent danger.

Often auto_soins if mild: viral cold/sore throat (no self-started antibiotics); mild fever in older children/adults with worsen rules; mild GI with hydration focus.

Photos ≠ exam. Admit uncertainty. Prefer WHO/CDC/NHS/HAS/Ameli/MedlinePlus/Israeli MoH.

Emergency numbers: FR 15/112/18 (114 deaf); IL 101 MDA / 100 / 102.
`.trim();

/** Short citation policy when Google Search grounding is off (default). */
export function citationPolicyBlock(): string {
  const domains = getTrustedDomains().slice(0, 14).join(", ");
  return `
CITATIONS: Prefer trusted public domains (${domains}). Put real https URLs in "sources" (1–5 when useful). Short paraphrase only — no paywalled textbook quotes. If unsure, say so and recommend clinician review.
`.trim();
}

/** Fuller policy when GEMINI_GROUNDING is enabled. */
export function groundingPolicyBlock(): string {
  return `
TRUSTED LIVE SOURCES (prefer when searching / citing):
${getTrustedDomains()
  .map((d) => `- ${d}`)
  .join("\n")}

Grounding rules:
- Prefer short paraphrases + source URLs over long quotations.
- Never scrape or reproduce paywalled textbooks or copyrighted monographs.
- If search results conflict or are low quality, say uncertainty remains and recommend clinician review.
- When you cite, put real URLs in the "sources" array (1–5 when useful; empty only if none).
`.trim();
}

/** Append triage + citation/grounding policy to a locale-specific base prompt. */
export function withMedicalKnowledge(basePrompt: string): string {
  const policy =
    getGroundingMode() === "off"
      ? citationPolicyBlock()
      : groundingPolicyBlock();
  return `${basePrompt}

${TRIAGE_KNOWLEDGE_BLOCK}

${policy}`;
}

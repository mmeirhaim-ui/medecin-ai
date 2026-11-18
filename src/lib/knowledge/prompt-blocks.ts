import { getTrustedDomains } from "./load";

/** Compact structured triage knowledge appended to the locale system prompt. */
export const TRIAGE_KNOWLEDGE_BLOCK = `
STRUCTURED TRIAGE KNOWLEDGE (educational; NEVER a definitive diagnosis):

Urgency framing:
- urgent = immediate emergency services / ER
- voir_medecin = prompt clinician / urgent care / same-day advice line
- auto_soins = possible home supportive care WITH clear worsening rules

Cardio red flags → urgent: crushing/squeezing chest pain; pain to jaw/arm/back; chest pain + dyspnoea/sweating/nausea/dizziness; rest angina worse than usual. (MedlinePlus, NHS, Ameli)

Stroke / TIA → urgent (even if resolved): FAST — Face droop, Arm weakness, Speech difficulty, Time to call emergency; sudden one-sided numbness, vision loss, thunderclap headache, sudden imbalance. (MedlinePlus, NHS, HAS, Israeli MoH)

Anaphylaxis → urgent: sudden lip/tongue/throat swelling; severe wheeze/gasping; tight throat; blue/grey/pale lips/skin; collapse/confusion; limp child. If prescribed adrenaline auto-injector available, use as labeled while calling emergency services — do NOT invent doses. (NHS)

Sepsis / meningitis → urgent: extreme high/low temperature with severe illness; confusion; very fast breathing; blotchy/blue/pale skin; non-blanching rash (glass test); stiff neck; photophobia; first seizure; floppy/unresponsive infant. (NHS)

Respiratory viruses (cold/flu-like) → often auto_soins if mild: rest, fluids; antibiotics do NOT treat viruses. See clinician for dyspnoea, dehydration, fever >4 days, symptoms >10 days, relapse, or high-risk groups. Emergency respiratory signs: severe dyspnoea, chest pressure, confusion, seizures, blue lips; infant <12 weeks with fever ≥38°C. (CDC)

Sore throat → often viral; see clinician for dyspnoea/dysphagia, blood in saliva, dehydration, rash/joint pain, failure to improve; infant <3 months with fever ≥38°C. No self-started antibiotics. (CDC)

Fever → age-dependent thresholds; infants ~<2–3 months with fever need urgent evaluation; emergency if unarousable, confused, severe dyspnoea, blue lips, stiff neck, seizure. (MedlinePlus, Israeli MoH)

Derm → photo ≠ exam. Hot painful swollen skin → urgent clinician (cellulitis). Non-blanching rash + illness → emergency. (NHS)

GI → prioritize hydration; emergency for bloody/coffee-ground/green vomit, sudden severe pain, shock-like signs, poisoning. Progressive/right-lower pain → urgent appendicitis pathway. (NHS, Israeli MoH)

Mental health crisis → immediate danger: emergency services / crisis lines; do not leave alone; never provide self-harm methods. (WHO, Israeli MoH, MedlinePlus)

Emergency numbers when relevant:
- France: 15 (SAMU), 112, 18; deaf/hard-of-hearing: 114
- Israel: 101 MDA, 100 police, 102 fire
`.trim();

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

/** Append triage + grounding policy to a locale-specific base prompt. */
export function withMedicalKnowledge(basePrompt: string): string {
  return `${basePrompt}

${TRIAGE_KNOWLEDGE_BLOCK}

${groundingPolicyBlock()}`;
}

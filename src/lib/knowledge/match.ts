import { loadKnowledgeEntries } from "./load";
import type {
  KnowledgeEntry,
  KnowledgeLang,
  MatchedKnowledge,
} from "./types";

const LANGS: KnowledgeLang[] = ["en", "fr", "he", "ru"];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Score entries by keyword hits across EN/FR/HE/RU.
 * Multi-word keywords must appear as substrings; single tokens use word-ish boundaries when Latin.
 */
export function matchKnowledge(
  text: string,
  limit = 4,
): MatchedKnowledge[] {
  const hay = normalize(text);
  if (!hay.trim()) return [];

  const scored: MatchedKnowledge[] = [];

  for (const entry of loadKnowledgeEntries()) {
    const matchedKeywords: string[] = [];
    let score = 0;

    for (const lang of LANGS) {
      for (const kw of entry.keywords[lang] ?? []) {
        const needle = normalize(kw);
        if (!needle || needle.length < 2) continue;
        if (hay.includes(needle)) {
          matchedKeywords.push(kw);
          score += needle.includes(" ") ? 2.5 : 1.5;
        }
      }
    }

    if (score > 0) {
      score *= entry.priority ?? 1;
      scored.push({ entry, score, matchedKeywords: [...new Set(matchedKeywords)] });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function pickGuidanceLang(
  text: string,
  preferred?: KnowledgeLang,
): KnowledgeLang {
  if (preferred) return preferred;
  // Hebrew block
  if (/[\u0590-\u05FF]/.test(text)) return "he";
  // Cyrillic
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  // French cues
  if (
    /\b(je|j'|ça|avec|douleur|fièvre|depuis|bonjour|symptôme|toux)\b/i.test(
      text,
    ) ||
    /[àâäéèêëïîôùûüç]/i.test(text)
  ) {
    return "fr";
  }
  // Default French product voice unless clearly English-only
  if (
    /\b(i have|my|pain|fever|cough|hello|since|symptoms)\b/i.test(text) &&
    !/[àâäéèêëïîôùûüç]/i.test(text)
  ) {
    return "en";
  }
  return "fr";
}

export function formatKnowledgeForPrompt(
  matches: MatchedKnowledge[],
  lang: KnowledgeLang,
): string {
  if (!matches.length) return "";

  const blocks = matches.map((m, i) => {
    const entry = m.entry;
    const title =
      entry.titles[lang] || entry.titles.en || entry.titles.fr || entry.id;
    const g =
      entry.guidance[lang] || entry.guidance.en || entry.guidance.fr;
    const sources = entry.sources
      .map((s) => `- ${s.name}: ${s.url}`)
      .join("\n");

    const lines = [
      `### [${i + 1}] ${title} (id=${entry.id}, urgencyHint=${entry.urgencyDefault})`,
      g.summary,
    ];
    if (g.emergencyIf?.length) {
      lines.push("Emergency if:", ...g.emergencyIf.map((x) => `• ${x}`));
    }
    if (g.seeDoctorIf?.length) {
      lines.push("See clinician if:", ...g.seeDoctorIf.map((x) => `• ${x}`));
    }
    if (g.selfCare?.length) {
      lines.push("General supportive measures:", ...g.selfCare.map((x) => `• ${x}`));
    }
    if (g.doNot?.length) {
      lines.push("Do not:", ...g.doNot.map((x) => `• ${x}`));
    }
    lines.push("Attributed public sources:", sources);
    return lines.join("\n");
  });

  return [
    "LOCAL PUBLIC KNOWLEDGE PACK (attributed summaries — not a diagnosis):",
    "Use these only as triage orientation. Prefer cited source URLs. Never invent drug doses or prescribe.",
    ...blocks,
  ].join("\n\n");
}

export function collectSourcesFromMatches(
  matches: MatchedKnowledge[],
): { title: string; url: string; publisher?: string }[] {
  const out: { title: string; url: string; publisher?: string }[] = [];
  const seen = new Set<string>();
  for (const m of matches) {
    for (const s of m.entry.sources) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      out.push({ title: s.name, url: s.url, publisher: s.org });
    }
  }
  return out;
}

export function getEntryById(id: string): KnowledgeEntry | undefined {
  return loadKnowledgeEntries().find((e) => e.id === id);
}

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

type Needle = {
  entryIndex: number;
  keyword: string;
  needle: string;
  /** Multi-word / phrase keywords score higher. */
  weight: number;
};

type KnowledgeIndex = {
  entries: KnowledgeEntry[];
  /** Exact token → needles (Latin/Cyrillic/Hebrew single tokens). */
  byToken: Map<string, Needle[]>;
  /** Multi-word / long needles checked only against candidate entries. */
  phrases: Needle[];
  /** All needles grouped by entry for fallback / scoring completeness. */
  byEntry: Needle[][];
};

let cachedIndex: KnowledgeIndex | null = null;

function buildIndex(): KnowledgeIndex {
  const entries = loadKnowledgeEntries();
  const byToken = new Map<string, Needle[]>();
  const phrases: Needle[] = [];
  const byEntry: Needle[][] = entries.map(() => []);

  const pushToken = (token: string, needle: Needle) => {
    const list = byToken.get(token);
    if (list) list.push(needle);
    else byToken.set(token, [needle]);
  };

  entries.forEach((entry, entryIndex) => {
    for (const lang of LANGS) {
      for (const kw of entry.keywords[lang] ?? []) {
        const needleText = normalize(kw);
        if (!needleText || needleText.length < 2) continue;
        const weight = needleText.includes(" ") ? 2.5 : 1.5;
        const item: Needle = {
          entryIndex,
          keyword: kw,
          needle: needleText,
          weight,
        };
        byEntry[entryIndex].push(item);
        if (needleText.includes(" ") || needleText.length >= 12) {
          phrases.push(item);
        } else {
          pushToken(needleText, item);
        }
      }
    }
  });

  return { entries, byToken, phrases, byEntry };
}

function getIndex(): KnowledgeIndex {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

/** Test helper — rebuild after hot-reload / fixtures. */
export function resetKnowledgeMatchIndex(): void {
  cachedIndex = null;
}

function tokenize(hay: string): string[] {
  return hay.split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 2);
}

/**
 * Score entries by keyword hits across EN/FR/HE/RU.
 * Uses a precomputed inverted index so typical symptom strings only
 * touch candidate entries instead of scanning all 200+ packs.
 */
export function matchKnowledge(
  text: string,
  limit = 3,
): MatchedKnowledge[] {
  const hay = normalize(text);
  if (!hay.trim()) return [];

  const { entries, byToken, phrases, byEntry } = getIndex();
  const candidate = new Set<number>();

  for (const token of tokenize(hay)) {
    const hits = byToken.get(token);
    if (!hits) continue;
    for (const n of hits) candidate.add(n.entryIndex);
  }

  // Phrase keywords: only test against hay once; add matching entries.
  for (const p of phrases) {
    if (hay.includes(p.needle)) candidate.add(p.entryIndex);
  }

  // If tokenization missed (very short / punctuation-heavy), fall back lightly.
  if (candidate.size === 0) {
    for (let i = 0; i < entries.length; i++) {
      for (const n of byEntry[i]) {
        if (hay.includes(n.needle)) {
          candidate.add(i);
          break;
        }
      }
    }
  }

  const scored: MatchedKnowledge[] = [];

  for (const entryIndex of candidate) {
    const entry = entries[entryIndex];
    const matchedKeywords: string[] = [];
    let score = 0;

    for (const n of byEntry[entryIndex]) {
      if (!hay.includes(n.needle)) continue;
      matchedKeywords.push(n.keyword);
      score += n.weight;
    }

    if (score > 0) {
      score *= entry.priority ?? 1;
      scored.push({
        entry,
        score,
        matchedKeywords: [...new Set(matchedKeywords)],
      });
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

/**
 * Compact knowledge injection — keeps Gemini prompt small (latency)
 * while preserving urgency cues + attributed sources.
 */
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
    const summary = (g.summary || "").trim().slice(0, 320);
    const emergency = (g.emergencyIf ?? []).slice(0, 2);
    const seeDoctor = (g.seeDoctorIf ?? []).slice(0, 2);
    const doNot = (g.doNot ?? []).slice(0, 1);
    const sources = entry.sources
      .slice(0, 2)
      .map((s) => `${s.name} ${s.url}`)
      .join(" | ");

    const lines = [
      `[${i + 1}] ${title} (id=${entry.id}; urgencyHint=${entry.urgencyDefault})`,
      summary,
    ];
    if (emergency.length) {
      lines.push(`Emergency if: ${emergency.join("; ")}`);
    }
    if (seeDoctor.length) {
      lines.push(`See clinician if: ${seeDoctor.join("; ")}`);
    }
    if (doNot.length) {
      lines.push(`Do not: ${doNot.join("; ")}`);
    }
    if (sources) lines.push(`Sources: ${sources}`);
    return lines.join("\n");
  });

  return [
    "LOCAL KNOWLEDGE PACK (attributed triage summaries — not a diagnosis):",
    "Use for orientation only. Prefer cited URLs. Never invent doses or prescribe.",
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
  return getIndex().entries.find((e) => e.id === id);
}

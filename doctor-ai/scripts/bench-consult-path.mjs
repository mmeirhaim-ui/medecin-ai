#!/usr/bin/env node
/**
 * Local micro-bench for consult pre-model path (knowledge match + prompts).
 * Usage: node --import tsx scripts/bench-consult-path.mjs
 *    or: npx tsx scripts/bench-consult-path.mjs
 */
import { performance } from "node:perf_hooks";
import {
  formatKnowledgeForPrompt,
  matchKnowledge,
  pickGuidanceLang,
  loadKnowledgeEntries,
} from "../src/lib/knowledge/index.ts";
import { buildSystemPrompt } from "../src/lib/prompts.ts";

const samples = [
  "mal de gorge léger depuis 1 jour, pas de fièvre",
  "chest pain radiating to left arm with sweating",
  "כאב ראש חזק ובחילה",
  "fièvre et toux sèche depuis 3 jours chez adulte",
  "rash itchy arms after new soap",
];

const entries = loadKnowledgeEntries();
const sys = buildSystemPrompt("fr");

// Warm index + prompt
matchKnowledge(samples[0], 3);

const N = 800;
const t0 = performance.now();
let knowledgeChars = 0;
for (let i = 0; i < N; i++) {
  const text = samples[i % samples.length];
  const matches = matchKnowledge(text, 3);
  const block = formatKnowledgeForPrompt(
    matches,
    pickGuidanceLang(text, "fr"),
  );
  knowledgeChars += block.length;
}
const avgMatchMs = (performance.now() - t0) / N;

const demo = matchKnowledge(samples[0], 3);
const demoBlock = formatKnowledgeForPrompt(
  demo,
  pickGuidanceLang(samples[0], "fr"),
);

console.log(
  JSON.stringify(
    {
      entries: entries.length,
      systemPromptChars: sys.length,
      knowledgeBlockChars: demoBlock.length,
      avgPromptChars: Math.round(knowledgeChars / N),
      matchFormatAvgMs: Number(avgMatchMs.toFixed(3)),
      sampleHits: demo.map((m) => m.entry.id),
    },
    null,
    2,
  ),
);

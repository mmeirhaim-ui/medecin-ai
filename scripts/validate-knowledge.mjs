#!/usr/bin/env node
/**
 * Validates the curated medical knowledge pack (structure + matcher smoke).
 * Run: node scripts/validate-knowledge.mjs
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(root, "data", "knowledge");
const langs = ["en", "fr", "he", "ru"];

function fail(msg) {
  console.error("FAIL:", msg);
  process.exitCode = 1;
}

const meta = JSON.parse(readFileSync(join(dataRoot, "pack.meta.json"), "utf8"));
const sourcesCatalog = JSON.parse(
  readFileSync(join(dataRoot, "sources.json"), "utf8"),
);

if (!meta.version || !Array.isArray(meta.entryFiles)) {
  fail("pack.meta.json missing version/entryFiles");
}

const entryDir = join(dataRoot, "entries");
const onDisk = readdirSync(entryDir).filter((f) => f.endsWith(".json"));
for (const f of meta.entryFiles) {
  const name = f.replace(/^entries\//, "");
  if (!onDisk.includes(name)) fail(`meta lists missing file ${f}`);
}

const entries = [];
for (const file of meta.entryFiles) {
  const entry = JSON.parse(readFileSync(join(dataRoot, file), "utf8"));
  entries.push(entry);
  for (const key of [
    "id",
    "category",
    "urgencyDefault",
    "keywords",
    "titles",
    "guidance",
    "sources",
  ]) {
    if (entry[key] == null) fail(`${entry.id || file}: missing ${key}`);
  }
  for (const lang of langs) {
    if (!entry.titles[lang]) fail(`${entry.id}: missing title.${lang}`);
    if (!entry.guidance[lang]?.summary)
      fail(`${entry.id}: missing guidance.${lang}.summary`);
    if (!Array.isArray(entry.keywords[lang]) || entry.keywords[lang].length < 1)
      fail(`${entry.id}: keywords.${lang} empty`);
  }
  if (!Array.isArray(entry.sources) || entry.sources.length < 1) {
    fail(`${entry.id}: no sources`);
  }
  for (const s of entry.sources) {
    if (!/^https?:\/\//.test(s.url)) fail(`${entry.id}: bad source url ${s.url}`);
  }
}

// Matcher smoke (inline, no TS build required)
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function match(text) {
  const hay = normalize(text);
  const scored = [];
  for (const entry of entries) {
    let score = 0;
    for (const lang of langs) {
      for (const kw of entry.keywords[lang] || []) {
        const needle = normalize(kw);
        if (needle && hay.includes(needle)) {
          score += needle.includes(" ") ? 2.5 : 1.5;
        }
      }
    }
    if (score > 0) scored.push({ id: entry.id, score: score * (entry.priority || 1) });
  }
  return scored.sort((a, b) => b.score - a.score);
}

const cases = [
  { text: "douleur dans la poitrine et essoufflement", expect: "red-flags-cardio" },
  { text: "sudden face droop and slurred speech", expect: "red-flags-stroke" },
  { text: "כאב בחזה לוחץ", expect: "red-flags-cardio" },
  { text: "боль в груди давящая", expect: "red-flags-cardio" },
  { text: "I want to kill myself", expect: "mental-health-crisis" },
  { text: "runny nose and cough for two days", expect: "respiratory-cold-flu" },
  { text: "lower right abdominal pain getting worse", expect: "gi-appendicitis" },
  { text: "hot swollen painful skin on my leg", expect: "derm-rash-cellulitis" },
  { text: "fièvre chez mon bébé de 6 semaines", expectIncludes: "fever-adult-child" },
  { text: "anaphylaxie gonflement de la gorge", expect: "red-flags-anaphylaxis" },
  { text: "asthma attack no inhaler", expect: "respiratory-asthma-attack" },
  { text: "sudden severe testicle pain", expect: "testicular-pain" },
  { text: "leg swelling one side and chest pain", expectIncludes: "clot-dvt-pe" },
  { text: "carbon monoxide headache dizziness", expect: "poisoning-carbon-monoxide" },
  { text: "heavy vaginal bleeding while pregnant and shoulder pain", expect: "pregnancy-bleeding" },
  { text: "barking cough stridor child", expect: "peds-croup" },
  { text: "heat stroke confusion hot skin", expect: "heat-illness" },
  { text: "dental abscess swollen face hard to swallow", expectIncludes: "dental-abscess" },
  { text: "fruity breath ketones diabetes vomiting", expect: "diabetes-sick-day-dka" },
  { text: "alcohol withdrawal shaking hallucinations", expect: "alcohol-withdrawal" },
  { text: "sudden confusion elderly delirium", expect: "delirium-sudden-confusion" },
  { text: "head injury concussion knocked out", expect: "head-injury-concussion" },
  { text: "fever after travel malaria Africa", expect: "malaria-travel-fever" },
  { text: "ectopic pregnancy one sided pain shoulder tip", expect: "ectopic-pregnancy" },
  { text: "panic attack racing heart anxiety", expect: "panic-anxiety" },
  { text: "whooping cough baby coughing fits", expect: "whooping-cough" },
  { text: "broken bone deformed limb after fall", expect: "broken-bone-fracture" },
  { text: "postmenopausal bleeding after menopause", expectIncludes: "menopause-postmenopausal-bleeding" },
  { text: "pneumonia coughing yellow green mucus breathless", expect: "pneumonia-red-flags" },
  { text: "newborn yellow jaundice baby not feeding", expect: "neonatal-jaundice" },
  { text: "COPD more short of breath than usual", expect: "copd-exacerbation" },
  { text: "swollen ankles breathless frothy pink phlegm", expect: "heart-failure-cues" },
  { text: "dengue fever pain behind eyes after travel", expect: "dengue-fever" },
  { text: "scarlet fever sandpaper rash strawberry tongue", expect: "scarlet-fever" },
  { text: "gallstones pain under right ribs biliary", expect: "gallstones-biliary" },
  { text: "impetigo honey crusted sores", expect: "impetigo" },
  { text: "rabies animal bite abroad bat scratch", expect: "rabies-exposure" },
  { text: "temporal arteritis temple headache jaw pain vision", expect: "temporal-arteritis" },
  { text: "migraine throbbing light sound aura zigzag", expect: "migraine" },
  { text: "cluster headache pain around one eye watering", expect: "cluster-headache" },
  { text: "acute pancreatitis severe upper abdominal pain to back", expect: "acute-pancreatitis" },
  { text: "lyme disease tick bite bullseye rash", expect: "lyme-disease" },
  { text: "how to use adrenaline auto injector EpiPen two pens", expect: "anaphylaxis-aftercare" },
];

for (const c of cases) {
  const hits = match(c.text);
  const ids = hits.map((h) => h.id);
  if (c.expect && hits[0]?.id !== c.expect) {
    fail(
      `matcher: "${c.text}" expected top ${c.expect}, got ${hits[0]?.id || "none"}`,
    );
  }
  if (c.expectIncludes && !ids.includes(c.expectIncludes)) {
    fail(
      `matcher: "${c.text}" expected includes ${c.expectIncludes}, got ${ids.join(",") || "none"}`,
    );
  }
}

console.log(
  `OK: ${entries.length} entries, ${sourcesCatalog.sources.length} catalog sources, matcher ${cases.length} cases`,
);

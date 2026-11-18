import packMeta from "../../../data/knowledge/pack.meta.json";
import cardio from "../../../data/knowledge/entries/red-flags-cardio.json";
import stroke from "../../../data/knowledge/entries/red-flags-stroke.json";
import anaphylaxis from "../../../data/knowledge/entries/red-flags-anaphylaxis.json";
import sepsis from "../../../data/knowledge/entries/red-flags-sepsis-meningitis.json";
import respiratory from "../../../data/knowledge/entries/respiratory-cold-flu.json";
import ent from "../../../data/knowledge/entries/ent-sore-throat.json";
import earSinus from "../../../data/knowledge/entries/ent-ear-sinus.json";
import fever from "../../../data/knowledge/entries/fever-adult-child.json";
import derm from "../../../data/knowledge/entries/derm-rash-cellulitis.json";
import giStomach from "../../../data/knowledge/entries/gi-stomach-vomiting.json";
import giApp from "../../../data/knowledge/entries/gi-appendicitis.json";
import headache from "../../../data/knowledge/entries/neuro-headache.json";
import mental from "../../../data/knowledge/entries/mental-health-crisis.json";
import peds from "../../../data/knowledge/entries/peds-fever-abdomen.json";
import msk from "../../../data/knowledge/entries/msk-back-joint.json";
import uro from "../../../data/knowledge/entries/uro-uti.json";
import emergency from "../../../data/knowledge/entries/emergency-when-to-er.json";
import type { KnowledgeEntry, KnowledgePackMeta } from "./types";

const ENTRIES: KnowledgeEntry[] = [
  cardio,
  stroke,
  anaphylaxis,
  sepsis,
  respiratory,
  ent,
  earSinus,
  fever,
  derm,
  giStomach,
  giApp,
  headache,
  mental,
  peds,
  msk,
  uro,
  emergency,
] as KnowledgeEntry[];

export function getPackMeta(): KnowledgePackMeta {
  return packMeta as KnowledgePackMeta;
}

export function getTrustedDomains(): string[] {
  return getPackMeta().trustedDomains;
}

export function loadKnowledgeEntries(): KnowledgeEntry[] {
  return ENTRIES;
}

/** Kept for API symmetry with earlier filesystem loader. */
export function resetKnowledgeCache(): void {
  // Static imports — nothing to reset.
}

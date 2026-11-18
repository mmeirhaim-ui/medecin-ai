import packMeta from "../../../data/knowledge/pack.meta.json";
import allergyHivesMild from "../../../data/knowledge/entries/allergy-hives-mild.json";
import antibioticsStewardshipNote from "../../../data/knowledge/entries/antibiotics-stewardship-note.json";
import burnsFirstAid from "../../../data/knowledge/entries/burns-first-aid.json";
import clotDvtPe from "../../../data/knowledge/entries/clot-dvt-pe.json";
import dentalAbscess from "../../../data/knowledge/entries/dental-abscess.json";
import dermRashCellulitis from "../../../data/knowledge/entries/derm-rash-cellulitis.json";
import diabetesSickDayDka from "../../../data/knowledge/entries/diabetes-sick-day-dka.json";
import emergencyWhenToEr from "../../../data/knowledge/entries/emergency-when-to-er.json";
import entEarSinus from "../../../data/knowledge/entries/ent-ear-sinus.json";
import entSoreThroat from "../../../data/knowledge/entries/ent-sore-throat.json";
import eyeRedVisionLoss from "../../../data/knowledge/entries/eye-red-vision-loss.json";
import feverAdultChild from "../../../data/knowledge/entries/fever-adult-child.json";
import giAppendicitis from "../../../data/knowledge/entries/gi-appendicitis.json";
import giStomachVomiting from "../../../data/knowledge/entries/gi-stomach-vomiting.json";
import heatIllness from "../../../data/knowledge/entries/heat-illness.json";
import hypertensionChestCues from "../../../data/knowledge/entries/hypertension-chest-cues.json";
import kidneyStonesFlank from "../../../data/knowledge/entries/kidney-stones-flank.json";
import mentalHealthCrisis from "../../../data/knowledge/entries/mental-health-crisis.json";
import mskBackJoint from "../../../data/knowledge/entries/msk-back-joint.json";
import neuroHeadache from "../../../data/knowledge/entries/neuro-headache.json";
import nosebleed from "../../../data/knowledge/entries/nosebleed.json";
import pedsCroup from "../../../data/knowledge/entries/peds-croup.json";
import pedsFeverAbdomen from "../../../data/knowledge/entries/peds-fever-abdomen.json";
import poisoningCarbonMonoxide from "../../../data/knowledge/entries/poisoning-carbon-monoxide.json";
import pregnancyBleeding from "../../../data/knowledge/entries/pregnancy-bleeding.json";
import redFlagsAnaphylaxis from "../../../data/knowledge/entries/red-flags-anaphylaxis.json";
import redFlagsCardio from "../../../data/knowledge/entries/red-flags-cardio.json";
import redFlagsSepsisMeningitis from "../../../data/knowledge/entries/red-flags-sepsis-meningitis.json";
import redFlagsStroke from "../../../data/knowledge/entries/red-flags-stroke.json";
import respiratoryAsthmaAttack from "../../../data/knowledge/entries/respiratory-asthma-attack.json";
import respiratoryColdFlu from "../../../data/knowledge/entries/respiratory-cold-flu.json";
import shinglesRash from "../../../data/knowledge/entries/shingles-rash.json";
import syncopeFainting from "../../../data/knowledge/entries/syncope-fainting.json";
import testicularPain from "../../../data/knowledge/entries/testicular-pain.json";
import uroUti from "../../../data/knowledge/entries/uro-uti.json";
import type { KnowledgeEntry, KnowledgePackMeta } from "./types";

const ENTRIES: KnowledgeEntry[] = [
  allergyHivesMild,
  antibioticsStewardshipNote,
  burnsFirstAid,
  clotDvtPe,
  dentalAbscess,
  dermRashCellulitis,
  diabetesSickDayDka,
  emergencyWhenToEr,
  entEarSinus,
  entSoreThroat,
  eyeRedVisionLoss,
  feverAdultChild,
  giAppendicitis,
  giStomachVomiting,
  heatIllness,
  hypertensionChestCues,
  kidneyStonesFlank,
  mentalHealthCrisis,
  mskBackJoint,
  neuroHeadache,
  nosebleed,
  pedsCroup,
  pedsFeverAbdomen,
  poisoningCarbonMonoxide,
  pregnancyBleeding,
  redFlagsAnaphylaxis,
  redFlagsCardio,
  redFlagsSepsisMeningitis,
  redFlagsStroke,
  respiratoryAsthmaAttack,
  respiratoryColdFlu,
  shinglesRash,
  syncopeFainting,
  testicularPain,
  uroUti,
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

export function resetKnowledgeCache(): void {
  // Static imports — nothing to reset.
}

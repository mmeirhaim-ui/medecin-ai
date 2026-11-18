import type { KnowledgeEntry, KnowledgePackMeta } from "./types";
import packMeta from "../../../data/knowledge/pack.meta.json";
import alcoholWithdrawal from "../../../data/knowledge/entries/alcohol-withdrawal.json";
import allergyHivesMild from "../../../data/knowledge/entries/allergy-hives-mild.json";
import antibioticsStewardshipNote from "../../../data/knowledge/entries/antibiotics-stewardship-note.json";
import atopicEczema from "../../../data/knowledge/entries/atopic-eczema.json";
import bellsPalsy from "../../../data/knowledge/entries/bells-palsy.json";
import brokenBoneFracture from "../../../data/knowledge/entries/broken-bone-fracture.json";
import burnsFirstAid from "../../../data/knowledge/entries/burns-first-aid.json";
import chickenpox from "../../../data/knowledge/entries/chickenpox.json";
import chronicKidneyDisease from "../../../data/knowledge/entries/chronic-kidney-disease.json";
import clotDvtPe from "../../../data/knowledge/entries/clot-dvt-pe.json";
import constipationAdult from "../../../data/knowledge/entries/constipation-adult.json";
import copdExacerbation from "../../../data/knowledge/entries/copd-exacerbation.json";
import dehydration from "../../../data/knowledge/entries/dehydration.json";
import deliriumSuddenConfusion from "../../../data/knowledge/entries/delirium-sudden-confusion.json";
import dengueFever from "../../../data/knowledge/entries/dengue-fever.json";
import dentalAbscess from "../../../data/knowledge/entries/dental-abscess.json";
import depressionLowMood from "../../../data/knowledge/entries/depression-low-mood.json";
import dermRashCellulitis from "../../../data/knowledge/entries/derm-rash-cellulitis.json";
import diabetesSickDayDka from "../../../data/knowledge/entries/diabetes-sick-day-dka.json";
import ectopicPregnancy from "../../../data/knowledge/entries/ectopic-pregnancy.json";
import elderlyFalls from "../../../data/knowledge/entries/elderly-falls.json";
import emergencyWhenToEr from "../../../data/knowledge/entries/emergency-when-to-er.json";
import entEarSinus from "../../../data/knowledge/entries/ent-ear-sinus.json";
import entSoreThroat from "../../../data/knowledge/entries/ent-sore-throat.json";
import eyeRedVisionLoss from "../../../data/knowledge/entries/eye-red-vision-loss.json";
import feverAdultChild from "../../../data/knowledge/entries/fever-adult-child.json";
import gallstonesBiliary from "../../../data/knowledge/entries/gallstones-biliary.json";
import giAppendicitis from "../../../data/knowledge/entries/gi-appendicitis.json";
import giStomachVomiting from "../../../data/knowledge/entries/gi-stomach-vomiting.json";
import goutFlare from "../../../data/knowledge/entries/gout-flare.json";
import haemorrhoidsPiles from "../../../data/knowledge/entries/haemorrhoids-piles.json";
import handFootMouth from "../../../data/knowledge/entries/hand-foot-mouth.json";
import headInjuryConcussion from "../../../data/knowledge/entries/head-injury-concussion.json";
import heartFailureCues from "../../../data/knowledge/entries/heart-failure-cues.json";
import heatIllness from "../../../data/knowledge/entries/heat-illness.json";
import heavyPeriods from "../../../data/knowledge/entries/heavy-periods.json";
import hypertensionChestCues from "../../../data/knowledge/entries/hypertension-chest-cues.json";
import hyperthyroidism from "../../../data/knowledge/entries/hyperthyroidism.json";
import hypothyroidism from "../../../data/knowledge/entries/hypothyroidism.json";
import ibsOrientation from "../../../data/knowledge/entries/ibs-orientation.json";
import impetigo from "../../../data/knowledge/entries/impetigo.json";
import ironDeficiencyAnaemia from "../../../data/knowledge/entries/iron-deficiency-anaemia.json";
import kidneyStonesFlank from "../../../data/knowledge/entries/kidney-stones-flank.json";
import malariaTravelFever from "../../../data/knowledge/entries/malaria-travel-fever.json";
import measles from "../../../data/knowledge/entries/measles.json";
import menopausePostmenopausalBleeding from "../../../data/knowledge/entries/menopause-postmenopausal-bleeding.json";
import mentalHealthCrisis from "../../../data/knowledge/entries/mental-health-crisis.json";
import mskBackJoint from "../../../data/knowledge/entries/msk-back-joint.json";
import neckTraumaWhiplash from "../../../data/knowledge/entries/neck-trauma-whiplash.json";
import neonatalJaundice from "../../../data/knowledge/entries/neonatal-jaundice.json";
import neuroHeadache from "../../../data/knowledge/entries/neuro-headache.json";
import nosebleed from "../../../data/knowledge/entries/nosebleed.json";
import osteoporosisFallsRisk from "../../../data/knowledge/entries/osteoporosis-falls-risk.json";
import panicAnxiety from "../../../data/knowledge/entries/panic-anxiety.json";
import pedsCroup from "../../../data/knowledge/entries/peds-croup.json";
import pedsFeverAbdomen from "../../../data/knowledge/entries/peds-fever-abdomen.json";
import pelvicInflammatoryDisease from "../../../data/knowledge/entries/pelvic-inflammatory-disease.json";
import pneumoniaRedFlags from "../../../data/knowledge/entries/pneumonia-red-flags.json";
import poisoningCarbonMonoxide from "../../../data/knowledge/entries/poisoning-carbon-monoxide.json";
import pregnancyBleeding from "../../../data/knowledge/entries/pregnancy-bleeding.json";
import psoriasis from "../../../data/knowledge/entries/psoriasis.json";
import redFlagsAnaphylaxis from "../../../data/knowledge/entries/red-flags-anaphylaxis.json";
import redFlagsCardio from "../../../data/knowledge/entries/red-flags-cardio.json";
import redFlagsSepsisMeningitis from "../../../data/knowledge/entries/red-flags-sepsis-meningitis.json";
import redFlagsStroke from "../../../data/knowledge/entries/red-flags-stroke.json";
import respiratoryAsthmaAttack from "../../../data/knowledge/entries/respiratory-asthma-attack.json";
import respiratoryColdFlu from "../../../data/knowledge/entries/respiratory-cold-flu.json";
import scarletFever from "../../../data/knowledge/entries/scarlet-fever.json";
import sciatica from "../../../data/knowledge/entries/sciatica.json";
import seizureFirstAid from "../../../data/knowledge/entries/seizure-first-aid.json";
import shinglesRash from "../../../data/knowledge/entries/shingles-rash.json";
import syncopeFainting from "../../../data/knowledge/entries/syncope-fainting.json";
import testicularPain from "../../../data/knowledge/entries/testicular-pain.json";
import thrushCandidiasis from "../../../data/knowledge/entries/thrush-candidiasis.json";
import travelVaccinesCatchup from "../../../data/knowledge/entries/travel-vaccines-catchup.json";
import typhoidFever from "../../../data/knowledge/entries/typhoid-fever.json";
import uroUti from "../../../data/knowledge/entries/uro-uti.json";
import vertigo from "../../../data/knowledge/entries/vertigo.json";
import whoopingCough from "../../../data/knowledge/entries/whooping-cough.json";

const ENTRIES = [
  alcoholWithdrawal,
  allergyHivesMild,
  antibioticsStewardshipNote,
  atopicEczema,
  bellsPalsy,
  brokenBoneFracture,
  burnsFirstAid,
  chickenpox,
  chronicKidneyDisease,
  clotDvtPe,
  constipationAdult,
  copdExacerbation,
  dehydration,
  deliriumSuddenConfusion,
  dengueFever,
  dentalAbscess,
  depressionLowMood,
  dermRashCellulitis,
  diabetesSickDayDka,
  ectopicPregnancy,
  elderlyFalls,
  emergencyWhenToEr,
  entEarSinus,
  entSoreThroat,
  eyeRedVisionLoss,
  feverAdultChild,
  gallstonesBiliary,
  giAppendicitis,
  giStomachVomiting,
  goutFlare,
  haemorrhoidsPiles,
  handFootMouth,
  headInjuryConcussion,
  heartFailureCues,
  heatIllness,
  heavyPeriods,
  hypertensionChestCues,
  hyperthyroidism,
  hypothyroidism,
  ibsOrientation,
  impetigo,
  ironDeficiencyAnaemia,
  kidneyStonesFlank,
  malariaTravelFever,
  measles,
  menopausePostmenopausalBleeding,
  mentalHealthCrisis,
  mskBackJoint,
  neckTraumaWhiplash,
  neonatalJaundice,
  neuroHeadache,
  nosebleed,
  osteoporosisFallsRisk,
  panicAnxiety,
  pedsCroup,
  pedsFeverAbdomen,
  pelvicInflammatoryDisease,
  pneumoniaRedFlags,
  poisoningCarbonMonoxide,
  pregnancyBleeding,
  psoriasis,
  redFlagsAnaphylaxis,
  redFlagsCardio,
  redFlagsSepsisMeningitis,
  redFlagsStroke,
  respiratoryAsthmaAttack,
  respiratoryColdFlu,
  scarletFever,
  sciatica,
  seizureFirstAid,
  shinglesRash,
  syncopeFainting,
  testicularPain,
  thrushCandidiasis,
  travelVaccinesCatchup,
  typhoidFever,
  uroUti,
  vertigo,
  whoopingCough,
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

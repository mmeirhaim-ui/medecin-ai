import type { KnowledgeEntry, KnowledgePackMeta } from "./types";
import packMeta from "../../../data/knowledge/pack.meta.json";
import acne from "../../../data/knowledge/entries/acne.json";
import acutePancreatitis from "../../../data/knowledge/entries/acute-pancreatitis.json";
import addisonsDisease from "../../../data/knowledge/entries/addisons-disease.json";
import alcoholPoisoning from "../../../data/knowledge/entries/alcohol-poisoning.json";
import alcoholWithdrawal from "../../../data/knowledge/entries/alcohol-withdrawal.json";
import allergyHivesMild from "../../../data/knowledge/entries/allergy-hives-mild.json";
import analFissure from "../../../data/knowledge/entries/anal-fissure.json";
import anaphylaxisAftercare from "../../../data/knowledge/entries/anaphylaxis-aftercare.json";
import angina from "../../../data/knowledge/entries/angina.json";
import antibioticsStewardshipNote from "../../../data/knowledge/entries/antibiotics-stewardship-note.json";
import asthmaInhalerTechnique from "../../../data/knowledge/entries/asthma-inhaler-technique.json";
import athletesFoot from "../../../data/knowledge/entries/athletes-foot.json";
import atopicEczema from "../../../data/knowledge/entries/atopic-eczema.json";
import atrialFibrillation from "../../../data/knowledge/entries/atrial-fibrillation.json";
import b12FolateAnaemia from "../../../data/knowledge/entries/b12-folate-anaemia.json";
import bedwetting from "../../../data/knowledge/entries/bedwetting.json";
import bellsPalsy from "../../../data/knowledge/entries/bells-palsy.json";
import boilsSkin from "../../../data/knowledge/entries/boils-skin.json";
import brokenBoneFracture from "../../../data/knowledge/entries/broken-bone-fracture.json";
import bronchitis from "../../../data/knowledge/entries/bronchitis.json";
import bunions from "../../../data/knowledge/entries/bunions.json";
import burnsFirstAid from "../../../data/knowledge/entries/burns-first-aid.json";
import carpalTunnel from "../../../data/knowledge/entries/carpal-tunnel.json";
import cataracts from "../../../data/knowledge/entries/cataracts.json";
import chickenpox from "../../../data/knowledge/entries/chickenpox.json";
import chilblains from "../../../data/knowledge/entries/chilblains.json";
import chronicKidneyDisease from "../../../data/knowledge/entries/chronic-kidney-disease.json";
import clotDvtPe from "../../../data/knowledge/entries/clot-dvt-pe.json";
import clusterHeadache from "../../../data/knowledge/entries/cluster-headache.json";
import coeliacDisease from "../../../data/knowledge/entries/coeliac-disease.json";
import coldSores from "../../../data/knowledge/entries/cold-sores.json";
import conjunctivitis from "../../../data/knowledge/entries/conjunctivitis.json";
import constipationAdult from "../../../data/knowledge/entries/constipation-adult.json";
import copdExacerbation from "../../../data/knowledge/entries/copd-exacerbation.json";
import cradleCap from "../../../data/knowledge/entries/cradle-cap.json";
import crohnsDisease from "../../../data/knowledge/entries/crohns-disease.json";
import cutsGrazes from "../../../data/knowledge/entries/cuts-grazes.json";
import dehydration from "../../../data/knowledge/entries/dehydration.json";
import deliriumSuddenConfusion from "../../../data/knowledge/entries/delirium-sudden-confusion.json";
import dengueFever from "../../../data/knowledge/entries/dengue-fever.json";
import dentalAbscess from "../../../data/knowledge/entries/dental-abscess.json";
import depressionLowMood from "../../../data/knowledge/entries/depression-low-mood.json";
import dermRashCellulitis from "../../../data/knowledge/entries/derm-rash-cellulitis.json";
import diabetesSickDayDka from "../../../data/knowledge/entries/diabetes-sick-day-dka.json";
import dislocatedShoulder from "../../../data/knowledge/entries/dislocated-shoulder.json";
import diverticulitis from "../../../data/knowledge/entries/diverticulitis.json";
import dryEyes from "../../../data/knowledge/entries/dry-eyes.json";
import earwaxBuildup from "../../../data/knowledge/entries/earwax-buildup.json";
import ectopicPregnancy from "../../../data/knowledge/entries/ectopic-pregnancy.json";
import elderlyFalls from "../../../data/knowledge/entries/elderly-falls.json";
import emergencyWhenToEr from "../../../data/knowledge/entries/emergency-when-to-er.json";
import endometriosis from "../../../data/knowledge/entries/endometriosis.json";
import entEarSinus from "../../../data/knowledge/entries/ent-ear-sinus.json";
import entSoreThroat from "../../../data/knowledge/entries/ent-sore-throat.json";
import epilepsyOrientation from "../../../data/knowledge/entries/epilepsy-orientation.json";
import eyeRedVisionLoss from "../../../data/knowledge/entries/eye-red-vision-loss.json";
import feverAdultChild from "../../../data/knowledge/entries/fever-adult-child.json";
import fibroids from "../../../data/knowledge/entries/fibroids.json";
import fibromyalgia from "../../../data/knowledge/entries/fibromyalgia.json";
import foodPoisoning from "../../../data/knowledge/entries/food-poisoning.json";
import frostbite from "../../../data/knowledge/entries/frostbite.json";
import frozenShoulder from "../../../data/knowledge/entries/frozen-shoulder.json";
import gallstonesBiliary from "../../../data/knowledge/entries/gallstones-biliary.json";
import gerdHeartburn from "../../../data/knowledge/entries/gerd-heartburn.json";
import giAppendicitis from "../../../data/knowledge/entries/gi-appendicitis.json";
import giStomachVomiting from "../../../data/knowledge/entries/gi-stomach-vomiting.json";
import glandularFever from "../../../data/knowledge/entries/glandular-fever.json";
import glaucoma from "../../../data/knowledge/entries/glaucoma.json";
import glueEar from "../../../data/knowledge/entries/glue-ear.json";
import goutFlare from "../../../data/knowledge/entries/gout-flare.json";
import haemorrhoidsPiles from "../../../data/knowledge/entries/haemorrhoids-piles.json";
import handFootMouth from "../../../data/knowledge/entries/hand-foot-mouth.json";
import headInjuryConcussion from "../../../data/knowledge/entries/head-injury-concussion.json";
import headLiceNits from "../../../data/knowledge/entries/head-lice-nits.json";
import hearingLossSudden from "../../../data/knowledge/entries/hearing-loss-sudden.json";
import heartFailureCues from "../../../data/knowledge/entries/heart-failure-cues.json";
import heatIllness from "../../../data/knowledge/entries/heat-illness.json";
import heavyPeriods from "../../../data/knowledge/entries/heavy-periods.json";
import hepatitisA from "../../../data/knowledge/entries/hepatitis-a.json";
import hernia from "../../../data/knowledge/entries/hernia.json";
import hiatusHernia from "../../../data/knowledge/entries/hiatus-hernia.json";
import hiccupsPersistent from "../../../data/knowledge/entries/hiccups-persistent.json";
import hyperglycaemia from "../../../data/knowledge/entries/hyperglycaemia.json";
import hypertensionChestCues from "../../../data/knowledge/entries/hypertension-chest-cues.json";
import hyperthyroidism from "../../../data/knowledge/entries/hyperthyroidism.json";
import hypoglycaemia from "../../../data/knowledge/entries/hypoglycaemia.json";
import hypothyroidism from "../../../data/knowledge/entries/hypothyroidism.json";
import ibsOrientation from "../../../data/knowledge/entries/ibs-orientation.json";
import impetigo from "../../../data/knowledge/entries/impetigo.json";
import insectBitesStings from "../../../data/knowledge/entries/insect-bites-stings.json";
import insomnia from "../../../data/knowledge/entries/insomnia.json";
import ironDeficiencyAnaemia from "../../../data/knowledge/entries/iron-deficiency-anaemia.json";
import kidneyStonesFlank from "../../../data/knowledge/entries/kidney-stones-flank.json";
import labyrinthitis from "../../../data/knowledge/entries/labyrinthitis.json";
import laryngitis from "../../../data/knowledge/entries/laryngitis.json";
import legCramps from "../../../data/knowledge/entries/leg-cramps.json";
import lupus from "../../../data/knowledge/entries/lupus.json";
import lymeDisease from "../../../data/knowledge/entries/lyme-disease.json";
import macularDegeneration from "../../../data/knowledge/entries/macular-degeneration.json";
import malariaTravelFever from "../../../data/knowledge/entries/malaria-travel-fever.json";
import mastitis from "../../../data/knowledge/entries/mastitis.json";
import meCfs from "../../../data/knowledge/entries/me-cfs.json";
import measles from "../../../data/knowledge/entries/measles.json";
import menopausePostmenopausalBleeding from "../../../data/knowledge/entries/menopause-postmenopausal-bleeding.json";
import mentalHealthCrisis from "../../../data/knowledge/entries/mental-health-crisis.json";
import migraine from "../../../data/knowledge/entries/migraine.json";
import miscarriageBleeding from "../../../data/knowledge/entries/miscarriage-bleeding.json";
import motionSickness from "../../../data/knowledge/entries/motion-sickness.json";
import mouthUlcers from "../../../data/knowledge/entries/mouth-ulcers.json";
import mskBackJoint from "../../../data/knowledge/entries/msk-back-joint.json";
import multipleSclerosis from "../../../data/knowledge/entries/multiple-sclerosis.json";
import mumps from "../../../data/knowledge/entries/mumps.json";
import nappyRash from "../../../data/knowledge/entries/nappy-rash.json";
import neckTraumaWhiplash from "../../../data/knowledge/entries/neck-trauma-whiplash.json";
import neonatalJaundice from "../../../data/knowledge/entries/neonatal-jaundice.json";
import neuroHeadache from "../../../data/knowledge/entries/neuro-headache.json";
import norovirus from "../../../data/knowledge/entries/norovirus.json";
import nosebleed from "../../../data/knowledge/entries/nosebleed.json";
import oralThrush from "../../../data/knowledge/entries/oral-thrush.json";
import osteoporosisFallsRisk from "../../../data/knowledge/entries/osteoporosis-falls-risk.json";
import ovarianCyst from "../../../data/knowledge/entries/ovarian-cyst.json";
import panicAnxiety from "../../../data/knowledge/entries/panic-anxiety.json";
import parkinsonsDisease from "../../../data/knowledge/entries/parkinsons-disease.json";
import pcos from "../../../data/knowledge/entries/pcos.json";
import pedsCroup from "../../../data/knowledge/entries/peds-croup.json";
import pedsFeverAbdomen from "../../../data/knowledge/entries/peds-fever-abdomen.json";
import pelvicInflammatoryDisease from "../../../data/knowledge/entries/pelvic-inflammatory-disease.json";
import plantarFasciitis from "../../../data/knowledge/entries/plantar-fasciitis.json";
import pleurisy from "../../../data/knowledge/entries/pleurisy.json";
import pneumoniaRedFlags from "../../../data/knowledge/entries/pneumonia-red-flags.json";
import poisoningCarbonMonoxide from "../../../data/knowledge/entries/poisoning-carbon-monoxide.json";
import poisoningOverdose from "../../../data/knowledge/entries/poisoning-overdose.json";
import polymyalgiaRheumatica from "../../../data/knowledge/entries/polymyalgia-rheumatica.json";
import preEclampsia from "../../../data/knowledge/entries/pre-eclampsia.json";
import pregnancyBleeding from "../../../data/knowledge/entries/pregnancy-bleeding.json";
import prostateEnlargement from "../../../data/knowledge/entries/prostate-enlargement.json";
import prostatitis from "../../../data/knowledge/entries/prostatitis.json";
import psoriasis from "../../../data/knowledge/entries/psoriasis.json";
import quinsyAbscess from "../../../data/knowledge/entries/quinsy-abscess.json";
import rabiesExposure from "../../../data/knowledge/entries/rabies-exposure.json";
import rectalBleeding from "../../../data/knowledge/entries/rectal-bleeding.json";
import redFlagsAnaphylaxis from "../../../data/knowledge/entries/red-flags-anaphylaxis.json";
import redFlagsCardio from "../../../data/knowledge/entries/red-flags-cardio.json";
import redFlagsSepsisMeningitis from "../../../data/knowledge/entries/red-flags-sepsis-meningitis.json";
import redFlagsStroke from "../../../data/knowledge/entries/red-flags-stroke.json";
import respiratoryAsthmaAttack from "../../../data/knowledge/entries/respiratory-asthma-attack.json";
import respiratoryColdFlu from "../../../data/knowledge/entries/respiratory-cold-flu.json";
import restlessLegs from "../../../data/knowledge/entries/restless-legs.json";
import rheumatoidArthritis from "../../../data/knowledge/entries/rheumatoid-arthritis.json";
import ringworm from "../../../data/knowledge/entries/ringworm.json";
import rosacea from "../../../data/knowledge/entries/rosacea.json";
import scabies from "../../../data/knowledge/entries/scabies.json";
import scarletFever from "../../../data/knowledge/entries/scarlet-fever.json";
import sciatica from "../../../data/knowledge/entries/sciatica.json";
import seizureFirstAid from "../../../data/knowledge/entries/seizure-first-aid.json";
import shinglesRash from "../../../data/knowledge/entries/shingles-rash.json";
import slappedCheek from "../../../data/knowledge/entries/slapped-cheek.json";
import sleepApnoea from "../../../data/knowledge/entries/sleep-apnoea.json";
import snakeBites from "../../../data/knowledge/entries/snake-bites.json";
import sprainsStrains from "../../../data/knowledge/entries/sprains-strains.json";
import stiChlamydia from "../../../data/knowledge/entries/sti-chlamydia.json";
import stiGonorrhoea from "../../../data/knowledge/entries/sti-gonorrhoea.json";
import sunburn from "../../../data/knowledge/entries/sunburn.json";
import syncopeFainting from "../../../data/knowledge/entries/syncope-fainting.json";
import temporalArteritis from "../../../data/knowledge/entries/temporal-arteritis.json";
import tennisElbow from "../../../data/knowledge/entries/tennis-elbow.json";
import testicularPain from "../../../data/knowledge/entries/testicular-pain.json";
import threadworms from "../../../data/knowledge/entries/threadworms.json";
import thrushCandidiasis from "../../../data/knowledge/entries/thrush-candidiasis.json";
import tinnitus from "../../../data/knowledge/entries/tinnitus.json";
import tonsillitis from "../../../data/knowledge/entries/tonsillitis.json";
import travelVaccinesCatchup from "../../../data/knowledge/entries/travel-vaccines-catchup.json";
import trigeminalNeuralgia from "../../../data/knowledge/entries/trigeminal-neuralgia.json";
import typhoidFever from "../../../data/knowledge/entries/typhoid-fever.json";
import ulcerativeColitis from "../../../data/knowledge/entries/ulcerative-colitis.json";
import uroUti from "../../../data/knowledge/entries/uro-uti.json";
import varicoseVeins from "../../../data/knowledge/entries/varicose-veins.json";
import vertigo from "../../../data/knowledge/entries/vertigo.json";
import vomitingBlood from "../../../data/knowledge/entries/vomiting-blood.json";
import wartsVerrucas from "../../../data/knowledge/entries/warts-verrucas.json";
import whoopingCough from "../../../data/knowledge/entries/whooping-cough.json";

const ENTRIES = [
  acne,
  acutePancreatitis,
  addisonsDisease,
  alcoholPoisoning,
  alcoholWithdrawal,
  allergyHivesMild,
  analFissure,
  anaphylaxisAftercare,
  angina,
  antibioticsStewardshipNote,
  asthmaInhalerTechnique,
  athletesFoot,
  atopicEczema,
  atrialFibrillation,
  b12FolateAnaemia,
  bedwetting,
  bellsPalsy,
  boilsSkin,
  brokenBoneFracture,
  bronchitis,
  bunions,
  burnsFirstAid,
  carpalTunnel,
  cataracts,
  chickenpox,
  chilblains,
  chronicKidneyDisease,
  clotDvtPe,
  clusterHeadache,
  coeliacDisease,
  coldSores,
  conjunctivitis,
  constipationAdult,
  copdExacerbation,
  cradleCap,
  crohnsDisease,
  cutsGrazes,
  dehydration,
  deliriumSuddenConfusion,
  dengueFever,
  dentalAbscess,
  depressionLowMood,
  dermRashCellulitis,
  diabetesSickDayDka,
  dislocatedShoulder,
  diverticulitis,
  dryEyes,
  earwaxBuildup,
  ectopicPregnancy,
  elderlyFalls,
  emergencyWhenToEr,
  endometriosis,
  entEarSinus,
  entSoreThroat,
  epilepsyOrientation,
  eyeRedVisionLoss,
  feverAdultChild,
  fibroids,
  fibromyalgia,
  foodPoisoning,
  frostbite,
  frozenShoulder,
  gallstonesBiliary,
  gerdHeartburn,
  giAppendicitis,
  giStomachVomiting,
  glandularFever,
  glaucoma,
  glueEar,
  goutFlare,
  haemorrhoidsPiles,
  handFootMouth,
  headInjuryConcussion,
  headLiceNits,
  hearingLossSudden,
  heartFailureCues,
  heatIllness,
  heavyPeriods,
  hepatitisA,
  hernia,
  hiatusHernia,
  hiccupsPersistent,
  hyperglycaemia,
  hypertensionChestCues,
  hyperthyroidism,
  hypoglycaemia,
  hypothyroidism,
  ibsOrientation,
  impetigo,
  insectBitesStings,
  insomnia,
  ironDeficiencyAnaemia,
  kidneyStonesFlank,
  labyrinthitis,
  laryngitis,
  legCramps,
  lupus,
  lymeDisease,
  macularDegeneration,
  malariaTravelFever,
  mastitis,
  meCfs,
  measles,
  menopausePostmenopausalBleeding,
  mentalHealthCrisis,
  migraine,
  miscarriageBleeding,
  motionSickness,
  mouthUlcers,
  mskBackJoint,
  multipleSclerosis,
  mumps,
  nappyRash,
  neckTraumaWhiplash,
  neonatalJaundice,
  neuroHeadache,
  norovirus,
  nosebleed,
  oralThrush,
  osteoporosisFallsRisk,
  ovarianCyst,
  panicAnxiety,
  parkinsonsDisease,
  pcos,
  pedsCroup,
  pedsFeverAbdomen,
  pelvicInflammatoryDisease,
  plantarFasciitis,
  pleurisy,
  pneumoniaRedFlags,
  poisoningCarbonMonoxide,
  poisoningOverdose,
  polymyalgiaRheumatica,
  preEclampsia,
  pregnancyBleeding,
  prostateEnlargement,
  prostatitis,
  psoriasis,
  quinsyAbscess,
  rabiesExposure,
  rectalBleeding,
  redFlagsAnaphylaxis,
  redFlagsCardio,
  redFlagsSepsisMeningitis,
  redFlagsStroke,
  respiratoryAsthmaAttack,
  respiratoryColdFlu,
  restlessLegs,
  rheumatoidArthritis,
  ringworm,
  rosacea,
  scabies,
  scarletFever,
  sciatica,
  seizureFirstAid,
  shinglesRash,
  slappedCheek,
  sleepApnoea,
  snakeBites,
  sprainsStrains,
  stiChlamydia,
  stiGonorrhoea,
  sunburn,
  syncopeFainting,
  temporalArteritis,
  tennisElbow,
  testicularPain,
  threadworms,
  thrushCandidiasis,
  tinnitus,
  tonsillitis,
  travelVaccinesCatchup,
  trigeminalNeuralgia,
  typhoidFever,
  ulcerativeColitis,
  uroUti,
  varicoseVeins,
  vertigo,
  vomitingBlood,
  wartsVerrucas,
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

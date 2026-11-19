#!/usr/bin/env node
/**
 * Batch 4 knowledge entries — paraphrased from public NHS (and CDC/WHO where noted) only.
 */
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsJaundice: { id: "nhs-jaundice-babies", name: "NHS — Jaundice in babies", org: "NHS", url: "https://www.nhs.uk/conditions/jaundice-in-babies/", retrievedAt: R },
  nhsCopd: { id: "nhs-copd", name: "NHS — Chronic obstructive pulmonary disease (COPD)", org: "NHS", url: "https://www.nhs.uk/conditions/chronic-obstructive-pulmonary-disease-copd/", retrievedAt: R },
  nhsHf: { id: "nhs-heart-failure", name: "NHS — Heart failure", org: "NHS", url: "https://www.nhs.uk/conditions/heart-failure/", retrievedAt: R },
  nhsCkd: { id: "nhs-ckd", name: "NHS — Chronic kidney disease", org: "NHS", url: "https://www.nhs.uk/conditions/kidney-disease/", retrievedAt: R },
  nhsDengue: { id: "nhs-dengue", name: "NHS — Dengue", org: "NHS", url: "https://www.nhs.uk/conditions/dengue/", retrievedAt: R },
  nhsTyphoid: { id: "nhs-typhoid", name: "NHS — Typhoid fever", org: "NHS", url: "https://www.nhs.uk/conditions/typhoid-fever/", retrievedAt: R },
  nhsScarlet: { id: "nhs-scarlet-fever", name: "NHS — Scarlet fever", org: "NHS", url: "https://www.nhs.uk/conditions/scarlet-fever/", retrievedAt: R },
  nhsHfmd: { id: "nhs-hand-foot-mouth", name: "NHS — Hand, foot and mouth disease", org: "NHS", url: "https://www.nhs.uk/conditions/hand-foot-mouth-disease/", retrievedAt: R },
  nhsGallstones: { id: "nhs-gallstones", name: "NHS — Gallstones", org: "NHS", url: "https://www.nhs.uk/conditions/gallstones/", retrievedAt: R },
  nhsHypothyroid: { id: "nhs-hypothyroidism", name: "NHS — Underactive thyroid (hypothyroidism)", org: "NHS", url: "https://www.nhs.uk/conditions/underactive-thyroid-hypothyroidism/", retrievedAt: R },
  nhsHyperthyroid: { id: "nhs-hyperthyroidism", name: "NHS — Overactive thyroid (hyperthyroidism)", org: "NHS", url: "https://www.nhs.uk/conditions/overactive-thyroid-hyperthyroidism/", retrievedAt: R },
  nhsAnaemia: { id: "nhs-iron-deficiency-anaemia", name: "NHS — Iron deficiency anaemia", org: "NHS", url: "https://www.nhs.uk/conditions/iron-deficiency-anaemia/", retrievedAt: R },
  nhsConstipation: { id: "nhs-constipation", name: "NHS — Constipation", org: "NHS", url: "https://www.nhs.uk/conditions/constipation/", retrievedAt: R },
  nhsHaemorrhoids: { id: "nhs-piles", name: "NHS — Piles (haemorrhoids)", org: "NHS", url: "https://www.nhs.uk/conditions/piles-haemorrhoids/", retrievedAt: R },
  nhsIbs: { id: "nhs-ibs", name: "NHS — Irritable bowel syndrome (IBS)", org: "NHS", url: "https://www.nhs.uk/conditions/irritable-bowel-syndrome-ibs/", retrievedAt: R },
  nhsCystitis: { id: "nhs-cystitis", name: "NHS — Cystitis", org: "NHS", url: "https://www.nhs.uk/conditions/cystitis/", retrievedAt: R },
  nhsSinusitis: { id: "nhs-sinusitis", name: "NHS — Sinusitis (sinus infection)", org: "NHS", url: "https://www.nhs.uk/conditions/sinusitis-sinus-infection/", retrievedAt: R },
  nhsEczema: { id: "nhs-atopic-eczema", name: "NHS — Atopic eczema", org: "NHS", url: "https://www.nhs.uk/conditions/atopic-eczema/", retrievedAt: R },
  nhsPsoriasis: { id: "nhs-psoriasis", name: "NHS — Psoriasis", org: "NHS", url: "https://www.nhs.uk/conditions/psoriasis/", retrievedAt: R },
  nhsImpetigo: { id: "nhs-impetigo", name: "NHS — Impetigo", org: "NHS", url: "https://www.nhs.uk/conditions/impetigo/", retrievedAt: R },
};

const entries = [
  {
    id: "neonatal-jaundice",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 8,
    keywords: {
      en: ["jaundice baby", "newborn yellow", "yellow eyes baby", "neonatal jaundice"],
      fr: ["ictère nouveau-né", "jaunisse bébé", "yeux jaunes bébé", "ictère néonatal"],
      he: ["צהבת ביילוד", "תינוק צהוב", "עיניים צהובות בתינוק", "צהבת ילודים"],
      ru: ["желтуха новорождённых", "жёлтый малыш", "жёлтые глаза у новорождённого"],
    },
    titles: { en: "Jaundice in babies", fr: "Ictère du nouveau-né", he: "צהבת ביילודים", ru: "Желтуха новорождённых" },
    guidance: g(
      { summary: "Newborn jaundice (yellow eyes/skin) is common and often settles in ~2 weeks. NHS: emergency care if jaundice with sleepiness/hard to wake, not feeding, floppy/stiff/jerks, fever or very low temp, no wet nappies, breathing difficulty, or age <24 hours. Encourage regular feeds; treatment (e.g. phototherapy) is clinician-led — not prescribed here.", emergencyIf: ["Jaundice and sleepier than normal / difficult to wake", "Not feeding", "Floppy, stiff, jerking or twitching", "High temperature ≥38°C or low ≤36°C / hot-cold / shivering", "No wet nappies", "Difficulty breathing / grunting / very fast breathing", "Baby less than 24 hours old with jaundice"], seeDoctorIf: ["Any jaundice — midwife/GP advice", "Feeding difficulties or unsure feeds are enough"], selfCare: ["Encourage regular feeds (~8–12/day); wake sleepy babies for feeds if advised"], doNot: ["Do not invent phototherapy or bilirubin thresholds", "Do not delay if baby <24h with jaundice"] },
      { summary: "L'ictère néonatal est fréquent et s'améliore souvent en ~2 semaines. Urgence si somnolence, non-alimentation, hypotonie/raideur/secousses, fièvre/hypothermie, pas de couches mouillées, détresse, âge <24 h.", emergencyIf: ["Somnolence / réveil difficile", "Ne mange pas", "Mou, raide, secousses", "Fièvre ≥38°C ou ≤36°C", "Pas de couches mouillées", "Détresse respiratoire", "Moins de 24 h de vie"], seeDoctorIf: ["Tout ictère — avis sage-femme/médecin"], selfCare: ["Tétées/biberons réguliers"], doNot: ["Pas de photothérapie inventée"] },
      { summary: "צהבת ביילודים נפוצה ולרוב חולפת תוך כשבועיים. חירום אם ישנוניות, לא אוכל, רפיון/נוקשות/עוויתות, חום/היפותרמיה, ללא חיתולים רטובים, קושי נשימה, או גיל <24 שעות.", emergencyIf: ["ישנוניות / קשה להעיר", "לא אוכל", "רפוי/נוקשה/עוויתות", "חום ≥38 או ≤36", "אין חיתולים רטובים", "קושי נשימה", "מתחת ל־24 שעות"], seeDoctorIf: ["כל צהבת — ייעוץ מיילדת/רופא"], selfCare: ["האכלות סדירות"], doNot: ["אין פוטותרפיה מומצאת"] },
      { summary: "Желтуха новорождённых часта и часто проходит за ~2 недели. Неотложка при сонливости, отказе от еды, вялости/скованности/подёргиваниях, лихорадке/гипотермии, отсутствии мокрых подгузников, одышке, возрасте <24 ч.", emergencyIf: ["Сонливость / трудно разбудить", "Не ест", "Вялый, скованный, подёргивания", "Температура ≥38 или ≤36", "Нет мокрых подгузников", "Затруднённое дыхание", "Младше 24 часов"], seeDoctorIf: ["Любая желтуха — совет акушерки/врача"], selfCare: ["Регулярные кормления"], doNot: ["Не изобретать фототерапию"] }
    ),
    sources: [S.nhsJaundice],
  },
  {
    id: "copd-exacerbation",
    category: "respiratory",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["COPD", "chronic obstructive", "COPD breathless", "emphysema flare", "chronic bronchitis flare"],
      fr: ["BPCO", "bronchopneumopathie chronique", "BPCO essoufflement", "exacerbation BPCO"],
      he: ["COPD", "מחלת ריאות חסימתית", "החמרת COPD", "קוצר נשימה COPD"],
      ru: ["ХОБЛ", "обострение ХОБЛ", "эмфизема одышка", "хронический бронхит обострение"],
    },
    titles: { en: "COPD — worsening breathlessness", fr: "BPCO — essoufflement qui empire", he: "COPD — החמרת קוצר נשימה", ru: "ХОБЛ — усиление одышки" },
    guidance: g(
      { summary: "COPD causes persistent cough with phlegm and breathlessness. NHS: urgent advice if more short of breath than usual, coughing blood, one-leg pain/swelling, or palpitations; emergency if severe breathing difficulty, tight/heavy chest, pain spreading to arms/back/neck/jaw, blue/grey colour, or sudden confusion. Inhalers/steroids/antibiotics are clinician-prescribed only.", emergencyIf: ["Severe difficulty breathing — gasping, choking, unable to speak", "Chest tight or heavy", "Pain spreading to arms, back, neck or jaw", "Lips/skin pale, blue or grey", "Sudden confusion"], seeDoctorIf: ["More short of breath than usual", "Coughing up blood", "Pain or swelling in one leg", "Heart palpitations"], doNot: ["Do not invent inhaler, steroid, or antibiotic regimens", "Do not delay if struggling to breathe"] },
      { summary: "La BPCO provoque toux chronique et dyspnée. Avis urgent si dyspnée accrue, hémoptysie, douleur/gonflement d'une jambe, palpitations ; urgence si détresse, oppression, douleur irradiée, cyanose, confusion.", emergencyIf: ["Détresse respiratoire sévère", "Oppression thoracique", "Douleur vers bras/dos/cou/mâchoire", "Lèvres/peau bleues ou grises", "Confusion brutale"], seeDoctorIf: ["Plus essoufflé que d'habitude", "Crachats de sang", "Jambe douloureuse/gonflée", "Palpitations"], doNot: ["Pas de schémas d'inhalateurs/corticoïdes/antibiotiques inventés"] },
      { summary: "COPD גורמת לשיעול כרוני וקוצר נשימה. ייעוץ דחוף אם קוצר נשימה מוגבר, שיעול דם, כאב/נפיחות ברגל אחת, דפיקות לב; חירום אם מצוקה נשימתית, לחץ בחזה, כאב מקרין, כחלחלות, בלבול.", emergencyIf: ["קושי נשימה חמור", "לחץ בחזה", "כאב לידיים/גב/צוואר/לסת", "שפתיים/עור כחולים או אפורים", "בלבול פתאומי"], seeDoctorIf: ["יותר קוצר נשימה מהרגיל", "שיעול דם", "כאב/נפיחות ברגל אחת", "דפיקות לב"], doNot: ["אין מינון משאפים/סטרואידים/אנטיביוטיקה מומצא"] },
      { summary: "ХОБЛ даёт хронический кашель с мокротой и одышку. Срочно при усилении одышки, кровохарканье, боли/отёке одной ноги, пальпитациях; неотложка при тяжёлой одышке, тяжести в груди, иррадиирующей боли, цианозе, спутанности.", emergencyIf: ["Тяжёлая одышка", "Тяжесть в груди", "Боль в руки/спину/шею/челюсть", "Синие/серые губы/кожа", "Внезапная спутанность"], seeDoctorIf: ["Одышка сильнее обычного", "Кровь при кашле", "Боль/отёк одной ноги", "Сердцебиение"], doNot: ["Не изобретать схемы ингаляторов/стероидов/антибиотиков"] }
    ),
    sources: [S.nhsCopd],
  },
  {
    id: "heart-failure-cues",
    category: "cardio",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["heart failure", "swollen ankles breathless", "frothy pink phlegm", "orthopnea lying flat"],
      fr: ["insuffisance cardiaque", "cheville gonflées essoufflement", "crachats mousseux rosés", "orthopnée"],
      he: ["אי ספיקת לב", "קרסוליים נפוחים קוצר נשימה", "ליחה ורודה קצפית", "קושי לשכב שטוח"],
      ru: ["сердечная недостаточность", "отёк лодыжек одышка", "пенистая розовая мокрота", "ортопноэ"],
    },
    titles: { en: "Heart failure symptom cues", fr: "Insuffisance cardiaque — orientation", he: "אי־ספיקת לב — הכוונה", ru: "Сердечная недостаточность — ориентиры" },
    guidance: g(
      { summary: "Heart failure means the heart cannot pump well enough. NHS symptoms include breathlessness on activity or lying flat, tiredness, ankle/leg/tummy swelling, sudden weight gain, night cough, frothy pink phlegm. New/worsening symptoms need clinical review; severe breathing difficulty or blue/grey colour is emergency. Medicines (diuretics, etc.) are clinician-only — no doses here.", emergencyIf: ["Severe difficulty breathing", "Lips/skin pale, blue or grey", "Chest pain suggestive of heart attack", "Sudden severe breathlessness with frothy pink phlegm"], seeDoctorIf: ["New breathlessness on exertion or lying flat", "Swelling of feet/ankles/legs/tummy", "Sudden weight gain", "Night cough or frothy pink phlegm"], doNot: ["Do not invent diuretic or heart-failure drug doses", "Do not stop prescribed medicines without advice"] },
      { summary: "L'insuffisance cardiaque perturbe le pompage. Dyspnée, œdèmes, prise de poids rapide, toux nocturne, crachats rosés = avis médical. Détresse/cyanose = urgence. Pas de diurétiques inventés.", emergencyIf: ["Détresse respiratoire sévère", "Lèvres/peau bleues ou grises", "Douleur thoracique type infarctus", "Dyspnée brutale avec crachats mousseux rosés"], seeDoctorIf: ["Nouvelle dyspnée à l'effort ou allongé", "Œdèmes", "Prise de poids soudaine", "Toux nocturne / crachats rosés"], doNot: ["Pas de doses de diurétiques inventées"] },
      { summary: "אי־ספיקת לב = הלב לא שואב מספיק. קוצר נשימה, בצקות, עלייה במשקל, שיעול לילי, ליחה ורודה — ייעוץ. מצוקה/כחלחלות — חירום. אין משתנים מומצאים.", emergencyIf: ["קושי נשימה חמור", "שפתיים/עור כחולים או אפורים", "כאב חזה חשוד להתקף לב", "קוצר נשימה פתאומי עם ליחה ורודה קצפית"], seeDoctorIf: ["קוצר נשימה חדש במאמץ או בשכיבה", "בצקות", "עלייה פתאומית במשקל", "שיעול לילי / ליחה ורודה"], doNot: ["אין מינון משתנים מומצא"] },
      { summary: "Сердечная недостаточность — сердце плохо качает. Одышка, отёки, быстрый набор веса, ночной кашель, розовая мокрота — к врачу. Тяжёлая одышка/цианоз — неотложка. Диуретики не выдумывать.", emergencyIf: ["Тяжёлая одышка", "Синие/серые губы/кожа", "Боль в груди как при инфаркте", "Внезапная одышка с пенистой розовой мокротой"], seeDoctorIf: ["Новая одышка при нагрузке или лёжа", "Отёки", "Внезапный набор веса", "Ночной кашель / розовая мокрота"], doNot: ["Не изобретать дозы диуретиков"] }
    ),
    sources: [S.nhsHf],
  },
  {
    id: "chronic-kidney-disease",
    category: "uro",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["chronic kidney disease", "CKD", "kidney disease tired swelling", "blood in urine kidney"],
      fr: ["insuffisance rénale chronique", "IRC", "maladie rénale fatigue œdème", "sang dans les urines reins"],
      he: ["מחלת כליות כרונית", "אי ספיקת כליות", "עייפות ובצקת כליות", "דם בשתן כליות"],
      ru: ["хроническая болезнь почек", "ХБП", "болезнь почек усталость отёк", "кровь в моче почки"],
    },
    titles: { en: "Chronic kidney disease (orientation)", fr: "Maladie rénale chronique (orientation)", he: "מחלת כליות כרונית (הכוונה)", ru: "Хроническая болезнь почек (ориентация)" },
    guidance: g(
      { summary: "Early CKD often has no symptoms and is found on blood/urine tests. Later: tiredness, ankle/hand swelling, breathlessness, nausea, blood in urine. See a GP for persistent worrying symptoms. Acute severe illness with no urine output or severe breathlessness needs urgent care. No inventing ACE-inhibitor or ESA doses.", emergencyIf: ["No urine output with severe illness", "Severe breathlessness with suspected fluid overload", "Chest pain or collapse"], seeDoctorIf: ["Persistent tiredness, swelling, breathlessness, nausea, or blood in urine", "Known diabetes/hypertension — discuss kidney checks"], doNot: ["Do not invent kidney-drug doses", "Do not stop prescribed medicines without advice"] },
      { summary: "L'IRC précoce est souvent silencieuse. Plus tard : fatigue, œdèmes, dyspnée, nausées, hématurie. Avis médical. Pas de posologies inventées.", emergencyIf: ["Anurie avec maladie grave", "Dyspnée sévère avec surcharge liquidienne suspectée"], seeDoctorIf: ["Fatigue, œdèmes, dyspnée, nausées ou sang dans les urines persistants"], doNot: ["Pas de doses de médicaments rénaux inventées"] },
      { summary: "CKD מוקדמת לרוב ללא תסמינים. בהמשך: עייפות, בצקות, קוצר נשימה, בחילה, דם בשתן. ייעוץ רפואי. אין מינונים מומצאים.", emergencyIf: ["אין שתן עם מחלה קשה", "קוצר נשימה חמור עם חשד לעומס נוזלים"], seeDoctorIf: ["עייפות, בצקות, קוצר נשימה, בחילה או דם בשתן מתמשכים"], doNot: ["אין מינון תרופות כליה מומצא"] },
      { summary: "Ранняя ХБП часто бессимптомна. Позже: усталость, отёки, одышка, тошнота, кровь в моче. К врачу. Дозы не выдумывать.", emergencyIf: ["Нет мочи при тяжёлом состоянии", "Тяжёлая одышка с подозрением на гиперволемию"], seeDoctorIf: ["Стойкая усталость, отёки, одышка, тошнота или кровь в моче"], doNot: ["Не изобретать дозы почечных препаратов"] }
    ),
    sources: [S.nhsCkd],
  },
  {
    id: "dengue-fever",
    category: "travel",
    urgencyDefault: "voir_medecin",
    priority: 7,
    keywords: {
      en: ["dengue", "dengue fever", "pain behind eyes travel", "severe dengue"],
      fr: ["dengue", "fièvre dengue", "douleur derrière les yeux voyage", "dengue sévère"],
      he: ["דנגי", "קדחת דנגי", "כאב מאחורי העיניים אחרי נסיעה", "דנגי חמור"],
      ru: ["денге", "лихорадка денге", "боль за глазами после поездки", "тяжёлая денге"],
    },
    titles: { en: "Dengue (travel fever)", fr: "Dengue (fièvre du voyageur)", he: "דנגי (חום אחרי נסיעה)", ru: "Денге (лихорадка путешественника)" },
    guidance: g(
      { summary: "Dengue is mosquito-borne. Symptoms can resemble flu (fever, severe headache, pain behind eyes, muscle/joint pain, rash). NHS: seek urgent advice if unwell after travel to a dengue area. Severe dengue (severe tummy pain, repeated vomiting, fast breathing, bleeding gums/nose, extreme fatigue/restlessness, blood in vomit/stool) needs emergency care. Rest, fluids, paracetamol — avoid inventing NSAID advice conflicting with bleeding risk; no antiviral doses.", emergencyIf: ["Severe tummy pain after dengue-risk travel", "Repeatedly being sick", "Fast breathing", "Bleeding gums or nose", "Extreme fatigue or restlessness", "Blood in vomit or stool"], seeDoctorIf: ["Unwell after travel to a dengue-risk country — say where you travelled"], selfCare: ["Rest; plenty of fluids; paracetamol for fever/pain per label if suitable"], doNot: ["Do not invent antivirals", "Do not ignore severe dengue symptoms"] },
      { summary: "La dengue est transmise par moustiques. Fièvre, céphalées, douleur rétro-orbitaire, myalgies, éruption. Avis urgent après voyage. Dengue sévère = urgence. Repos, hydratation, paracétamol.", emergencyIf: ["Douleur abdominale sévère", "Vomissements répétés", "Respiration rapide", "Saignements gencives/nez", "Fatigue extrême / agitation", "Sang dans vomi/selles"], seeDoctorIf: ["Malade après voyage en zone de dengue"], selfCare: ["Repos ; boire ; paracétamol selon notice"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "דנגי מועבר ביתושים. חום, כאב ראש, כאב מאחורי העיניים, כאבי שרירים, פריחה. ייעוץ דחוף אחרי נסיעה. דנגי חמור — חירום.", emergencyIf: ["כאב בטן חזק", "הקאות חוזרות", "נשימה מהירה", "דימום מהחניכיים/אף", "עייפות קיצונית / אי-שקט", "דם בהקאה/צואה"], seeDoctorIf: ["לא מרגיש טוב אחרי נסיעה לאזור דנגי"], selfCare: ["מנוחה; שתייה; פרצטמול לפי התווית"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Денге передаётся комарами. Лихорадка, головная боль, боль за глазами, миалгии, сыпь. Срочно после поездки. Тяжёлая денге — неотложка.", emergencyIf: ["Сильная боль в животе", "Повторная рвота", "Частое дыхание", "Кровотечение из дёсен/носа", "Крайняя усталость / беспокойство", "Кровь в рвоте/стуле"], seeDoctorIf: ["Плохое самочувствие после поездки в зону денге"], selfCare: ["Покой; жидкость; парацетамол по инструкции"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsDengue],
  },
  {
    id: "typhoid-fever",
    category: "travel",
    urgencyDefault: "voir_medecin",
    priority: 7,
    keywords: {
      en: ["typhoid", "typhoid fever", "fever after unclean water travel"],
      fr: ["typhoïde", "fièvre typhoïde", "fièvre après eau non potable voyage"],
      he: ["טיפואיד", "קדחת טיפוס", "חום אחרי מים לא נקיים בנסיעה"],
      ru: ["брюшной тиф", "тифозная лихорадка", "лихорадка после грязной воды в поездке"],
    },
    titles: { en: "Typhoid fever (travel)", fr: "Fièvre typhoïde (voyage)", he: "טיפואיד (נסיעות)", ru: "Брюшной тиф (путешествия)" },
    guidance: g(
      { summary: "Typhoid spreads via unclean food/water. Symptoms: rising fever, headache, cough, chills, tiredness, constipation or later tummy ache/diarrhoea, sometimes pink spots. Needs testing and antibiotics — clinician only. Emergency for sudden worsening stomach pain, black/dark-red stool, or coffee-ground/bloody vomit. Vaccination advice before travel is clinic-led.", emergencyIf: ["Sudden stomach pain that keeps getting worse", "Black or dark-red stool", "Vomiting blood or coffee-ground vomit"], seeDoctorIf: ["Fever after travel to typhoid-risk areas — mention travel", "Consider pre-travel typhoid vaccination via travel clinic"], doNot: ["Do not invent antibiotic courses", "Do not delay if GI bleeding signs"] },
      { summary: "La typhoïde se transmet par eau/aliments souillés. Fièvre progressive, céphalées, etc. Antibiotiques = médecin. Urgence si douleur abdominale aggravée, selles noires, vomissements sanglants.", emergencyIf: ["Douleur abdominale brutale qui empire", "Selles noires ou rouge sombre", "Vomissements de sang / aspect marc de café"], seeDoctorIf: ["Fièvre après voyage en zone à risque"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "טיפואיד מועבר במזון/מים מזוהמים. חום עולה, כאב ראש ועוד. אנטיביוטיקה — רופא בלבד. חירום בכאב בטן מחמיר, צואה שחורה, הקאת דם.", emergencyIf: ["כאב בטן פתאומי שמחמיר", "צואה שחורה או אדומה כהה", "הקאת דם / כמו קפה טחון"], seeDoctorIf: ["חום אחרי נסיעה לאזור סיכון"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Брюшной тиф — через грязную воду/пищу. Нарастающая лихорадка и др. Антибиотики — только врач. Неотложка при усиливающейся боли в животе, чёрном стуле, кровавой рвоте.", emergencyIf: ["Внезапная усиливающаяся боль в животе", "Чёрный или тёмно-красный стул", "Рвота кровью / «кофейной гущей»"], seeDoctorIf: ["Лихорадка после поездки в зону риска"], doNot: ["Не изобретать курсы антибиотиков"] }
    ),
    sources: [S.nhsTyphoid],
  },
  {
    id: "scarlet-fever",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["scarlet fever", "sandpaper rash", "strawberry tongue", "scarlatina"],
      fr: ["scarlatine", "éruption papier de verre", "langue framboise"],
      he: ["שנית", "פריחת נייר זכוכית", "לשון תות"],
      ru: ["скарлатина", "сыпь как наждак", "малиновый язык"],
    },
    titles: { en: "Scarlet fever", fr: "Scarlatine", he: "שנית", ru: "Скарлатина" },
    guidance: g(
      { summary: "Scarlet fever often starts with fever, sore throat and swollen neck glands, then a sandpaper-like rash and strawberry tongue. NHS: see a GP (phone ahead). Antibiotics are clinician-prescribed. Seek help again if not better in a week, scarlet fever with chickenpox, or illness weeks later (possible complication).", seeDoctorIf: ["Scarlet fever symptoms", "Not better in a week after seeing a GP", "Scarlet fever and chickenpox together", "Ill again weeks after recovery", "Unwell after contact with scarlet fever"], doNot: ["Do not invent antibiotic regimens", "Do not send children back to school until advised (often 24h after first antibiotic dose)"] },
      { summary: "Scarlatine : fièvre, angine, ganglions, puis éruption rugueuse et langue framboise. Voir un médecin (appeler avant). Antibiotiques = prescription. Pas de schéma inventé.", seeDoctorIf: ["Symptômes de scarlatine", "Pas d'amélioration à 1 semaine", "Scarlatine + varicelle", "Malade des semaines après"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "שנית: חום, כאב גרון, בלוטות, ואז פריחת נייר זכוכית ולשון תות. רופא (להתקשר מראש). אנטיביוטיקה — מרשם בלבד.", seeDoctorIf: ["תסמיני שנית", "אין שיפור אחרי שבוע", "שנית עם אבעבועות רוח", "חולי שבועות אחרי"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Скарлатина: лихорадка, боль в горле, железы, затем сыпь «наждак» и малиновый язык. К врачу (позвонить заранее). Антибиотики — по рецепту.", seeDoctorIf: ["Симптомы скарлатины", "Нет улучшения через неделю", "Скарлатина + ветрянка", "Болезнь через недели после"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsScarlet],
  },
  {
    id: "hand-foot-mouth",
    category: "peds",
    urgencyDefault: "auto_soins",
    priority: 4,
    keywords: {
      en: ["hand foot mouth", "HFMD", "mouth ulcers hand spots", "hand foot and mouth"],
      fr: ["maladie pied main bouche", "aphtes et boutons mains pieds", "syndrome pied-main-bouche"],
      he: ["יד רגל פה", "כיבים בפה ושלפוחיות בידיים", "HFMD"],
      ru: ["синдром рука-нога-рот", "язвочки во рту и сыпь на руках", "HFMD"],
    },
    titles: { en: "Hand, foot and mouth disease", fr: "Syndrome pied-main-bouche", he: "מחלת יד-רגל-פה", ru: "Синдром рука–нога–рот" },
    guidance: g(
      { summary: "HFMD usually improves in 7–10 days. Cool fluids, soft foods, paracetamol/ibuprofen per label. See GP if not improving by 7–10 days or if pregnant. Urgent advice for very high temperature/shivers, worry about the child, or peeing less (dehydration).", seeDoctorIf: ["Not improving after 7–10 days", "Pregnant with HFMD"], emergencyIf: [], // will omit empty
        selfCare: ["Cool fluids (avoid acidic drinks); soft foods; paracetamol/ibuprofen if suitable per label"], doNot: ["Do not invent antivirals or antibiotics for viral HFMD", "Antibiotics do not cure HFMD"] },
      { summary: "Le syndrome pied-main-bouche s'améliore souvent en 7–10 jours. Liquides frais, aliments mous, paracétamol/ibuprofène selon notice. Médecin si pas d'amélioration ou grossesse.", seeDoctorIf: ["Pas d'amélioration à 7–10 jours", "Grossesse"], selfCare: ["Boissons fraîches ; aliments mous ; antalgiques selon notice"], doNot: ["Pas d'antibiotiques pour soigner le HFMD viral"] },
      { summary: "יד-רגל-פה לרוב משתפר תוך 7–10 ימים. נוזלים קרים, מזון רך, פרצטמול/איבופרופן לפי התווית. רופא אם אין שיפור או בהריון.", seeDoctorIf: ["אין שיפור אחרי 7–10 ימים", "הריון"], selfCare: ["נוזלים קרים; מזון רך; משככי כאב לפי התווית"], doNot: ["אין אנטיביוטיקה לריפוי HFMD ויראלי"] },
      { summary: "Синдром рука–нога–рот обычно проходит за 7–10 дней. Прохладные жидкости, мягкая еда, парацетамол/ибупрофен по инструкции. Врач если нет улучшения или беременность.", seeDoctorIf: ["Нет улучшения за 7–10 дней", "Беременность"], selfCare: ["Прохладные жидкости; мягкая еда; анальгетики по инструкции"], doNot: ["Антибиотики не лечат вирусный HFMD"] }
    ),
    sources: [S.nhsHfmd],
  },
  {
    id: "gallstones-biliary",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["gallstones", "biliary colic", "pain under right ribs", "gallbladder attack"],
      fr: ["calculs biliaires", "colique hépatique", "douleur sous les côtes droites", "crise de vésicule"],
      he: ["אבני מרה", "קוליק מרה", "כאב מתחת לצלעות ימין", "התקף כיס מרה"],
      ru: ["камни в желчном", "жёлчная колика", "боль под правыми рёбрами", "приступ желчного"],
    },
    titles: { en: "Gallstones / biliary pain", fr: "Calculs biliaires / colique hépatique", he: "אבני מרה / כאב מרה", ru: "Желчнокаменная болезнь / колика" },
    guidance: g(
      { summary: "Gallstones often cause no symptoms. Blocking a duct can cause severe constant tummy pain (>30 min up to hours), often middle or under right ribs, with nausea/vomiting (biliary colic). NHS: urgent advice for pain >30 min; emergency for sudden severe pain, pain to back with vomiting, very high fever/shivers, or jaundice. Surgery decisions are clinical — not here.", emergencyIf: ["Sudden severe tummy pain", "Pain spreading to the back with vomiting", "Very high temperature or hot/cold/shivery", "Yellow skin or whites of eyes"], seeDoctorIf: ["Tummy pain lasting longer than 30 minutes"], doNot: ["Do not invent ursodeoxycholic acid or opioid doses", "Do not ignore jaundice with biliary pain"] },
      { summary: "Les calculs sont souvent asymptomatiques. Douleur >30 min sous côtes droites/milieu = avis urgent. Urgence si douleur brutale, irradiation dorsale avec vomissements, fièvre élevée, ictère.", emergencyIf: ["Douleur abdominale brutale sévère", "Douleur vers le dos avec vomissements", "Forte fièvre / frissons", "Peau ou yeux jaunes"], seeDoctorIf: ["Douleur > 30 minutes"], doNot: ["Pas de posologies inventées"] },
      { summary: "אבני מרה לרוב ללא תסמינים. כאב מעל 30 דק' באמצע/מתחת לצלעות ימין — ייעוץ דחוף. חירום בכאב פתאומי חזק, הקרנה לגב עם הקאות, חום גבוה, צהבת.", emergencyIf: ["כאב בטן פתאומי חזק", "כאב לגב עם הקאות", "חום גבוה / צמרמורת", "עור או עיניים צהובים"], seeDoctorIf: ["כאב מעל 30 דקות"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Камни часто бессимптомны. Боль >30 мин в середине/под правыми рёбрами — срочный совет. Неотложка при внезапной сильной боли, иррадиации в спину с рвотой, высокой лихорадке, желтухе.", emergencyIf: ["Внезапная сильная боль в животе", "Боль в спину с рвотой", "Очень высокая температура / озноб", "Жёлтая кожа или глаза"], seeDoctorIf: ["Боль дольше 30 минут"], doNot: ["Не изобретать дозы препаратов"] }
    ),
    sources: [S.nhsGallstones],
  },
  {
    id: "hypothyroidism",
    category: "endocrine",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["underactive thyroid", "hypothyroidism", "thyroid tired weight gain", "levothyroxine"],
      fr: ["thyroïde paresseuse", "hypothyroïdie", "fatigue prise de poids thyroïde", "lévothyroxine"],
      he: ["תת פעילות בלוטת התריס", "היפותירואידיזם", "עייפות ועלייה במשקל תריס"],
      ru: ["гипотиреоз", "пониженная щитовидная", "усталость набор веса щитовидка"],
    },
    titles: { en: "Underactive thyroid (hypothyroidism)", fr: "Hypothyroïdie", he: "תת־פעילות בלוטת התריס", ru: "Гипотиреоз" },
    guidance: g(
      { summary: "Hypothyroidism can cause fatigue, feeling cold, weight gain, constipation, low mood, dry skin/hair, hoarse voice, heavy periods. NHS: see a GP for blood tests. Levothyroxine dosing is clinician-managed with monitoring — never invent doses here.", seeDoctorIf: ["You think you might have an underactive thyroid", "Side effects on thyroid medicine — talk to GP/pharmacist"], doNot: ["Do not invent levothyroxine doses", "Do not adjust dose without clinical advice"] },
      { summary: "L'hypothyroïdie peut causer fatigue, frilosité, prise de poids, constipation, moral bas, peau/cheveux secs. Bilan sanguin chez le médecin. Pas de doses de lévothyroxine inventées.", seeDoctorIf: ["Suspicion d'hypothyroïdie", "Effets indésirables du traitement"], doNot: ["Pas de doses de lévothyroxine inventées"] },
      { summary: "תת־פעילות תריס: עייפות, קור, עלייה במשקל, עצירות, מצב רוח ירוד, עור/שיער יבשים. בדיקות דם אצל רופא. אין מינון לבותירוקסין מומצא.", seeDoctorIf: ["חשד לתת־פעילות תריס", "תופעות לוואי של הטיפול"], doNot: ["אין מינון לבותירוקסין מומצא"] },
      { summary: "Гипотиреоз: усталость, зябкость, набор веса, запоры, низкое настроение, сухая кожа/волосы. Анализы у врача. Дозы левотироксина не выдумывать.", seeDoctorIf: ["Подозрение на гипотиреоз", "Побочные эффекты лечения"], doNot: ["Не изобретать дозы левотироксина"] }
    ),
    sources: [S.nhsHypothyroid],
  },
  {
    id: "hyperthyroidism",
    category: "endocrine",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["overactive thyroid", "hyperthyroidism", "thyrotoxicosis", "racing heart weight loss thyroid"],
      fr: ["thyroïde hyperactive", "hyperthyroïdie", "thyrotoxicose", "cœur rapide amaigrissement thyroïde"],
      he: ["יתר פעילות בלוטת התריס", "היפרתירואידיזם", "דפיקות לב וירידה במשקל תריס"],
      ru: ["гипертиреоз", "повышенная щитовидная", "тиреотоксикоз", "сердцебиение похудение щитовидка"],
    },
    titles: { en: "Overactive thyroid (hyperthyroidism)", fr: "Hyperthyroïdie", he: "יתר־פעילות בלוטת התריס", ru: "Гипертиреоз" },
    guidance: g(
      { summary: "An overactive thyroid can cause anxiety, heat intolerance, weight loss, tremor, palpitations, and eye symptoms in some people. NHS: see a GP for assessment and blood tests. Treatments (antithyroid drugs, etc.) are clinician-only. Severe symptoms with fever/agitation may need emergency assessment (possible thyroid storm — rare).", emergencyIf: ["Severe agitation with high fever and very fast heart rate after known thyroid disease — emergency assessment", "Chest pain or severe breathlessness with palpitations"], seeDoctorIf: ["Symptoms suggesting overactive thyroid", "Eye bulging/irritation with thyroid symptoms"], doNot: ["Do not invent antithyroid drug doses", "Do not stop prescribed thyroid medicines without advice"] },
      { summary: "L'hyperthyroïdie peut causer anxiété, intolérance à la chaleur, amaigrissement, tremblements, palpitations. Bilan médical. Pas d'antithyroïdiens inventés.", emergencyIf: ["Agitation sévère avec forte fièvre et tachycardie — urgence", "Douleur thoracique ou dyspnée sévère avec palpitations"], seeDoctorIf: ["Suspicion d'hyperthyroïdie"], doNot: ["Pas d'antithyroïdiens inventés"] },
      { summary: "יתר־פעילות תריס: חרדה, רגישות לחום, ירידה במשקל, רעד, דפיקות לב. בדיקות אצל רופא. אין תרופות אנטי־תריסיות מומצאות.", emergencyIf: ["אי-שקט חמור עם חום גבוה ודופק מהיר מאוד — חירום", "כאב חזה או קוצר נשימה חמור עם דפיקות"], seeDoctorIf: ["חשד ליתר־פעילות תריס"], doNot: ["אין מינון תרופות אנטי־תריסיות מומצא"] },
      { summary: "Гипертиреоз: тревога, непереносимость жары, похудение, тремор, сердцебиение. Обследование у врача. Антитиреоидные дозы не выдумывать.", emergencyIf: ["Сильное возбуждение с высокой лихорадкой и очень частым пульсом — неотложка", "Боль в груди или тяжёлая одышка с сердцебиением"], seeDoctorIf: ["Подозрение на гипертиреоз"], doNot: ["Не изобретать дозы антитиреоидных препаратов"] }
    ),
    sources: [S.nhsHyperthyroid],
  },
  {
    id: "iron-deficiency-anaemia",
    category: "general",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["iron deficiency", "anaemia tired pale", "anemia low iron", "low ferritin"],
      fr: ["carence en fer", "anémie fatigué pâle", "ferritine basse"],
      he: ["חסר ברזל", "אנמיה עייף חיוור", "פריטין נמוך"],
      ru: ["дефицит железа", "анемия усталость бледность", "низкий ферритин"],
    },
    titles: { en: "Iron deficiency anaemia (orientation)", fr: "Anémie par carence en fer (orientation)", he: "אנמיה מחוסר ברזל (הכוונה)", ru: "Железодефицитная анемия (ориентация)" },
    guidance: g(
      { summary: "Iron deficiency anaemia can cause tiredness, pale skin, shortness of breath, and heart palpitations. NHS: see a GP for blood tests and to find the cause (including bleeding). Iron supplements are clinician/pharmacist guided — do not invent doses, especially in children.", emergencyIf: ["Severe breathlessness, chest pain, or fainting with suspected severe anaemia", "Heavy ongoing bleeding"], seeDoctorIf: ["Persistent tiredness, pallor, breathlessness", "Heavy periods with anaemia symptoms"], doNot: ["Do not invent iron megadoses", "Do not ignore possible bleeding sources"] },
      { summary: "L'anémie ferriprive peut causer fatigue, pâleur, dyspnée, palpitations. Bilan médical. Pas de doses de fer inventées.", emergencyIf: ["Dyspnée sévère, douleur thoracique ou syncope", "Saignement abondant persistant"], seeDoctorIf: ["Fatigue, pâleur, dyspnée persistantes"], doNot: ["Pas de mégadoses de fer inventées"] },
      { summary: "אנמיה מחוסר ברזל: עייפות, חיוורון, קוצר נשימה, דפיקות לב. בדיקות דם. אין מינון ברזל מומצא.", emergencyIf: ["קוצר נשימה חמור, כאב חזה או התעלפות", "דימום כבד מתמשך"], seeDoctorIf: ["עייפות, חיוורון, קוצר נשימה מתמשכים"], doNot: ["אין מינון ברזל מומצא"] },
      { summary: "Железодефицитная анемия: усталость, бледность, одышка, сердцебиение. Анализы у врача. Дозы железа не выдумывать.", emergencyIf: ["Тяжёлая одышка, боль в груди или обморок", "Продолжающееся обильное кровотечение"], seeDoctorIf: ["Стойкая усталость, бледность, одышка"], doNot: ["Не изобретать мегадозы железа"] }
    ),
    sources: [S.nhsAnaemia],
  },
  {
    id: "constipation-adult",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["constipation", "cannot poo", "hard stools straining"],
      fr: ["constipation", "n'arrive pas à aller à la selle", "selles dures efforts"],
      he: ["עצירות", "לא מצליח לעשות צרכים", "צואה קשה מאמץ"],
      ru: ["запор", "не могу сходить в туалет", "твёрдый стул натуживание"],
    },
    titles: { en: "Constipation (orientation)", fr: "Constipation (orientation)", he: "עצירות (הכוונה)", ru: "Запор (ориентация)" },
    guidance: g(
      { summary: "Constipation is common. NHS self-care: fluids, fibre-rich diet, activity; pharmacist advice on laxatives when needed. See a GP if lasting long, blood in stool, unintended weight loss, or severe pain. Do not invent stimulant laxative regimens for children without advice.", seeDoctorIf: ["Constipation lasting a long time", "Blood in stool", "Unexplained weight loss", "Severe tummy pain", "Alternating constipation/diarrhoea with red flags"], selfCare: ["Drink enough fluids; increase fibre gradually; stay active; ask pharmacist about suitable laxatives"], doNot: ["Do not invent high-dose laxative protocols", "Do not ignore blood in stool"] },
      { summary: "La constipation est fréquente. Hydratation, fibres, activité ; pharmacien pour laxatifs. Médecin si durée longue, sang, amaigrissement, douleur sévère.", seeDoctorIf: ["Constipation prolongée", "Sang dans les selles", "Amaigrissement", "Douleur sévère"], selfCare: ["Boire ; fibres ; activité ; avis pharmacien"], doNot: ["Pas de protocoles de laxatifs inventés"] },
      { summary: "עצירות נפוצה. נוזלים, סיבים, פעילות; רוקח למשלשלים. רופא אם ממושך, דם, ירידה במשקל, כאב חזק.", seeDoctorIf: ["עצירות ממושכת", "דם בצואה", "ירידה במשקל", "כאב חזק"], selfCare: ["שתייה; סיבים; פעילות; רוקח"], doNot: ["אין פרוטוקול משלשלים מומצא"] },
      { summary: "Запор часто встречается. Жидкость, клетчатка, активность; фармацевт по слабительным. Врач при длительности, крови, похудении, сильной боли.", seeDoctorIf: ["Длительный запор", "Кровь в стуле", "Похудение", "Сильная боль"], selfCare: ["Пить; клетчатка; активность; фармацевт"], doNot: ["Не изобретать схемы слабительных"] }
    ),
    sources: [S.nhsConstipation],
  },
  {
    id: "haemorrhoids-piles",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["haemorrhoids", "piles", "hemorrhoids itching bleeding", "anal lumps"],
      fr: ["hémorroïdes", "saignement anal démangeaisons", "boules à l'anus"],
      he: ["טחורים", "דימום אנאלי גרד", "בליטות בפי הטבעת"],
      ru: ["геморрой", "зуд и кровь из заднего прохода", "узелки в анусе"],
    },
    titles: { en: "Piles (haemorrhoids)", fr: "Hémorroïdes", he: "טחורים", ru: "Геморрой" },
    guidance: g(
      { summary: "Piles can cause itching, discomfort, and bright red blood on wiping. NHS: self-care with fibre/fluids; pharmacy products. See a GP if bleeding persists, severe pain, or unsure. Heavy bleeding or black stools need urgent assessment (may not be piles).", seeDoctorIf: ["Bleeding that does not settle", "Severe anal pain", "Unsure of the cause"], emergencyIf: ["Heavy rectal bleeding", "Black tarry stools", "Dizziness with bleeding"], selfCare: ["Fluids and fibre; avoid straining; ask pharmacist about creams/ointments"], doNot: ["Do not assume all rectal bleeding is piles", "Do not invent prescription steroid regimens"] },
      { summary: "Les hémorroïdes causent démangeaisons, gêne, sang rouge vif. Autosoins ; pharmacie. Médecin si saignement persiste. Saignement abondant/selles noires = urgence.", seeDoctorIf: ["Saignement qui ne cède pas", "Douleur anale sévère"], emergencyIf: ["Saignement rectal abondant", "Selles noires", "Vertige avec saignement"], selfCare: ["Hydratation et fibres ; éviter les efforts ; pharmacien"], doNot: ["Ne pas attribuer tout saignement aux hémorroïdes"] },
      { summary: "טחורים: גרד, אי-נוחות, דם אדום בהיר. טיפול עצמי; בית מרקחת. רופא אם דימום נמשך. דימום כבד/צואה שחורה — חירום.", seeDoctorIf: ["דימום שלא מפסיק", "כאב אנאלי חזק"], emergencyIf: ["דימום רקטלי כבד", "צואה שחורה", "סחרחורת עם דימום"], selfCare: ["נוזלים וסיבים; להימנע ממאמץ; רוקח"], doNot: ["לא להניח שכל דימום הוא טחורים"] },
      { summary: "Геморрой: зуд, дискомфорт, ярко-красная кровь. Самопомощь; аптека. Врач если кровотечение не проходит. Обильное кровотечение/чёрный стул — неотложка.", seeDoctorIf: ["Кровотечение не проходит", "Сильная анальная боль"], emergencyIf: ["Обильное ректальное кровотечение", "Чёрный стул", "Головокружение с кровотечением"], selfCare: ["Жидкость и клетчатка; не тужиться; фармацевт"], doNot: ["Не считать любое кровотечение геморроем"] }
    ),
    sources: [S.nhsHaemorrhoids],
  },
  {
    id: "ibs-orientation",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["IBS", "irritable bowel", "bloating alternating diarrhoea constipation"],
      fr: ["SII", "côlon irritable", "ballonnements diarrhée constipation alternés"],
      he: ["מעי רגיז", "IBS", "נפיחות שלשול עצירות לסירוגין"],
      ru: ["СРК", "синдром раздражённого кишечника", "вздутие понос запор"],
    },
    titles: { en: "IBS (orientation — not a self-diagnosis)", fr: "SII / côlon irritable (orientation)", he: "מעי רגיז (הכוונה — לא אבחנה עצמית)", ru: "СРК (ориентация — не самодиагноз)" },
    guidance: g(
      { summary: "IBS involves tummy pain with bloating and changed bowel habits. Diagnosis is clinical after excluding other causes — do not self-diagnose. Red flags (blood, weight loss, waking at night with pain/diarrhoea, onset after 50, family history of bowel cancer/IBD) need prompt medical review. Diet changes are guided, not invented protocols.", seeDoctorIf: ["Symptoms suggestive of IBS for assessment", "Blood in stool, unexplained weight loss, night symptoms, new onset later in life"], doNot: ["Do not self-diagnose IBS without clinical assessment", "Do not invent restrictive elimination diets as medical treatment"] },
      { summary: "Le SII associe douleur, ballonnements et troubles du transit. Diagnostic médical après exclusion d'autres causes. Signes d'alarme = avis prompt.", seeDoctorIf: ["Symptômes évocateurs à évaluer", "Sang, amaigrissement, symptômes nocturnes, début tardif"], doNot: ["Pas d'autodiagnostic", "Pas de régimes d'élimination inventés"] },
      { summary: "מעי רגיז: כאב בטן עם נפיחות ושינוי יציאות. אבחנה רפואית לאחר שלילת גורמים אחרים. דגלים אדומים — ייעוץ מהיר.", seeDoctorIf: ["תסמינים מחשידים להערכה", "דם, ירידה במשקל, תסמיני לילה, התחלה בגיל מבוגר"], doNot: ["לא לאבחן לבד", "אין דיאטות אלימינציה מומצאות"] },
      { summary: "СРК: боль, вздутие, изменение стула. Диагноз врача после исключения другого. Красные флаги — быстрый осмотр.", seeDoctorIf: ["Симптомы для оценки", "Кровь, похудение, ночные симптомы, начало в зрелом возрасте"], doNot: ["Не ставить себе диагноз СРК", "Не изобретать жёсткие элиминационные диеты"] }
    ),
    sources: [S.nhsIbs],
  },
  {
    id: "atopic-eczema",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["eczema", "atopic dermatitis", "itchy dry patches skin"],
      fr: ["eczéma", "dermatite atopique", "plaques sèches qui démangent"],
      he: ["אקזמה", "דלקת עור אטופית", "כתמים יבשים מגרדים"],
      ru: ["экзема", "атопический дерматит", "зудящие сухие пятна"],
    },
    titles: { en: "Atopic eczema (orientation)", fr: "Eczéma atopique (orientation)", he: "אקזמה אטופית (הכוונה)", ru: "Атопическая экзема (ориентация)" },
    guidance: g(
      { summary: "Atopic eczema causes itchy, dry, inflamed skin. NHS: emollients liberally; avoid triggers; pharmacy/GP for flares. Seek urgent care if rapidly spreading redness, fever, or suspected skin infection. Steroid cream strength/duration is clinician/pharmacist guided — no invented potencies.", seeDoctorIf: ["Eczema not controlled with simple care", "Suspected infection of eczema", "Sleep severely disrupted by itch"], emergencyIf: ["Rapidly spreading red hot painful skin with fever"], selfCare: ["Regular emollients; short lukewarm baths; avoid known irritants"], doNot: ["Do not invent potent topical steroid regimens", "Do not use someone else's prescription cream"] },
      { summary: "L'eczéma atopique démange et dessèche la peau. Emollients ; avis pharmacien/médecin. Urgence si infection cutanée fébrile. Pas de dermocorticoïdes inventés.", seeDoctorIf: ["Eczéma non contrôlé", "Suspicion d'infection", "Prurit qui empêche de dormir"], emergencyIf: ["Rougeur chaude douloureuse extensive avec fièvre"], selfCare: ["Emollients réguliers ; bains tièdes courts"], doNot: ["Pas de dermocorticoïdes puissants inventés"] },
      { summary: "אקזמה אטופית מגרדת ומייבשת. קרמים לחים; רוקח/רופא. חירום בחשד לזיהום עם חום. אין סטרואידים מקומיים מומצאים.", seeDoctorIf: ["אקזמה לא נשלטת", "חשד לזיהום", "גרד שמונע שינה"], emergencyIf: ["אדמומיות חמה כואבת מתפשטת עם חום"], selfCare: ["לחות סדירה; מקלחות פושרות קצרות"], doNot: ["אין מינון סטרואיד מקומי חזק מומצא"] },
      { summary: "Атопическая экзема зудит и сушит кожу. Эмоленты; фармацевт/врач. Неотложка при инфекции с лихорадкой. Сильные топические стероиды не выдумывать.", seeDoctorIf: ["Экзема не контролируется", "Подозрение на инфекцию", "Зуд мешает спать"], emergencyIf: ["Быстро распространяющаяся красная горячая болезненная кожа с лихорадкой"], selfCare: ["Регулярные эмоленты; короткие тёплые ванны"], doNot: ["Не изобретать схемы сильных топических стероидов"] }
    ),
    sources: [S.nhsEczema],
  },
  {
    id: "psoriasis",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["psoriasis", "silvery scaly plaques", "psoriatic plaques"],
      fr: ["psoriasis", "plaques squameuses argentées"],
      he: ["פסוריאזיס", "לוחות קשקשיים כסופים"],
      ru: ["псориаз", "серебристые чешуйчатые бляшки"],
    },
    titles: { en: "Psoriasis (orientation)", fr: "Psoriasis (orientation)", he: "פסוריאזיס (הכוונה)", ru: "Псориаз (ориентация)" },
    guidance: g(
      { summary: "Psoriasis causes scaly plaques, often on elbows, knees, scalp. NHS: GP/dermatology for diagnosis and treatment plans. Widespread redness, severe pain, or pustules with fever need urgent care (possible unstable/pustular forms). No inventing systemic immunosuppressant doses.", seeDoctorIf: ["New suspected psoriasis", "Flare not responding to usual plan", "Joint pain with psoriasis (possible psoriatic arthritis)"], emergencyIf: ["Widespread painful red skin", "Pustules with fever/feeling very unwell"], doNot: ["Do not invent methotrexate/biologic doses", "Do not stop prescribed systemic therapy without advice"] },
      { summary: "Le psoriasis forme des plaques squameuses. Avis médical. Rougeur extensive, pustules fébriles = urgence. Pas d'immunosuppresseurs inventés.", seeDoctorIf: ["Suspicion de psoriasis", "Poussée non contrôlée", "Douleurs articulaires associées"], emergencyIf: ["Rougeur étendue douloureuse", "Pustules avec fièvre"], doNot: ["Pas de méthotrexate/biologiques inventés"] },
      { summary: "פסוריאזיס: לוחות קשקשיים. ייעוץ רפואי. אודם נרחב/פוסטולות עם חום — חירום. אין מדכאי חיסון מומצאים.", seeDoctorIf: ["חשד לפסוריאזיס", "התלקחות לא נשלטת", "כאבי מפרקים נלווים"], emergencyIf: ["עור אדום כואב נרחב", "פוסטולות עם חום"], doNot: ["אין מתוטרקסט/ביולוגיים מומצאים"] },
      { summary: "Псориаз — чешуйчатые бляшки. К врачу. Обширное покраснение/пустулы с лихорадкой — неотложка. Иммунодепрессанты не выдумывать.", seeDoctorIf: ["Подозрение на псориаз", "Обострение вне контроля", "Боль в суставах"], emergencyIf: ["Обширная болезненная красная кожа", "Пустулы с лихорадкой"], doNot: ["Не изобретать дозы метотрексата/биопрепаратов"] }
    ),
    sources: [S.nhsPsoriasis],
  },
  {
    id: "impetigo",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["impetigo", "honey crusted sores", "school sores"],
      fr: ["impétigo", "croûtes miel", "plaies croûteuses contagieuses"],
      he: ["אימפטיגו", "גלדים דבשיים", "פצעים מידבקים בעור"],
      ru: ["импетиго", "медовые корки", "заразные корочки на коже"],
    },
    titles: { en: "Impetigo", fr: "Impétigo", he: "אימפטיגו", ru: "Импетиго" },
    guidance: g(
      { summary: "Impetigo is a contagious bacterial skin infection with sores that may form honey-coloured crusts. NHS: see a GP — antibiotic cream or tablets may be needed (clinician-prescribed). Hygiene to reduce spread; keep children off school/nursery until advised (often 48h after starting antibiotics).", seeDoctorIf: ["Suspected impetigo", "Spreading sores", "Fever or feeling unwell with skin sores"], selfCare: ["Wash hands; avoid sharing towels; cover sores if possible"], doNot: ["Do not invent antibiotic cream/tablet regimens", "Do not scratch and share cloths"] },
      { summary: "L'impétigo est une infection cutanée contagieuse avec croûtes jaunâtres. Voir un médecin pour antibiotiques locaux/oraux. Hygiène pour limiter la contagion.", seeDoctorIf: ["Suspicion d'impétigo", "Plaies qui s'étendent", "Fièvre"], selfCare: ["Lavage des mains ; ne pas partager les serviettes"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "אימפטיגו זיהום עור מידבק עם גלדים דבשיים. רופא לאנטיביוטיקה. היגיינה להפחתת הדבקה.", seeDoctorIf: ["חשד לאימפטיגו", "פצעים מתפשטים", "חום"], selfCare: ["שטיפת ידיים; לא לשתף מגבות"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Импетиго — заразная бактериальная инфекция кожи с медовыми корками. К врачу за антибиотиками. Гигиена для снижения передачи.", seeDoctorIf: ["Подозрение на импетиго", "Распространяющиеся язвы", "Лихорадка"], selfCare: ["Мыть руки; не делиться полотенцами"], doNot: ["Не изобретать схемы антибиотиков"] }
    ),
    sources: [S.nhsImpetigo],
  },
];

// Clean empty emergencyIf arrays
for (const e of entries) {
  for (const lang of ["en", "fr", "he", "ru"]) {
    const g0 = e.guidance[lang];
    if (Array.isArray(g0.emergencyIf) && g0.emergencyIf.length === 0) delete g0.emergencyIf;
  }
  writeFileSync(join(dir, e.id + ".json"), JSON.stringify(e, null, 2) + "\n");
}
console.log("wrote", entries.length, "entries");

const catalogPath = join(root, "data/knowledge/sources.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const byId = new Map(catalog.sources.map((s) => [s.id, s]));
for (const s of Object.values(S)) {
  if (!byId.has(s.id)) {
    byId.set(s.id, { id: s.id, name: s.name, org: s.org, url: s.url, topics: [] });
  }
}
catalog.sources = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");

const metaPath = join(root, "data/knowledge/pack.meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
meta.entryFiles = files.map((f) => `entries/${f}`);
meta.version = "1.3.0";
meta.updatedAt = R;
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

function camel(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
const imports = files
  .map((f) => {
    const id = f.replace(/\.json$/, "");
    return `import ${camel(id)} from "../../../data/knowledge/entries/${id}.json";`;
  })
  .join("\n");
const list = files.map((f) => "  " + camel(f.replace(/\.json$/, ""))).join(",\n");
writeFileSync(
  join(root, "src/lib/knowledge/load.ts"),
  `import type { KnowledgeEntry, KnowledgePackMeta } from "./types";
import packMeta from "../../../data/knowledge/pack.meta.json";
${imports}

const ENTRIES = [
${list},
] as KnowledgeEntry[];

export function getPackMeta(): KnowledgePackMeta {
  return packMeta as KnowledgePackMeta;
}

export function getTrustedDomains(): string[] {
  return getTrustedDomainsInner();
}

function getTrustedDomainsInner(): string[] {
  return getPackMeta().trustedDomains;
}

export function loadKnowledgeEntries(): KnowledgeEntry[] {
  return ENTRIES;
}

export function resetKnowledgeCache(): void {
  // Static imports — nothing to reset.
}
`,
);
console.log("pack entries", files.length, "sources", catalog.sources.length);

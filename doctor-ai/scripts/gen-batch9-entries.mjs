#!/usr/bin/env node
/**
 * Batch 9 medical knowledge entries — public NHS sources only.
 * Run: node scripts/gen-batch9-entries.mjs
 */
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsFibro: { id: "nhs-fibromyalgia", name: "NHS — Fibromyalgia", org: "NHS", url: "https://www.nhs.uk/conditions/fibromyalgia/", retrievedAt: R },
  nhsMECFS: { id: "nhs-me-cfs", name: "NHS — ME/CFS", org: "NHS", url: "https://www.nhs.uk/conditions/chronic-fatigue-syndrome-cfs/", retrievedAt: R },
  nhsLupus: { id: "nhs-lupus", name: "NHS — Lupus", org: "NHS", url: "https://www.nhs.uk/conditions/lupus/", retrievedAt: R },
  nhsEndo: { id: "nhs-endometriosis", name: "NHS — Endometriosis", org: "NHS", url: "https://www.nhs.uk/conditions/endometriosis/", retrievedAt: R },
  nhsPCOS: { id: "nhs-pcos", name: "NHS — PCOS", org: "NHS", url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/", retrievedAt: R },
  nhsFibroids: { id: "nhs-fibroids", name: "NHS — Fibroids", org: "NHS", url: "https://www.nhs.uk/conditions/fibroids/", retrievedAt: R },
  nhsOvarianCyst: { id: "nhs-ovarian-cyst", name: "NHS — Ovarian cyst", org: "NHS", url: "https://www.nhs.uk/conditions/ovarian-cyst/", retrievedAt: R },
  nhsBPH: { id: "nhs-prostate-enlargement", name: "NHS — Prostate enlargement", org: "NHS", url: "https://www.nhs.uk/conditions/prostate-enlargement/", retrievedAt: R },
  nhsProstatitis: { id: "nhs-prostatitis", name: "NHS — Prostatitis", org: "NHS", url: "https://www.nhs.uk/conditions/prostatitis/", retrievedAt: R },
  nhsGlaucoma: { id: "nhs-glaucoma", name: "NHS — Glaucoma", org: "NHS", url: "https://www.nhs.uk/conditions/glaucoma/", retrievedAt: R },
  nhsCataracts: { id: "nhs-cataracts", name: "NHS — Cataracts", org: "NHS", url: "https://www.nhs.uk/conditions/cataracts/", retrievedAt: R },
  nhsAMD: { id: "nhs-macular-degeneration", name: "NHS — Age-related macular degeneration", org: "NHS", url: "https://www.nhs.uk/conditions/macular-degeneration/", retrievedAt: R },
  nhsDryEyes: { id: "nhs-dry-eyes", name: "NHS — Dry eyes", org: "NHS", url: "https://www.nhs.uk/conditions/dry-eyes/", retrievedAt: R },
  nhsSleepApnoea: { id: "nhs-sleep-apnoea", name: "NHS — Sleep apnoea", org: "NHS", url: "https://www.nhs.uk/conditions/sleep-apnoea/", retrievedAt: R },
  nhsAF: { id: "nhs-atrial-fibrillation", name: "NHS — Atrial fibrillation", org: "NHS", url: "https://www.nhs.uk/conditions/atrial-fibrillation/", retrievedAt: R },
  nhsAngina: { id: "nhs-angina", name: "NHS — Angina", org: "NHS", url: "https://www.nhs.uk/conditions/angina/", retrievedAt: R },
  nhsHiatus: { id: "nhs-hiatus-hernia", name: "NHS — Hiatus hernia", org: "NHS", url: "https://www.nhs.uk/conditions/hiatus-hernia/", retrievedAt: R },
  nhsAnalFissure: { id: "nhs-anal-fissure", name: "NHS — Anal fissure", org: "NHS", url: "https://www.nhs.uk/conditions/anal-fissure/", retrievedAt: R },
  nhsHernia: { id: "nhs-hernia", name: "NHS — Hernia", org: "NHS", url: "https://www.nhs.uk/conditions/hernia/", retrievedAt: R },
  nhsFrozenShoulder: { id: "nhs-frozen-shoulder", name: "NHS — Frozen shoulder", org: "NHS", url: "https://www.nhs.uk/conditions/frozen-shoulder/", retrievedAt: R },
};

const entries = [
  {
    id: "fibromyalgia",
    category: "rheumatology",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["fibromyalgia", "widespread pain fatigue fibromyalgia", "fibro fog"],
      fr: ["fibromyalgie", "douleurs diffuses fibromyalgie", "fatigue fibromyalgie"],
      he: ["פיברומיאלגיה", "כאבים מפושטים פיברו", "עייפות פיברומיאלגיה"],
      ru: ["фибромиалгия", "распространённые боли фибромиалгия", "усталость фибромиалгия"],
    },
    titles: { en: "Fibromyalgia — orientation", fr: "Fibromyalgie — orientation", he: "פיברומיאלגיה — התמצאות", ru: "Фибромиалгия — ориентир" },
    guidance: g(
      { summary: "Fibromyalgia involves widespread pain, fatigue, sleep problems and cognitive fog. NHS: diagnosis is clinical; management may include paced activity, sleep support, psychological therapies and sometimes medicines — this pack never invents doses. Seek urgent care for new chest pain, sudden weakness, or red-flag neuro symptoms (not typical fibromyalgia).", emergencyIf: ["Sudden chest pain, stroke-like symptoms, or severe unexplained fever"], seeDoctorIf: ["Persistent widespread pain/fatigue affecting daily life", "New or changing symptoms your GP should assess"], doNot: ["Do not invent opioid or antidepressant regimens", "Do not dismiss new red-flag symptoms as 'just fibro'"] },
      { summary: "Fibromyalgie: douleurs diffuses, fatigue, sommeil. Orientation NHS; pas de posologies inventées. Urgences si signes cardio/neuro nouveaux.", emergencyIf: ["Douleur thoracique soudaine, signes d'AVC, fièvre grave"], seeDoctorIf: ["Douleurs/fatigue persistantes"], doNot: ["Pas de posologies inventées"] },
      { summary: "פיברומיאלגיה: כאבים מפושטים, עייפות, שינה. לפי NHS; אין מינונים מומצאים. חירום לסימנים חדשים.", emergencyIf: ["כאב חזה פתאומי, סימני שבץ, חום קשה"], seeDoctorIf: ["כאבים/עייפות מתמשכים"], doNot: ["אין מינוני תרופות מומצאים"] },
      { summary: "Фибромиалгия: распространённые боли, усталость, сон. Ориентир NHS; дозы не выдумывать. Неотложка при новых красных флагах.", emergencyIf: ["Внезапная боль в груди, признаки инсульта, тяжёлая лихорадка"], seeDoctorIf: ["Стойкие боли/усталость"], doNot: ["Не изобретать схемы лекарств"] }
    ),
    sources: [S.nhsFibro],
  },
  {
    id: "me-cfs",
    category: "general",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["ME CFS", "chronic fatigue syndrome", "myalgic encephalomyelitis post-exertional malaise"],
      fr: ["encéphalomyélite myalgique", "syndrome de fatigue chronique", "EM/SFC malaise post-effort"],
      he: ["תסמונת עייפות כרונית", "ME CFS", "עייפות כרונית מאמץ"],
      ru: ["синдром хронической усталости", "миалгический энцефаломиелит", "СХУ МЕ"],
    },
    titles: { en: "ME/CFS — orientation", fr: "EM/SFC — orientation", he: "עייפות כרונית (ME/CFS) — התמצאות", ru: "СХУ / МЕ — ориентир" },
    guidance: g(
      { summary: "ME/CFS can cause profound fatigue, post-exertional malaise, sleep and cognitive issues. NHS: specialist pathways exist; pacing and avoiding boom-bust cycles matter. This pack never invents graded-exercise prescriptions or drug doses. Emergency care for chest pain, fainting with injury, suicidal crisis, or sudden severe illness.", emergencyIf: ["Chest pain, collapse with injury, suicidal thoughts/plans", "Sudden severe new illness"], seeDoctorIf: ["Fatigue lasting months with post-exertional worsening", "Unable to work/study due to exhaustion"], doNot: ["Do not invent exercise programmes or stimulant doses", "Do not push through post-exertional crashes"] },
      { summary: "EM/SFC: fatigue profonde, malaise post-effort. Orientation NHS; pas de programmes/doses inventés.", emergencyIf: ["Douleur thoracique, malaise avec blessure, idées suicidaires"], seeDoctorIf: ["Fatigue prolongée avec aggravation post-effort"], doNot: ["Pas de programmes d'effort inventés"] },
      { summary: "ME/CFS: עייפות עמוקה והחמרה אחרי מאמץ. לפי NHS; אין תוכניות/מינונים מומצאים.", emergencyIf: ["כאב חזה, התמוטטות עם פציעה, מחשבות אובדניות"], seeDoctorIf: ["עייפות ממושכת עם החמרה אחרי מאמץ"], doNot: ["אין תוכניות מאמץ מומצאות"] },
      { summary: "СХУ/МЕ: глубокая усталость, ухудшение после нагрузки. Ориентир NHS; схемы/дозы не выдумывать.", emergencyIf: ["Боль в груди, обморок с травмой, суицидальные мысли"], seeDoctorIf: ["Длительная усталость с постнагрузочным ухудшением"], doNot: ["Не изобретать программы нагрузок"] }
    ),
    sources: [S.nhsMECFS],
  },
  {
    id: "lupus",
    category: "rheumatology",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["lupus SLE", "systemic lupus erythematosus rash joints"],
      fr: ["lupus érythémateux disséminé", "LED lupus articulations"],
      he: ["זאבת לופוס", "לופוס מערכתי", "SLE"],
      ru: ["красная волчанка", "системная красная волчанка", "СКВ волчанка"],
    },
    titles: { en: "Lupus (SLE) — orientation", fr: "Lupus (LED) — orientation", he: "זאבת (לופוס) — התמצאות", ru: "Волчанка (СКВ) — ориентир" },
    guidance: g(
      { summary: "Lupus can affect joints, skin, kidneys and other organs. NHS: diagnosis needs clinical assessment and tests; flares need medical review. Emergency: severe breathlessness, chest pain, confusion, very high fever, or sudden swelling/oliguria suggesting organ involvement. Never invent immunosuppressant or steroid doses.", emergencyIf: ["Severe breathlessness or chest pain", "Confusion, very high fever", "Sudden severe swelling or little/no urine"], seeDoctorIf: ["Suspected lupus symptoms (joint pain, photosensitive rash, unexplained fatigue)", "Known lupus with flare symptoms"], doNot: ["Do not invent steroid/immunosuppressant doses", "Do not stop prescribed medicines without clinician advice"] },
      { summary: "Lupus: articulations, peau, reins. Urgences si dyspnée, douleur thoracique, confusion, fièvre élevée, oligurie. Pas de posologies inventées.", emergencyIf: ["Dyspnée sévère ou douleur thoracique", "Confusion, très forte fièvre", "Oligurie / œdèmes sévères"], seeDoctorIf: ["Suspicion de lupus ou poussée"], doNot: ["Pas de posologies immunosuppresseurs inventées"] },
      { summary: "לופוס: מפרקים, עור, כליות. חירום בקוצר נשימה, כאב חזה, בלבול, חום גבוה, מיעוט שתן. אין מינונים מומצאים.", emergencyIf: ["קוצר נשימה קשה או כאב חזה", "בלבול, חום גבוה מאוד", "נפיחות קשה או מיעוט שתן"], seeDoctorIf: ["חשד ללופוס או התלקחות"], doNot: ["אין מינוני סטרואידים/מדכאי חיסון מומצאים"] },
      { summary: "Волчанка: суставы, кожа, почки. Неотложка при одышке, боли в груди, спутанности, высокой лихорадке, олигурии. Дозы не выдумывать.", emergencyIf: ["Тяжёлая одышка или боль в груди", "Спутанность, очень высокая лихорадка", "Отёки / мало мочи"], seeDoctorIf: ["Подозрение на волчанку или обострение"], doNot: ["Не изобретать дозы иммунодепрессантов"] }
    ),
    sources: [S.nhsLupus],
  },
  {
    id: "endometriosis",
    category: "womens-health",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["endometriosis", "period pain endometriosis pelvic pain"],
      fr: ["endométriose", "douleurs règles endométriose", "douleur pelvienne endométriose"],
      he: ["אנדומטריוזיס", "כאבי מחזור אנדומטריוזיס", "כאב אגן אנדו"],
      ru: ["эндометриоз", "боль при месячных эндометриоз", "тазовая боль эндометриоз"],
    },
    titles: { en: "Endometriosis — orientation", fr: "Endométriose — orientation", he: "אנדומטריוזיס — התמצאות", ru: "Эндометриоз — ориентир" },
    guidance: g(
      { summary: "Endometriosis can cause severe period pain, pelvic pain, pain with sex, and fertility issues. NHS: see a GP if periods disrupt life; diagnosis may involve specialist pathways. Emergency: sudden severe one-sided pelvic pain, fainting, or heavy bleeding (consider ectopic/other acute causes — see related entries). Never invent hormone or pain-drug doses.", emergencyIf: ["Sudden severe pelvic pain with fainting or shoulder-tip pain", "Very heavy bleeding with dizziness"], seeDoctorIf: ["Painful periods affecting work/school", "Pelvic pain between periods", "Difficulty conceiving with pelvic symptoms"], doNot: ["Do not invent hormone or opioid regimens", "Do not ignore sudden severe pain as 'just period pain'"] },
      { summary: "Endométriose: douleurs de règles/pelviennes. Urgences si douleur pelvienne brutale avec malaise. Pas de posologies inventées.", emergencyIf: ["Douleur pelvienne brutale avec malaise", "Hémorragie abondante avec vertiges"], seeDoctorIf: ["Règles invalidantes", "Douleur pelvienne"], doNot: ["Pas de posologies hormonales inventées"] },
      { summary: "אנדומטריוזיס: כאבי מחזור/אגן. חירום בכאב אגן פתאומי עם התעלפות. אין מינונים מומצאים.", emergencyIf: ["כאב אגן פתאומי עם התעלפות", "דימום כבד עם סחרחורת"], seeDoctorIf: ["מחזור מכאיב מאוד", "כאב אגן"], doNot: ["אין מינוני הורמונים מומצאים"] },
      { summary: "Эндометриоз: боли при месячных/в тазу. Неотложка при внезапной тазовой боли с обмороком. Дозы не выдумывать.", emergencyIf: ["Внезапная тазовая боль с обмороком", "Обильное кровотечение с головокружением"], seeDoctorIf: ["Инвалидирующие месячные", "Тазовая боль"], doNot: ["Не изобретать гормональные схемы"] }
    ),
    sources: [S.nhsEndo],
  },
  {
    id: "pcos",
    category: "womens-health",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["PCOS", "polycystic ovary syndrome irregular periods"],
      fr: ["SOPK", "syndrome des ovaires polykystiques", "règles irrégulières SOPK"],
      he: ["שחלות פוליציסטיות", "PCOS", "מחזור לא סדיר שחלות"],
      ru: ["СПКЯ", "синдром поликистозных яичников", "нерегулярные месячные СПКЯ"],
    },
    titles: { en: "PCOS — orientation", fr: "SOPK — orientation", he: "שחלות פוליציסטיות — התמצאות", ru: "СПКЯ — ориентир" },
    guidance: g(
      { summary: "PCOS can cause irregular periods, excess hair, acne, weight changes and fertility issues. NHS: GP assessment and blood tests/ultrasound may be used; lifestyle and medical options exist — this pack never invents metformin or hormone doses. Emergency: sudden severe pelvic pain (cyst complications) or very heavy bleeding with dizziness.", emergencyIf: ["Sudden severe pelvic pain", "Very heavy bleeding with fainting/dizziness"], seeDoctorIf: ["Irregular or absent periods", "Excess hair/acne with cycle changes", "Difficulty conceiving"], doNot: ["Do not invent metformin, anti-androgen or fertility drug doses"] },
      { summary: "SOPK: cycles irréguliers, poils, acné. Orientation NHS; pas de posologies inventées. Urgences si douleur pelvienne brutale.", emergencyIf: ["Douleur pelvienne brutale", "Hémorragie avec malaise"], seeDoctorIf: ["Cycles irréguliers", "Difficulté à concevoir"], doNot: ["Pas de posologies inventées"] },
      { summary: "PCOS: מחזור לא סדיר, שיעור, אקנה. לפי NHS; אין מינונים מומצאים. חירום בכאב אגן פתאומי.", emergencyIf: ["כאב אגן פתאומי", "דימום כבד עם סחרחורת"], seeDoctorIf: ["מחזור לא סדיר", "קושי להרות"], doNot: ["אין מינוני מטפורמין/הורמונים מומצאים"] },
      { summary: "СПКЯ: нерегулярные циклы, волосы, акне. Ориентир NHS; дозы не выдумывать. Неотложка при острой тазовой боли.", emergencyIf: ["Внезапная тазовая боль", "Обильное кровотечение с обмороком"], seeDoctorIf: ["Нерегулярные месячные", "Трудности с зачатием"], doNot: ["Не изобретать дозы метформина/гормонов"] }
    ),
    sources: [S.nhsPCOS],
  },
  {
    id: "fibroids",
    category: "womens-health",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["fibroids", "uterine fibroids heavy periods"],
      fr: ["fibromes utérins", "fibromes règles abondantes"],
      he: ["שרירנים ברחם", "פיברואידים", "דימום כבד שרירנים"],
      ru: ["миома матки", "фибромиома", "обильные месячные миома"],
    },
    titles: { en: "Uterine fibroids", fr: "Fibromes utérins", he: "שרירנים ברחם", ru: "Миома матки" },
    guidance: g(
      { summary: "Fibroids are non-cancerous uterine growths that can cause heavy periods, pelvic pressure and anaemia. NHS: GP review; treatment depends on size/symptoms. Emergency: soaking pads hourly with dizziness, or sudden severe pelvic pain. Never invent hormone or surgical plans.", emergencyIf: ["Soaking through pads hourly with dizziness/fainting", "Sudden severe pelvic pain"], seeDoctorIf: ["Heavy periods lasting many days", "Pelvic pressure or frequent urination with periods"], doNot: ["Do not invent hormone or iron doses without clinician advice"] },
      { summary: "Fibromes: règles abondantes, pression pelvienne. Urgences si hémorragie avec malaise. Pas de posologies inventées.", emergencyIf: ["Serviettes saturées chaque heure avec malaise", "Douleur pelvienne brutale"], seeDoctorIf: ["Règles très abondantes"], doNot: ["Pas de posologies inventées"] },
      { summary: "שרירנים: דימום כבד, לחץ באגן. חירום בדימום עם סחרחורת. אין מינונים מומצאים.", emergencyIf: ["החלפת תחבושות כל שעה עם סחרחורת", "כאב אגן פתאומי"], seeDoctorIf: ["וסת כבדה מאוד"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Миома: обильные месячные, давление в тазу. Неотложка при кровотечении с обмороком. Дозы не выдумывать.", emergencyIf: ["Прокладки каждый час с головокружением", "Внезапная тазовая боль"], seeDoctorIf: ["Очень обильные месячные"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsFibroids],
  },
  {
    id: "ovarian-cyst",
    category: "womens-health",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["ovarian cyst", "cyst on ovary pelvic pain"],
      fr: ["kyste de l'ovaire", "kyste ovarien douleur"],
      he: ["ציסטה בשחלה", "כיסה שחלתית", "כאב אגן ציסטה"],
      ru: ["киста яичника", "яичниковая киста", "боль внизу живота киста"],
    },
    titles: { en: "Ovarian cyst", fr: "Kyste de l'ovaire", he: "ציסטה בשחלה", ru: "Киста яичника" },
    guidance: g(
      { summary: "Many ovarian cysts are benign and settle; some cause pain or complications. NHS: sudden severe pelvic pain, vomiting, or fainting needs emergency assessment (possible torsion/rupture/ectopic). Never invent hormone doses. Correlate with ectopic-pregnancy and PID entries when relevant.", emergencyIf: ["Sudden severe one-sided pelvic pain", "Pain with vomiting, fever, or fainting", "Heavy bleeding with dizziness"], seeDoctorIf: ["Persistent pelvic pain", "Known cyst with new symptoms"], doNot: ["Do not invent hormone regimens", "Do not ignore sudden severe pain"] },
      { summary: "Kyste ovarien: souvent bénin; urgence si douleur pelvienne brutale (torsion/rupture). Pas de posologies inventées.", emergencyIf: ["Douleur pelvienne unilatérale brutale", "Douleur avec vomissements/fièvre/malaise"], seeDoctorIf: ["Douleur pelvienne persistante"], doNot: ["Pas de posologies inventées"] },
      { summary: "ציסטה שחלתית: לעיתים שפירה; חירום בכאב אגן פתאומי. אין מינונים מומצאים.", emergencyIf: ["כאב אגן חד-צדדי פתאומי", "כאב עם הקאות/חום/התעלפות"], seeDoctorIf: ["כאב אגן מתמשך"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Киста яичника: часто доброкачественная; неотложка при внезапной тазовой боли. Дозы не выдумывать.", emergencyIf: ["Внезапная односторонняя тазовая боль", "Боль с рвотой/лихорадкой/обмороком"], seeDoctorIf: ["Стойкая тазовая боль"], doNot: ["Не изобретать схемы"] }
    ),
    sources: [S.nhsOvarianCyst],
  },
  {
    id: "prostate-enlargement",
    category: "mens-health",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["enlarged prostate", "BPH prostate", "weak urine stream prostate"],
      fr: ["hypertrophie de la prostate", "HBP prostate", "jet urinaire faible prostate"],
      he: ["ערמונית מוגדלת", "BPH ערמונית", "זרם שתן חלש ערמונית"],
      ru: ["аденома простаты", "гиперплазия простаты", "слабая струя мочи простата"],
    },
    titles: { en: "Prostate enlargement (BPH)", fr: "Hypertrophie de la prostate (HBP)", he: "ערמונית מוגדלת", ru: "Аденома простаты" },
    guidance: g(
      { summary: "Enlarged prostate (BPH) can cause weak stream, urgency, nocturia and incomplete emptying. NHS: GP assessment; medicines/procedures are clinician-led — never invent alpha-blocker doses. Emergency: inability to pass urine, severe lower abdominal pain, fever with urinary symptoms, or blood in urine with clot retention.", emergencyIf: ["Cannot pass urine at all", "Severe lower abdominal pain with retention", "Fever with urinary symptoms / suspected sepsis"], seeDoctorIf: ["Ongoing urinary symptoms in men", "Blood in urine", "Symptoms disrupting sleep"], doNot: ["Do not invent prostate medicine doses", "Do not ignore acute urinary retention"] },
      { summary: "HBP: jet faible, nycturie. Urgences si rétention urinaire ou fièvre. Pas de posologies inventées.", emergencyIf: ["Impossibilité d'uriner", "Douleur abdominale basse sévère", "Fièvre avec symptômes urinaires"], seeDoctorIf: ["Troubles urinaires persistants"], doNot: ["Pas de posologies inventées"] },
      { summary: "ערמונית מוגדלת: זרם חלש, השתנה לילית. חירום באצירת שתן או חום. אין מינונים מומצאים.", emergencyIf: ["אי יכולת להשתין בכלל", "כאב בטן תחתונה קשה", "חום עם תסמיני שתן"], seeDoctorIf: ["תסמיני שתן מתמשכים"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Аденома простаты: слабая струя, никтурия. Неотложка при задержке мочи или лихорадке. Дозы не выдумывать.", emergencyIf: ["Полная невозможность помочиться", "Сильная боль внизу живота", "Лихорадка с мочевыми симптомами"], seeDoctorIf: ["Стойкие мочевые симптомы"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsBPH],
  },
  {
    id: "prostatitis",
    category: "mens-health",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["prostatitis", "prostate infection pain peeing"],
      fr: ["prostatite", "infection prostate douleur miction"],
      he: ["דלקת ערמונית", "פרוסטטיטיס", "כאב במתן שתן ערמונית"],
      ru: ["простатит", "воспаление простаты", "боль при мочеиспускании простата"],
    },
    titles: { en: "Prostatitis", fr: "Prostatite", he: "דלקת ערמונית", ru: "Простатит" },
    guidance: g(
      { summary: "Prostatitis can cause pelvic/perineal pain, painful urination, fever and flu-like illness. NHS: acute bacterial prostatitis needs urgent medical care; chronic forms need GP pathways. Never invent antibiotic doses. Emergency: high fever, confusion, inability to pee, or severe systemic illness.", emergencyIf: ["High fever, shaking chills, confusion", "Cannot pass urine", "Severe systemic illness"], seeDoctorIf: ["Pelvic/perineal pain with urinary symptoms", "Recurrent UTIs in men"], doNot: ["Do not invent antibiotic regimens", "Do not delay care for fever with urinary symptoms"] },
      { summary: "Prostatite: douleur pelvienne/périnée, dysurie, fièvre. Urgence si fièvre élevée. Pas d'antibiotiques inventés.", emergencyIf: ["Forte fièvre, frissons, confusion", "Rétention urinaire"], seeDoctorIf: ["Douleur pelvienne avec symptômes urinaires"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "דלקת ערמונית: כאב אגן/פרינאום, צריבה במתן שתן, חום. חירום בחום גבוה. אין אנטיביוטיקה מומצאת.", emergencyIf: ["חום גבוה, צמרמורות, בלבול", "אצירת שתן"], seeDoctorIf: ["כאב אגן עם תסמיני שתן"], doNot: ["אין משטרי אנטיביוטיקה מומצאים"] },
      { summary: "Простатит: боль в тазу/промежности, дизурия, лихорадка. Неотложка при высокой лихорадке. Антибиотики не выдумывать.", emergencyIf: ["Высокая лихорадка, озноб, спутанность", "Задержка мочи"], seeDoctorIf: ["Тазовая боль с мочевыми симптомами"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsProstatitis],
  },
  {
    id: "glaucoma",
    category: "eye",
    urgencyDefault: "consultation",
    priority: 6,
    keywords: {
      en: ["glaucoma", "eye pressure glaucoma", "acute angle closure eye pain"],
      fr: ["glaucome", "pression oculaire glaucome", "glaucome aigu douleur œil"],
      he: ["גלאוקומה", "לחץ תוך עיני", "גלאוקומה חריפה כאב עין"],
      ru: ["глаукома", "внутриглазное давление", "острая глаукома боль в глазу"],
    },
    titles: { en: "Glaucoma", fr: "Glaucome", he: "גלאוקומה", ru: "Глаукома" },
    guidance: g(
      { summary: "Glaucoma can damage the optic nerve, often without early symptoms. Acute angle-closure glaucoma is an emergency: sudden severe eye pain, headache, nausea, halos, red eye and blurred vision — seek emergency care immediately. Routine open-angle disease needs optometrist/ophthalmology pathways. Never invent eye-drop doses.", emergencyIf: ["Sudden severe eye pain with nausea/vomiting", "Sudden vision loss or coloured halos with red eye", "Hard, painful eye with headache"], seeDoctorIf: ["Family history / risk factors — regular eye checks", "Gradual peripheral vision concerns"], doNot: ["Do not invent glaucoma drop regimens", "Do not delay acute painful red eye with vision change"] },
      { summary: "Glaucome: urgence si douleur oculaire brutale, nausées, halos, œil rouge. Pas de posologies inventées.", emergencyIf: ["Douleur oculaire brutale avec nausées", "Baisse visuelle soudaine / halos", "Œil rouge douloureux"], seeDoctorIf: ["Facteurs de risque — contrôles"], doNot: ["Pas de collyres inventés"] },
      { summary: "גלאוקומה: חירום בכאב עין פתאומי, בחילות, הילות, עין אדומה. אין טיפות מומצאות.", emergencyIf: ["כאב עין פתאומי עם בחילות", "ירידת ראייה פתאומית / הילות", "עין אדומה כואבת"], seeDoctorIf: ["גורמי סיכון — בדיקות עיניים"], doNot: ["אין מינוני טיפות מומצאים"] },
      { summary: "Глаукома: неотложка при внезапной боли в глазу, тошноте, радужных кругах. Капли не выдумывать.", emergencyIf: ["Внезапная сильная боль в глазу с тошнотой", "Внезапная потеря зрения / круги", "Красный болезненный глаз"], seeDoctorIf: ["Факторы риска — осмотры"], doNot: ["Не изобретать глазные капли"] }
    ),
    sources: [S.nhsGlaucoma],
  },
  {
    id: "cataracts",
    category: "eye",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["cataracts", "cloudy vision cataract", "lens cloudy eye"],
      fr: ["cataracte", "vision trouble cataracte", "cristallin opaque"],
      he: ["קטרקט", "עדשה עכורה", "ראייה מטושטשת קטרקט"],
      ru: ["катаракта", "мутная линза глаза", "затуманенное зрение катаракта"],
    },
    titles: { en: "Cataracts", fr: "Cataracte", he: "קטרקט", ru: "Катаракта" },
    guidance: g(
      { summary: "Cataracts cause gradual cloudy or blurry vision, glare and faded colours. NHS: optometrist/GP referral; surgery is common when vision affects daily life. Sudden vision loss, severe eye pain, or flashes/floaters with curtain need urgent pathways (not typical cataract). Never invent eye-drop 'cures'.", emergencyIf: ["Sudden vision loss", "Severe eye pain", "Curtain over vision / many new floaters with flashes"], seeDoctorIf: ["Gradual cloudy vision affecting driving/reading", "Glare at night"], doNot: ["Do not invent cataract-dissolving drops or supplements as proven cures"] },
      { summary: "Cataracte: vision trouble progressive. Urgences si baisse brutale, douleur, voile. Pas de 'gouttes miracles' inventées.", emergencyIf: ["Baisse visuelle brutale", "Douleur oculaire sévère", "Voile / corps flottants avec éclairs"], seeDoctorIf: ["Vision trouble progressive"], doNot: ["Pas de collyres inventés comme cure"] },
      { summary: "קטרקט: ראייה מעוננת הדרגתית. חירום בירידה פתאומית/כאב. אין טיפות 'קסם' מומצאות.", emergencyIf: ["ירידת ראייה פתאומית", "כאב עין קשה", "וילון / נקודות צפות עם הבזקים"], seeDoctorIf: ["ראייה מעוננת מתקדמת"], doNot: ["אין טיפות מומצאות כריפוי"] },
      { summary: "Катаракта: постепенное помутнение зрения. Неотложка при внезапной потере/боли. «Чудо-капли» не выдумывать.", emergencyIf: ["Внезапная потеря зрения", "Сильная боль в глазу", "Завеса / мушки со вспышками"], seeDoctorIf: ["Прогрессирующее помутнение зрения"], doNot: ["Не изобретать капли-«лечение»"] }
    ),
    sources: [S.nhsCataracts],
  },
  {
    id: "macular-degeneration",
    category: "eye",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["macular degeneration", "AMD age-related macular", "central vision distortion"],
      fr: ["dégénérescence maculaire", "DMLA", "vision centrale déformée"],
      he: ["ניוון מקולרי", "AMD מקולה", "עיוות ראייה מרכזית"],
      ru: ["макулярная дегенерация", "ВМД макула", "искажение центрального зрения"],
    },
    titles: { en: "Age-related macular degeneration", fr: "DMLA", he: "ניוון מקולרי הקשור לגיל", ru: "Возрастная макулярная дегенерация" },
    guidance: g(
      { summary: "AMD affects central vision (reading, faces). NHS: sudden distortion, a dark patch in central vision, or rapid worsening needs urgent ophthalmology assessment (possible wet AMD). Dry AMD is usually slower. Never invent injection or supplement doses as treatment advice.", emergencyIf: ["Sudden central vision distortion or dark patch", "Rapid worsening of central vision in one eye"], seeDoctorIf: ["Gradual difficulty reading/recognising faces", "Family history — regular eye checks"], doNot: ["Do not invent anti-VEGF injection schedules or mega-dose supplements"] },
      { summary: "DMLA: vision centrale. Urgence si déformation/tache centrale soudaine. Pas de posologies inventées.", emergencyIf: ["Déformation ou tache centrale soudaine", "Aggravation rapide d'un œil"], seeDoctorIf: ["Difficulté progressive à lire"], doNot: ["Pas de schémas d'injections inventés"] },
      { summary: "ניוון מקולרי: ראייה מרכזית. חירום בעיוות/כתם מרכזי פתאומי. אין מינונים מומצאים.", emergencyIf: ["עיוות או כתם מרכזי פתאומי", "החמרה מהירה בעין אחת"], seeDoctorIf: ["קושי הדרגתי בקריאה"], doNot: ["אין לוחות זמנים להזרקות מומצאים"] },
      { summary: "ВМД: центральное зрение. Неотложка при внезапном искажении/пятне. Дозы/инъекции не выдумывать.", emergencyIf: ["Внезапное искажение или тёмное пятно в центре", "Быстрое ухудшение одного глаза"], seeDoctorIf: ["Постепенные трудности с чтением"], doNot: ["Не изобретать схемы инъекций"] }
    ),
    sources: [S.nhsAMD],
  },
  {
    id: "dry-eyes",
    category: "eye",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["dry eyes", "gritty eyes dry", "artificial tears dry eye"],
      fr: ["œil sec", "yeux secs gritty", "larmes artificielles"],
      he: ["עיניים יבשות", "תחושת חול בעיניים", "דמעות מלאכותיות"],
      ru: ["сухие глаза", "ощущение песка в глазах", "искусственные слёзы"],
    },
    titles: { en: "Dry eyes", fr: "Œil sec", he: "עיניים יבשות", ru: "Сухие глаза" },
    guidance: g(
      { summary: "Dry eyes feel gritty, burning or watery-paradoxically. NHS: blink breaks, humidify, and pharmacy lubricating drops may help — brands/doses are individual; this pack does not invent regimens. Urgent care for severe pain, sudden vision loss, light sensitivity with trauma, or chemical splash.", emergencyIf: ["Chemical splash in eye", "Sudden vision loss or severe eye pain", "Injury with light intolerance"], seeDoctorIf: ["Persistent dryness affecting vision", "Contact lens wearers with ongoing irritation"], doNot: ["Do not invent steroid eye-drop regimens", "Do not ignore chemical eye injury"] },
      { summary: "Œil sec: pauses clignement, larmes artificielles en pharmacie. Urgences si brûlure chimique, douleur sévère, baisse visuelle.", emergencyIf: ["Produit chimique dans l'œil", "Baisse visuelle / douleur sévère"], seeDoctorIf: ["Sécheresse persistante"], doNot: ["Pas de collyres stéroïdes inventés"] },
      { summary: "עיניים יבשות: הפסקות מצמוץ, דמעות מבית מרקחת. חירום בכוויה כימית או כאב/ירידת ראייה.", emergencyIf: ["חומר כימי בעין", "ירידת ראייה / כאב קשה"], seeDoctorIf: ["יבשות מתמשכת"], doNot: ["אין טיפות סטרואידים מומצאות"] },
      { summary: "Сухие глаза: перерывы на моргание, аптечные капли. Неотложка при химическом ожоге или сильной боли/потере зрения.", emergencyIf: ["Химическое вещество в глазу", "Потеря зрения / сильная боль"], seeDoctorIf: ["Стойкая сухость"], doNot: ["Не изобретать стероидные капли"] }
    ),
    sources: [S.nhsDryEyes],
  },
  {
    id: "sleep-apnoea",
    category: "respiratory",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["sleep apnoea", "sleep apnea snoring pauses breathing", "CPAP sleep apnoea"],
      fr: ["apnée du sommeil", "ronflement pauses respiratoires", "PPC apnée"],
      he: ["דום נשימה בשינה", "נחירות עם הפסקות נשימה", "CPAP דום נשימה"],
      ru: ["апноэ сна", "храп с остановками дыхания", "СИПАП апноэ"],
    },
    titles: { en: "Sleep apnoea", fr: "Apnée du sommeil", he: "דום נשימה בשינה", ru: "Апноэ сна" },
    guidance: g(
      { summary: "Obstructive sleep apnoea causes pauses in breathing during sleep, loud snoring, daytime sleepiness and concentration problems. NHS: GP/sleep clinic pathways; CPAP and lifestyle measures are clinician-led — never invent device settings or drug doses. Emergency: severe breathlessness while awake, chest pain, or blue lips — use cardio/respiratory pathways.", emergencyIf: ["Severe breathlessness at rest while awake", "Chest pain or blue lips", "Confusion with breathing difficulty"], seeDoctorIf: ["Loud snoring with witnessed pauses", "Daytime sleepiness affecting driving", "Morning headaches with snoring"], doNot: ["Do not invent CPAP pressure settings or stimulant doses", "Do not drive if dangerously sleepy"] },
      { summary: "Apnée du sommeil: pauses, ronflement, somnolence. Orientation NHS; pas de réglages PPC inventés. Urgences si dyspnée éveillée sévère.", emergencyIf: ["Dyspnée sévère éveillé", "Douleur thoracique / lèvres bleues"], seeDoctorIf: ["Ronflement avec pauses", "Somnolence diurne"], doNot: ["Pas de réglages PPC inventés"] },
      { summary: "דום נשימה בשינה: הפסקות, נחירות, ישנוניות. לפי NHS; אין הגדרות CPAP מומצאות. חירום בקוצר נשימה בערות.", emergencyIf: ["קוצר נשימה קשה בערות", "כאב חזה / שפתיים כחולות"], seeDoctorIf: ["נחירות עם הפסקות", "ישנוניות ביום"], doNot: ["אין הגדרות CPAP מומצאות"] },
      { summary: "Апноэ сна: паузы, храп, сонливость. Ориентир NHS; настройки СИПАП не выдумывать. Неотложка при тяжёлой одышке наяву.", emergencyIf: ["Тяжёлая одышка наяву", "Боль в груди / синие губы"], seeDoctorIf: ["Храп с паузами", "Дневная сонливость"], doNot: ["Не изобретать настройки СИПАП"] }
    ),
    sources: [S.nhsSleepApnoea],
  },
  {
    id: "atrial-fibrillation",
    category: "cardio",
    urgencyDefault: "consultation",
    priority: 7,
    keywords: {
      en: ["atrial fibrillation", "AF irregular heartbeat", "heart flutter AF"],
      fr: ["fibrillation auriculaire", "FA rythme irrégulier", "cœur irrégulier FA"],
      he: ["פרפור פרוזדורים", "AF דופק לא סדיר", "דפיקות לב פרפור"],
      ru: ["мерцательная аритмия", "фибрилляция предсердий", "нерегулярный пульс ФП"],
    },
    titles: { en: "Atrial fibrillation", fr: "Fibrillation auriculaire", he: "פרפור פרוזדורים", ru: "Фибрилляция предсердий" },
    guidance: g(
      { summary: "AF is an irregular often rapid heart rhythm that raises stroke risk. NHS: new AF needs medical assessment; anticoagulants/rate control are clinician-prescribed — never invent doses. Emergency: chest pain, severe breathlessness, fainting, stroke symptoms (FAST), or very fast pulse with collapse. See red-flags-cardio/stroke entries.", emergencyIf: ["Chest pain or severe breathlessness", "Fainting or near-fainting", "Stroke symptoms (face/arm/speech)", "Collapse with very fast pulse"], seeDoctorIf: ["New irregular heartbeat or palpitations", "Known AF with worsening symptoms"], doNot: ["Do not invent anticoagulant or antiarrhythmic doses", "Do not ignore stroke warning signs"] },
      { summary: "FA: rythme irrégulier, risque d'AVC. Urgences si douleur thoracique, dyspnée, malaise, signes d'AVC. Pas de posologies inventées.", emergencyIf: ["Douleur thoracique / dyspnée sévère", "Syncope", "Signes d'AVC"], seeDoctorIf: ["Palpitations / rythme irrégulier nouveau"], doNot: ["Pas d'anticoagulants inventés"] },
      { summary: "פרפור פרוזדורים: דופק לא סדיר, סיכון לשבץ. חירום בכאב חזה, קוצר נשימה, התעלפות, סימני שבץ. אין מינונים מומצאים.", emergencyIf: ["כאב חזה / קוצר נשימה קשה", "התעלפות", "סימני שבץ"], seeDoctorIf: ["דפיקות / דופק לא סדיר חדש"], doNot: ["אין נוגדי קרישה מומצאים"] },
      { summary: "ФП: нерегулярный ритм, риск инсульта. Неотложка при боли в груди, одышке, обмороке, признаках инсульта. Дозы не выдумывать.", emergencyIf: ["Боль в груди / тяжёлая одышка", "Обморок", "Признаки инсульта"], seeDoctorIf: ["Новые перебои / нерегулярный пульс"], doNot: ["Не изобретать антикоагулянты"] }
    ),
    sources: [S.nhsAF],
  },
  {
    id: "angina",
    category: "cardio",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["angina", "chest pain on exertion angina", "stable angina"],
      fr: ["angine de poitrine", "douleur thoracique à l'effort", "angor"],
      he: ["אנגינה פקטוריס", "כאב חזה במאמץ", "תעוקת חזה"],
      ru: ["стенокардия", "боль в груди при нагрузке", "грудная жаба"],
    },
    titles: { en: "Angina", fr: "Angine de poitrine", he: "תעוקת חזה (אנגינה)", ru: "Стенокардия" },
    guidance: g(
      { summary: "Angina is chest discomfort often triggered by exertion or stress and eased by rest. NHS: new or worsening chest pain needs urgent medical assessment — call emergency services for pain at rest, lasting >15 minutes, with breathlessness, sweating, nausea, or radiating pain (possible heart attack). Never invent GTN or other cardiac drug doses.", emergencyIf: ["Chest pain at rest or lasting more than 15 minutes", "Pain with breathlessness, sweating, nausea, or arm/jaw radiation", "Sudden collapse"], seeDoctorIf: ["Predictable exertional chest discomfort", "Known angina becoming more frequent"], doNot: ["Do not invent GTN/beta-blocker doses", "Do not drive yourself with suspected heart attack"] },
      { summary: "Angor: douleur à l'effort. Urgences si douleur au repos >15 min, dyspnée, sueurs. Pas de posologies inventées.", emergencyIf: ["Douleur au repos ou >15 min", "Douleur avec dyspnée/sueurs/nausées", "Malaise"], seeDoctorIf: ["Douleur d'effort prévisible"], doNot: ["Pas de posologies de trinitrine inventées"] },
      { summary: "אנגינה: כאב במאמץ. חירום בכאב במנוחה >15 דק', קוצר נשימה, הזעה. אין מינונים מומצאים.", emergencyIf: ["כאב במנוחה או מעל 15 דקות", "כאב עם קוצר נשימה/הזעה/בחילה", "התמוטטות"], seeDoctorIf: ["כאב חזה במאמץ צפוי"], doNot: ["אין מינוני ניטרטים מומצאים"] },
      { summary: "Стенокардия: боль при нагрузке. Неотложка при боли в покое >15 мин, одышке, поте. Дозы не выдумывать.", emergencyIf: ["Боль в покое или >15 минут", "Боль с одышкой/потом/тошнотой", "Коллапс"], seeDoctorIf: ["Предсказуемая боль при нагрузке"], doNot: ["Не изобретать дозы нитратов"] }
    ),
    sources: [S.nhsAngina],
  },
  {
    id: "hiatus-hernia",
    category: "gi",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["hiatus hernia", "hiatal hernia heartburn", "stomach hernia diaphragm"],
      fr: ["hernie hiatale", "brûlures hernie hiatale"],
      he: ["בקע סרעפתי", "היאטוס הרניה", "צרבת בקע סרעפתי"],
      ru: ["хиатальная грыжа", "грыжа пищеводного отверстия", "изжога хиатальная грыжа"],
    },
    titles: { en: "Hiatus hernia", fr: "Hernie hiatale", he: "בקע סרעפתי", ru: "Хиатальная грыжа" },
    guidance: g(
      { summary: "A hiatus hernia can contribute to heartburn and reflux. NHS: lifestyle measures and pharmacy/GP pathways similar to GORD; surgery is specialist. Emergency: sudden severe chest/abdominal pain, vomiting blood, black stools, or difficulty swallowing solids/liquids with weight loss — urgent assessment. Never invent PPI doses.", emergencyIf: ["Vomiting blood or black stools", "Sudden severe chest/abdominal pain", "Food sticking with progressive swallowing difficulty"], seeDoctorIf: ["Persistent heartburn", "Known hiatus hernia with worsening reflux"], doNot: ["Do not invent PPI regimens", "Do not dismiss vomiting blood"] },
      { summary: "Hernie hiatale: reflux. Urgences si hématémèse, méléna, douleur brutale, dysphagie progressive. Pas de posologies inventées.", emergencyIf: ["Vomissements de sang / selles noires", "Douleur thoracique/abdominale brutale", "Dysphagie progressive"], seeDoctorIf: ["Brûlures persistantes"], doNot: ["Pas de posologies d'IPP inventées"] },
      { summary: "בקע סרעפתי: צרבת. חירום בהקאת דם, צואה שחורה, כאב פתאומי. אין מינונים מומצאים.", emergencyIf: ["הקאת דם / צואה שחורה", "כאב חזה/בטן פתאומי", "קושי בליעה מתקדם"], seeDoctorIf: ["צרבת מתמשכת"], doNot: ["אין מינוני PPI מומצאים"] },
      { summary: "Хиатальная грыжа: изжога. Неотложка при кровавой рвоте, чёрном стуле, внезапной боли. Дозы не выдумывать.", emergencyIf: ["Кровавая рвота / чёрный стул", "Внезапная боль в груди/животе", "Прогрессирующая дисфагия"], seeDoctorIf: ["Стойкая изжога"], doNot: ["Не изобретать дозы ИПП"] }
    ),
    sources: [S.nhsHiatus],
  },
  {
    id: "anal-fissure",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["anal fissure", "tear anus pain pooing", "painful bowel movement crack"],
      fr: ["fissure anale", "déchirure anus douleur selles"],
      he: ["סדק אנאלי", "קרע בפי הטבעת", "כאב ביציאות סדק"],
      ru: ["анальная трещина", "трещина заднего прохода", "боль при дефекации трещина"],
    },
    titles: { en: "Anal fissure", fr: "Fissure anale", he: "סדק אנאלי", ru: "Анальная трещина" },
    guidance: g(
      { summary: "An anal fissure is a small tear causing sharp pain on passing stools and sometimes bright red blood on paper. NHS: soften stools (fluids/fibre), gentle hygiene; pharmacy/GP options exist — never invent GTN ointment doses. Emergency: heavy rectal bleeding, black stools, severe abdominal pain, or fever with anal swelling (abscess).", emergencyIf: ["Heavy rectal bleeding or black stools", "Severe abdominal pain", "Fever with painful anal swelling"], seeDoctorIf: ["Pain lasting more than a couple of weeks", "Recurrent bleeding", "Difficulty passing stools"], doNot: ["Do not invent GTN/diltiazem ointment doses", "Do not ignore heavy bleeding"] },
      { summary: "Fissure anale: douleur vive aux selles. Adoucir selles; pas de posologies de pommades inventées. Urgences si hémorragie abondante/abcès.", emergencyIf: ["Hémorragie rectale abondante", "Douleur abdominale sévère", "Fièvre avec tuméfaction anale"], seeDoctorIf: ["Douleur > quelques semaines"], doNot: ["Pas de posologies de pommades inventées"] },
      { summary: "סדק אנאלי: כאב חד ביציאות. ריכוך צואה; אין מינוני משחות מומצאים. חירום בדימום כבד/מורסה.", emergencyIf: ["דימום רקטלי כבד", "כאב בטן קשה", "חום עם נפיחות אנאלית"], seeDoctorIf: ["כאב מעל שבועיים"], doNot: ["אין מינוני משחות מומצאים"] },
      { summary: "Анальная трещина: острая боль при стуле. Размягчать стул; дозы мазей не выдумывать. Неотложка при обильном кровотечении/абсцессе.", emergencyIf: ["Обильное ректальное кровотечение", "Сильная боль в животе", "Лихорадка с анальным отёком"], seeDoctorIf: ["Боль дольше пары недель"], doNot: ["Не изобретать дозы мазей"] }
    ),
    sources: [S.nhsAnalFissure],
  },
  {
    id: "hernia",
    category: "surgery",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["hernia", "inguinal hernia groin lump", "bulge groin hernia"],
      fr: ["hernie", "hernie inguinale bosse aine", "hernie étranglée"],
      he: ["בקע מפשעתי", "הרניה במפשעה", "גוש במפשעה בקע"],
      ru: ["грыжа", "паховая грыжа", "выпячивание в паху"],
    },
    titles: { en: "Hernia (groin/abdominal)", fr: "Hernie (aine/abdomen)", he: "בקע (מפשעה/בטן)", ru: "Грыжа (паховая/брюшная)" },
    guidance: g(
      { summary: "A hernia is a bulge where tissue pushes through a weak spot, often in the groin. NHS: GP assessment; surgery may be advised. Emergency (possible strangulation): sudden severe pain at the bulge, irreducible lump, vomiting, fever, or red/tender overlying skin — seek emergency care. Never invent pain-drug regimens.", emergencyIf: ["Sudden severe pain at hernia site", "Bulge that cannot be pushed back with vomiting", "Fever or red/tender skin over the lump"], seeDoctorIf: ["New groin/abdominal bulge", "Discomfort with lifting/coughing"], doNot: ["Do not ignore a painful irreducible hernia", "Do not invent opioid regimens"] },
      { summary: "Hernie: bosse à l'aine. Urgence si douleur brutale, hernie irréductible, vomissements (étranglement).", emergencyIf: ["Douleur brutale sur la hernie", "Bosse irréductible avec vomissements", "Fièvre / peau rouge"], seeDoctorIf: ["Nouvelle bosse à l'aine"], doNot: ["Ne pas ignorer une hernie douloureuse irréductible"] },
      { summary: "בקע: גוש במפשעה. חירום בכאב פתאומי, בקע שאינו ניתן להחזרה עם הקאות.", emergencyIf: ["כאב פתאומי בבקע", "גוש שאינו ניתן להחזרה עם הקאות", "חום / עור אדום"], seeDoctorIf: ["גוש חדש במפשעה"], doNot: ["לא להתעלם מבקע כואב שאינו חוזר"] },
      { summary: "Грыжа: выпячивание в паху. Неотложка при внезапной боли, невправимости, рвоте (ущемление).", emergencyIf: ["Внезапная боль в грыже", "Невправимое выпячивание с рвотой", "Лихорадка / красная кожа"], seeDoctorIf: ["Новое выпячивание в паху"], doNot: ["Не игнорировать болезненную невправимую грыжу"] }
    ),
    sources: [S.nhsHernia],
  },
  {
    id: "frozen-shoulder",
    category: "msk",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["frozen shoulder", "adhesive capsulitis", "stiff painful shoulder frozen"],
      fr: ["épaule gelée", "capsulite rétractile", "épaule raide douloureuse"],
      he: ["כתף קפואה", "דלקת מעטפת הכתף", "כתף נוקשה כואבת"],
      ru: ["замёрзшее плечо", "адгезивный капсулит", "тугоподвижное плечо"],
    },
    titles: { en: "Frozen shoulder", fr: "Épaule gelée", he: "כתף קפואה", ru: "«Замёрзшее» плечо" },
    guidance: g(
      { summary: "Frozen shoulder causes progressive pain and stiffness limiting movement. NHS: physiotherapy and time; medicines/injections are clinician-led — never invent steroid doses. Emergency: sudden deformity after trauma (possible dislocation/fracture), neurovascular compromise, or chest pain radiating to shoulder (cardiac).", emergencyIf: ["Shoulder deformity after injury", "Chest pain with shoulder radiation / suspected cardiac", "Sudden loss of pulse/colour in the arm"], seeDoctorIf: ["Progressive shoulder stiffness lasting weeks", "Pain waking you at night"], doNot: ["Do not invent steroid injection doses", "Do not force a traumatically injured shoulder"] },
      { summary: "Épaule gelée: raideur progressive. Urgences si déformation traumatique ou douleur thoracique. Pas de posologies inventées.", emergencyIf: ["Déformation après traumatisme", "Douleur thoracique irradiant à l'épaule", "Membre froid/pâle"], seeDoctorIf: ["Raideur progressive"], doNot: ["Pas d'injections de stéroïdes inventées"] },
      { summary: "כתף קפואה: נוקשות מתקדמת. חירום בעיוות אחרי חבלה או כאב חזה. אין מינונים מומצאים.", emergencyIf: ["עיוות אחרי חבלה", "כאב חזה עם הקרנה לכתף", "יד חיוורת/קרה"], seeDoctorIf: ["נוקשות מתקדמת"], doNot: ["אין מינוני הזרקות סטרואידים מומצאים"] },
      { summary: "«Замёрзшее» плечо: нарастающая скованность. Неотложка при деформации после травмы или боли в груди. Дозы не выдумывать.", emergencyIf: ["Деформация после травмы", "Боль в груди с иррадиацией в плечо", "Холодная/бледная рука"], seeDoctorIf: ["Прогрессирующая скованность"], doNot: ["Не изобретать дозы стероидных инъекций"] }
    ),
    sources: [S.nhsFrozenShoulder],
  },
];

const existing = new Set(readdirSync(dir).map((f) => f.replace(/\.json$/, "")));
let wrote = 0;
for (const e of entries) {
  if (existing.has(e.id)) {
    console.log("skip existing", e.id);
    continue;
  }
  writeFileSync(join(dir, `${e.id}.json`), JSON.stringify(e, null, 2) + "\n");
  wrote++;
  console.log("wrote", e.id);
}

// Rebuild pack.meta.json
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const categories = [...new Set(files.map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")).category))].sort();
const meta = JSON.parse(readFileSync(join(root, "data/knowledge/pack.meta.json"), "utf8"));
meta.version = "1.8.0";
meta.entryCount = files.length;
meta.updatedAt = R;
meta.categories = categories;
meta.entryFiles = files.map((f) => `entries/${f}`);
writeFileSync(join(root, "data/knowledge/pack.meta.json"), JSON.stringify(meta, null, 2) + "\n");

// Rebuild sources.json catalog
const catalog = { sources: [] };
const seen = new Set();
for (const f of files) {
  const entry = JSON.parse(readFileSync(join(dir, f), "utf8"));
  for (const s of entry.sources || []) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    catalog.sources.push(s);
  }
}
catalog.sources.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(join(root, "data/knowledge/sources.json"), JSON.stringify(catalog, null, 2) + "\n");

// Rebuild load.ts
function camel(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9_]/g, "_");
}
const imports = files.map((f) => {
  const id = f.replace(/\.json$/, "");
  return `import ${camel(id)} from "../../../data/knowledge/entries/${id}.json";`;
}).join("\n");
const list = files.map((f) => "  " + camel(f.replace(/\.json$/, ""))).join(",\n");
writeFileSync(join(root, "src/lib/knowledge/load.ts"), `import type { KnowledgeEntry, KnowledgePackMeta } from "./types";
import packMeta from "../../../data/knowledge/pack.meta.json";
${imports}

const ENTRIES = [
${list},
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
`);
console.log("pack", files.length, "sources", catalog.sources.length, "wrote", wrote);

#!/usr/bin/env node
/**
 * Batch 10 medical knowledge entries — public NHS sources only.
 * Target: bring pack to ~200 attributed entries, then pause expansion.
 * Run: node scripts/gen-batch10-entries.mjs
 */
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsSjogren: { id: "nhs-sjogrens", name: "NHS — Sjögren's syndrome", org: "NHS", url: "https://www.nhs.uk/conditions/sjogrens-syndrome/", retrievedAt: R },
  nhsRaynaud: { id: "nhs-raynauds", name: "NHS — Raynaud's", org: "NHS", url: "https://www.nhs.uk/conditions/raynauds/", retrievedAt: R },
  nhsPAD: { id: "nhs-pad", name: "NHS — Peripheral arterial disease", org: "NHS", url: "https://www.nhs.uk/conditions/peripheral-arterial-disease-pad/", retrievedAt: R },
  nhsLymphoedema: { id: "nhs-lymphoedema", name: "NHS — Lymphoedema", org: "NHS", url: "https://www.nhs.uk/conditions/lymphoedema/", retrievedAt: R },
  nhsBronchiectasis: { id: "nhs-bronchiectasis", name: "NHS — Bronchiectasis", org: "NHS", url: "https://www.nhs.uk/conditions/bronchiectasis/", retrievedAt: R },
  nhsSarcoid: { id: "nhs-sarcoidosis", name: "NHS — Sarcoidosis", org: "NHS", url: "https://www.nhs.uk/conditions/sarcoidosis/", retrievedAt: R },
  nhsMG: { id: "nhs-myasthenia-gravis", name: "NHS — Myasthenia gravis", org: "NHS", url: "https://www.nhs.uk/conditions/myasthenia-gravis/", retrievedAt: R },
  nhsDementia: { id: "nhs-dementia", name: "NHS — Dementia", org: "NHS", url: "https://www.nhs.uk/conditions/dementia/", retrievedAt: R },
  nhsBipolar: { id: "nhs-bipolar", name: "NHS — Bipolar disorder", org: "NHS", url: "https://www.nhs.uk/conditions/bipolar-disorder/", retrievedAt: R },
  nhsOCD: { id: "nhs-ocd", name: "NHS — OCD", org: "NHS", url: "https://www.nhs.uk/conditions/obsessive-compulsive-disorder-ocd/", retrievedAt: R },
  nhsPTSD: { id: "nhs-ptsd", name: "NHS — PTSD", org: "NHS", url: "https://www.nhs.uk/conditions/post-traumatic-stress-disorder-ptsd/", retrievedAt: R },
  nhsED: { id: "nhs-eating-disorders", name: "NHS — Eating disorders", org: "NHS", url: "https://www.nhs.uk/conditions/eating-disorders/", retrievedAt: R },
  nhsTrigger: { id: "nhs-trigger-finger", name: "NHS — Trigger finger", org: "NHS", url: "https://www.nhs.uk/conditions/trigger-finger/", retrievedAt: R },
  nhsDupuytren: { id: "nhs-dupuytrens", name: "NHS — Dupuytren's contracture", org: "NHS", url: "https://www.nhs.uk/conditions/dupuytrens-contracture/", retrievedAt: R },
  nhsIngrown: { id: "nhs-ingrown-toenail", name: "NHS — Ingrown toenail", org: "NHS", url: "https://www.nhs.uk/conditions/ingrown-toenail/", retrievedAt: R },
  nhsCorns: { id: "nhs-corns-calluses", name: "NHS — Corns and calluses", org: "NHS", url: "https://www.nhs.uk/conditions/corns-and-calluses/", retrievedAt: R },
  nhsVitiligo: { id: "nhs-vitiligo", name: "NHS — Vitiligo", org: "NHS", url: "https://www.nhs.uk/conditions/vitiligo/", retrievedAt: R },
  nhsOA: { id: "nhs-osteoarthritis", name: "NHS — Osteoarthritis", org: "NHS", url: "https://www.nhs.uk/conditions/osteoarthritis/", retrievedAt: R },
  nhsKidneyInf: { id: "nhs-kidney-infection", name: "NHS — Kidney infection", org: "NHS", url: "https://www.nhs.uk/conditions/kidney-infection/", retrievedAt: R },
  nhsIncontinence: { id: "nhs-urinary-incontinence", name: "NHS — Urinary incontinence", org: "NHS", url: "https://www.nhs.uk/conditions/urinary-incontinence/", retrievedAt: R },
};

const entries = [
  {
    id: "sjogrens-syndrome",
    category: "rheumatology",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["Sjogren syndrome", "Sjögren dry eyes mouth", "autoimmune dry mouth Sjogren"],
      fr: ["syndrome de Sjögren", "Sjögren yeux bouche secs", "sécheresse Sjögren"],
      he: ["תסמונת שיוגרן", "יובש עיניים פה שיוגרן", "שיוגרן אוטואימוני"],
      ru: ["синдром Шегрена", "сухость глаз рта Шегрен", "Шегрен аутоиммунный"],
    },
    titles: { en: "Sjögren's syndrome — orientation", fr: "Syndrome de Sjögren — orientation", he: "תסמונת שיוגרן — התמצאות", ru: "Синдром Шегрена — ориентир" },
    guidance: g(
      { summary: "Sjögren's often causes dry eyes and dry mouth and can involve other organs. NHS: GP/rheumatology pathways; lubricating drops and dental care help dryness — never invent immunosuppressant doses. Emergency: sudden severe breathlessness, chest pain, high fever with confusion, or sudden vision loss.", emergencyIf: ["Severe breathlessness or chest pain", "Sudden vision loss", "High fever with confusion"], seeDoctorIf: ["Persistent dry eyes/mouth affecting eating or vision", "Joint pain with dryness"], doNot: ["Do not invent steroid/immunosuppressant doses"] },
      { summary: "Sjögren: sécheresse oculaire/buccale. Orientation NHS; pas de posologies inventées. Urgences si dyspnée, baisse visuelle brutale, fièvre avec confusion.", emergencyIf: ["Dyspnée sévère / douleur thoracique", "Baisse visuelle brutale", "Forte fièvre avec confusion"], seeDoctorIf: ["Sécheresse persistante"], doNot: ["Pas de posologies inventées"] },
      { summary: "שיוגרן: יובש עיניים/פה. לפי NHS; אין מינונים מומצאים. חירום בקוצר נשימה, ירידת ראייה פתאומית, חום עם בלבול.", emergencyIf: ["קוצר נשימה / כאב חזה", "ירידת ראייה פתאומית", "חום גבוה עם בלבול"], seeDoctorIf: ["יובש מתמשך"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Шегрен: сухость глаз/рта. Ориентир NHS; дозы не выдумывать. Неотложка при одышке, внезапной потере зрения, лихорадке со спутанностью.", emergencyIf: ["Тяжёлая одышка / боль в груди", "Внезапная потеря зрения", "Высокая лихорадка со спутанностью"], seeDoctorIf: ["Стойкая сухость"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsSjogren],
  },
  {
    id: "raynauds",
    category: "vascular",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["Raynaud", "fingers white blue cold Raynaud", "Raynaud phenomenon"],
      fr: ["phénomène de Raynaud", "doigts blancs bleus froid", "Raynaud"],
      he: ["ריינו", "אצבעות לבנות כחולות בקור", "תופעת ריינו"],
      ru: ["болезнь Рейно", "пальцы белые синие на холоде", "синдром Рейно"],
    },
    titles: { en: "Raynaud's phenomenon", fr: "Phénomène de Raynaud", he: "תופעת ריינו", ru: "Синдром Рейно" },
    guidance: g(
      { summary: "Raynaud's causes fingers/toes to turn white then blue then red with cold or stress, often with numbness. NHS: keep warm, stop smoking; GP review if severe or with ulcers. Emergency: persistent colour change with severe pain, skin breakdown, or signs of critical limb ischaemia. Never invent vasodilator doses.", emergencyIf: ["Finger/toe stays white/blue with severe pain", "Skin ulceration or tissue damage on digits", "Sudden cold pale painful limb"], seeDoctorIf: ["Frequent attacks affecting daily life", "Raynaud with joint pain/rash (possible connective-tissue disease)"], doNot: ["Do not invent calcium-channel blocker doses", "Do not ignore non-healing digital ulcers"] },
      { summary: "Raynaud: doigts blancs/bleus au froid. Urgences si ischémie persistante ou ulcère. Pas de posologies inventées.", emergencyIf: ["Doigt restant blanc/bleu très douloureux", "Ulcération digitale", "Membre froid pâle douloureux"], seeDoctorIf: ["Crises fréquentes"], doNot: ["Pas de posologies inventées"] },
      { summary: "ריינו: אצבעות לבנות/כחולות בקור. חירום באיסכמיה מתמשכת או כיב. אין מינונים מומצאים.", emergencyIf: ["אצבע נשארת לבנה/כחולה עם כאב קשה", "כיב באצבע", "גפה קרה חיוורת כואבת"], seeDoctorIf: ["התקפים תכופים"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Рейно: пальцы белеют/синеют на холоде. Неотложка при стойкой ишемии или язве. Дозы не выдумывать.", emergencyIf: ["Палец остаётся белым/синим с сильной болью", "Язва на пальце", "Холодная бледная болезненная конечность"], seeDoctorIf: ["Частые приступы"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsRaynaud],
  },
  {
    id: "peripheral-arterial-disease",
    category: "vascular",
    urgencyDefault: "consultation",
    priority: 6,
    keywords: {
      en: ["peripheral arterial disease", "PAD claudication", "leg pain walking PAD"],
      fr: ["artériopathie périphérique", "AOMI claudication", "douleur jambe à la marche"],
      he: ["מחלת עורקים היקפית", "PAD צליעה", "כאב רגל בהליכה"],
      ru: ["периферическая артериальная болезнь", "перемежающаяся хромота", "боль в ноге при ходьбе"],
    },
    titles: { en: "Peripheral arterial disease (PAD)", fr: "Artériopathie oblitérante (AOMI)", he: "מחלת עורקים היקפית", ru: "Заболевание периферических артерий" },
    guidance: g(
      { summary: "PAD causes leg pain on walking that eases with rest (claudication). NHS: GP assessment, risk-factor control; never invent antiplatelet doses. Emergency (critical ischaemia): sudden cold pale painful limb, rest pain, non-healing ulcers, or black toes — urgent vascular care.", emergencyIf: ["Sudden cold, pale, painful limb", "Rest pain in foot/toes at night", "Black toes or rapidly worsening ulcers"], seeDoctorIf: ["Leg pain when walking that limits distance", "Known PAD with worsening symptoms"], doNot: ["Do not invent antiplatelet or statin regimens", "Do not ignore a cold painful limb"] },
      { summary: "AOMI: douleur à la marche. Urgence si membre froid/pâle douloureux (ischémie critique). Pas de posologies inventées.", emergencyIf: ["Membre soudainement froid pâle douloureux", "Douleur de repos du pied", "Orteils noirs / ulcères"], seeDoctorIf: ["Claudication limitante"], doNot: ["Pas d'antiagrégants inventés"] },
      { summary: "PAD: כאב בהליכה. חירום בגפה קרה חיוורת כואבת. אין מינונים מומצאים.", emergencyIf: ["גפה קרה חיוורת כואבת פתאום", "כאב במנוחה בכף הרגל", "אצבעות שחורות / כיבים"], seeDoctorIf: ["צליעה מגבילה"], doNot: ["אין נוגדי טסיות מומצאים"] },
      { summary: "ЗПА: боль при ходьбе. Неотложка при холодной бледной болезненной конечности. Дозы не выдумывать.", emergencyIf: ["Внезапно холодная бледная болезненная конечность", "Боль в покое в стопе", "Чёрные пальцы / язвы"], seeDoctorIf: ["Ограничивающая хромота"], doNot: ["Не изобретать антиагреганты"] }
    ),
    sources: [S.nhsPAD],
  },
  {
    id: "lymphoedema",
    category: "vascular",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["lymphoedema", "lymphedema swollen arm leg", "chronic lymph swelling"],
      fr: ["lymphœdème", "bras jambe enflé lymphœdème", "gonflement lymphatique"],
      he: ["לימפאדמה", "נפיחות לימפה ביד רגל", "בצקת לימפטית"],
      ru: ["лимфедема", "отёк руки ноги лимфа", "лимфатический отёк"],
    },
    titles: { en: "Lymphoedema", fr: "Lymphœdème", he: "לימפאדמה", ru: "Лимфедема" },
    guidance: g(
      { summary: "Lymphoedema is long-term swelling from lymph drainage problems. NHS: specialist pathways, skin care, compression as advised — never invent garment prescriptions. Emergency: sudden painful red hot swelling with fever (possible cellulitis), or acute unilateral leg swelling with breathlessness (consider clot — see clot-dvt-pe).", emergencyIf: ["Sudden red hot painful swelling with fever", "Acute one-sided leg swelling with chest pain/breathlessness"], seeDoctorIf: ["Persistent limb swelling", "Skin thickening or recurrent infections"], doNot: ["Do not invent compression class or diuretic doses", "Do not ignore cellulitis signs"] },
      { summary: "Lymphœdème: gonflement chronique. Urgences si cellulite fébrile ou suspicion de thrombose. Pas de posologies inventées.", emergencyIf: ["Gonflement rouge chaud douloureux avec fièvre", "Œdème unilatéral aigu avec dyspnée"], seeDoctorIf: ["Gonflement persistant"], doNot: ["Pas de classes de compression inventées"] },
      { summary: "לימפאדמה: נפיחות כרונית. חירום בתאית עם חום או חשד לקריש. אין מינונים מומצאים.", emergencyIf: ["נפיחות אדומה חמה כואבת עם חום", "בצקת חד-צדדית חדה עם קוצר נשימה"], seeDoctorIf: ["נפיחות מתמשכת"], doNot: ["אין דרגות לחץ מומצאות"] },
      { summary: "Лимфедема: хронический отёк. Неотложка при целлюлите с лихорадкой или подозрении на тромб. Дозы не выдумывать.", emergencyIf: ["Красный горячий болезненный отёк с лихорадкой", "Острый односторонний отёк с одышкой"], seeDoctorIf: ["Стойкий отёк"], doNot: ["Не изобретать класс компрессии"] }
    ),
    sources: [S.nhsLymphoedema],
  },
  {
    id: "bronchiectasis",
    category: "respiratory",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["bronchiectasis", "chronic cough sputum bronchiectasis", "recurrent chest infections bronchiectasis"],
      fr: ["dilatation des bronches", "bronchiectasies toux chroniques", "infections respiratoires à répétition"],
      he: ["ברונכיאקטזיות", "שיעול כרוני ליחה", "דלקות ריאה חוזרות"],
      ru: ["бронхоэктазы", "хронический кашель мокрота", "повторные инфекции лёгких"],
    },
    titles: { en: "Bronchiectasis", fr: "Bronchiectasies", he: "ברונכיאקטזיות", ru: "Бронхоэктазы" },
    guidance: g(
      { summary: "Bronchiectasis causes chronic cough with sputum and recurrent chest infections. NHS: airway clearance and specialist review; antibiotics are clinician-prescribed — never invent doses. Emergency: severe breathlessness, coughing blood in large amounts, high fever with confusion, or chest pain with collapse.", emergencyIf: ["Severe breathlessness at rest", "Large-volume coughing of blood", "High fever with confusion", "Chest pain with collapse"], seeDoctorIf: ["Chronic productive cough", "Repeated chest infections"], doNot: ["Do not invent antibiotic regimens", "Do not ignore coughing blood"] },
      { summary: "Bronchiectasies: toux productive chronique. Urgences si dyspnée sévère, hémoptysie abondante, fièvre avec confusion. Pas d'antibiotiques inventés.", emergencyIf: ["Dyspnée sévère", "Hémoptysie abondante", "Forte fièvre avec confusion"], seeDoctorIf: ["Toux productive chronique"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "ברונכיאקטזיות: שיעול עם ליחה. חירום בקוצר נשימה קשה, שיעול דם רב, חום עם בלבול. אין אנטיביוטיקה מומצאת.", emergencyIf: ["קוצר נשימה קשה", "שיעול דם בכמות גדולה", "חום גבוה עם בלבול"], seeDoctorIf: ["שיעול פרודוקטיבי כרוני"], doNot: ["אין משטרי אנטיביוטיקה מומצאים"] },
      { summary: "Бронхоэктазы: хронический продуктивный кашель. Неотложка при тяжёлой одышке, обильном кровохарканье. Антибиотики не выдумывать.", emergencyIf: ["Тяжёлая одышка", "Обильное кровохарканье", "Высокая лихорадка со спутанностью"], seeDoctorIf: ["Хронический продуктивный кашель"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsBronchiectasis],
  },
  {
    id: "sarcoidosis",
    category: "respiratory",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["sarcoidosis", "sarcoid lungs lymph nodes", "Lofgren sarcoidosis"],
      fr: ["sarcoïdose", "sarcoïde poumons ganglions", "Löfgren sarcoïdose"],
      he: ["סרקואידוזיס", "סרקואיד ריאות בלוטות", "סרקואידוזיס"],
      ru: ["саркоидоз", "саркоид лёгкие лимфоузлы", "Лёфгрен саркоидоз"],
    },
    titles: { en: "Sarcoidosis — orientation", fr: "Sarcoïdose — orientation", he: "סרקואידוזיס — התמצאות", ru: "Саркоидоз — ориентир" },
    guidance: g(
      { summary: "Sarcoidosis can affect lungs, lymph nodes, skin and eyes. NHS: specialist diagnosis; many cases settle, some need treatment — never invent steroid doses. Emergency: sudden severe breathlessness, chest pain, new vision loss, or neurological deficits.", emergencyIf: ["Sudden severe breathlessness or chest pain", "Sudden vision loss", "New weakness, seizures, or severe headache with sarcoid history"], seeDoctorIf: ["Persistent cough with fatigue/weight loss", "Unexplained lumps or eye symptoms"], doNot: ["Do not invent corticosteroid regimens"] },
      { summary: "Sarcoïdose: poumons, ganglions, yeux. Urgences si dyspnée brutale, baisse visuelle, signes neuro. Pas de posologies inventées.", emergencyIf: ["Dyspnée / douleur thoracique brutale", "Baisse visuelle soudaine", "Signes neurologiques nouveaux"], seeDoctorIf: ["Toux persistante avec fatigue"], doNot: ["Pas de corticoïdes inventés"] },
      { summary: "סרקואידוזיס: ריאות, בלוטות, עיניים. חירום בקוצר נשימה פתאומי, ירידת ראייה, סימנים נוירולוגיים. אין מינונים מומצאים.", emergencyIf: ["קוצר נשימה / כאב חזה פתאומי", "ירידת ראייה פתאומית", "חולשה/פרכוס חדשים"], seeDoctorIf: ["שיעול מתמשך עם עייפות"], doNot: ["אין מינוני סטרואידים מומצאים"] },
      { summary: "Саркоидоз: лёгкие, лимфоузлы, глаза. Неотложка при внезапной одышке, потере зрения, неврологических симптомах. Дозы не выдумывать.", emergencyIf: ["Внезапная одышка / боль в груди", "Внезапная потеря зрения", "Новые неврологические симптомы"], seeDoctorIf: ["Стойкий кашель с усталостью"], doNot: ["Не изобретать дозы стероидов"] }
    ),
    sources: [S.nhsSarcoid],
  },
  {
    id: "myasthenia-gravis",
    category: "neuro",
    urgencyDefault: "consultation",
    priority: 7,
    keywords: {
      en: ["myasthenia gravis", "drooping eyelid myasthenia", "muscle weakness fatigable myasthenia"],
      fr: ["myasthénie", "paupière tombante myasthénie", "faiblesse fatigable myasthénie"],
      he: ["מיאסטניה גרביס", "צניחת עפעף מיאסטניה", "חולשת שרירים מיאסטניה"],
      ru: ["миастения гравис", "опущение века миастения", "утомляемая слабость миастения"],
    },
    titles: { en: "Myasthenia gravis", fr: "Myasthénie", he: "מיאסטניה גרביס", ru: "Миастения гравис" },
    guidance: g(
      { summary: "Myasthenia causes fatigable weakness (eyes, face, limbs, breathing). NHS: specialist pathways; crisis with breathing/swallowing failure is an emergency. Never invent anticholinesterase or steroid doses.", emergencyIf: ["Difficulty breathing or speaking", "Cannot swallow saliva / choking on fluids", "Rapidly worsening weakness"], seeDoctorIf: ["Drooping eyelid or double vision that worsens with use", "Fatigable limb weakness"], doNot: ["Do not invent pyridostigmine or steroid doses", "Do not delay care for breathing/swallowing trouble"] },
      { summary: "Myasthénie: faiblesse fatigable. Urgence si dyspnée ou fausses routes. Pas de posologies inventées.", emergencyIf: ["Difficulté à respirer ou parler", "Impossible d'avaler la salive", "Faiblesse rapidement progressive"], seeDoctorIf: ["Ptosis / vision double fatigable"], doNot: ["Pas de posologies inventées"] },
      { summary: "מיאסטניה: חולשה מתעייפת. חירום בקושי נשימה/בליעה. אין מינונים מומצאים.", emergencyIf: ["קושי לנשום או לדבר", "לא בולע רוק", "חולשה מחמירה במהירות"], seeDoctorIf: ["צניחת עפעף / כפל ראייה"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Миастения: утомляемая слабость. Неотложка при дыхании/глотании. Дозы не выдумывать.", emergencyIf: ["Трудность дышать или говорить", "Не может глотать слюну", "Быстро нарастающая слабость"], seeDoctorIf: ["Птоз / двоение"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsMG],
  },
  {
    id: "dementia-orientation",
    category: "neuro",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["dementia", "Alzheimer memory loss dementia", "cognitive decline dementia"],
      fr: ["démence", "Alzheimer perte mémoire", "déclin cognitif démence"],
      he: ["דמנציה", "אלצהיימר אובדן זיכרון", "ירידה קוגניטיבית"],
      ru: ["деменция", "болезнь Альцгеймера память", "когнитивное снижение"],
    },
    titles: { en: "Dementia — orientation", fr: "Démence — orientation", he: "דמנציה — התמצאות", ru: "Деменция — ориентир" },
    guidance: g(
      { summary: "Dementia involves progressive memory and thinking changes. NHS: GP assessment and memory-clinic pathways; medicines are specialist-led — never invent doses. Emergency: sudden confusion (delirium), stroke symptoms, head injury after a fall, or inability to swallow with choking. Distinct from delirium-sudden-confusion entry.", emergencyIf: ["Sudden confusion with fever or new illness", "Stroke symptoms (FAST)", "Head injury after fall", "Choking / cannot swallow safely"], seeDoctorIf: ["Progressive memory loss affecting daily life", "Getting lost or personality change"], doNot: ["Do not invent cholinesterase-inhibitor doses", "Do not dismiss sudden confusion as 'just dementia'"] },
      { summary: "Démence: troubles progressifs. Urgences si confusion brutale (délirium), signes d'AVC, chute avec traumatisme. Pas de posologies inventées.", emergencyIf: ["Confusion brutale", "Signes d'AVC", "Traumatisme crânien après chute"], seeDoctorIf: ["Perte de mémoire progressive"], doNot: ["Pas de posologies inventées"] },
      { summary: "דמנציה: ירידה הדרגתית. חירום בבלבול פתאומי, סימני שבץ, חבלת ראש אחרי נפילה. אין מינונים מומצאים.", emergencyIf: ["בלבול פתאומי", "סימני שבץ", "חבלת ראש אחרי נפילה"], seeDoctorIf: ["אובדן זיכרון מתקדם"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Деменция: прогрессирующие нарушения. Неотложка при внезапной спутанности, инсульте, ЧМТ после падения. Дозы не выдумывать.", emergencyIf: ["Внезапная спутанность", "Признаки инсульта", "ЧМТ после падения"], seeDoctorIf: ["Прогрессирующая потеря памяти"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsDementia],
  },
  {
    id: "bipolar-disorder",
    category: "mental-health",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["bipolar disorder", "manic episode bipolar", "bipolar mood swings"],
      fr: ["trouble bipolaire", "épisode maniaque bipolaire", "sauts d'humeur bipolaire"],
      he: ["הפרעה דו-קוטבית", "מאניה ביפולרית", "תנודות מצב רוח ביפולרי"],
      ru: ["биполярное расстройство", "маниакальный эпизод", "биполярные перепады настроения"],
    },
    titles: { en: "Bipolar disorder — orientation", fr: "Trouble bipolaire — orientation", he: "הפרעה דו-קוטבית — התמצאות", ru: "Биполярное расстройство — ориентир" },
    guidance: g(
      { summary: "Bipolar involves episodes of mania/hypomania and depression. NHS: specialist mental-health pathways; mood stabilisers are clinician-prescribed — never invent doses. Emergency: suicidal plans, psychosis with danger, or mania with no sleep and risky behaviour — crisis services / emergency care. See mental-health-crisis entry.", emergencyIf: ["Suicidal plans or intent", "Psychosis with risk of harm", "Mania with extreme risk-taking or no sleep for days with collapse risk"], seeDoctorIf: ["Mood swings disrupting life", "Known bipolar with emerging episode"], doNot: ["Do not invent lithium/antipsychotic doses", "Do not leave someone alone in acute crisis"] },
      { summary: "Bipolaire: manie/dépression. Urgences si idées suicidaires, psychose à risque, manie dangereuse. Pas de posologies inventées.", emergencyIf: ["Idées suicidaires avec plan", "Psychose avec danger", "Manie à haut risque"], seeDoctorIf: ["Oscillations d'humeur invalidantes"], doNot: ["Pas de posologies inventées"] },
      { summary: "דו-קוטבי: מאניה/דיכאון. חירום במחשבות אובדניות, פסיכוזה מסוכנת, מאניה מסוכנת. אין מינונים מומצאים.", emergencyIf: ["תוכניות אובדניות", "פסיכוזה עם סיכון", "מאניה מסוכנת"], seeDoctorIf: ["תנודות מצב רוח פוגעות בחיים"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Биполярное: мания/депрессия. Неотложка при суицидальных планах, опасном психозе, рискованной мании. Дозы не выдумывать.", emergencyIf: ["Суицидальные планы", "Психоз с опасностью", "Опасная мания"], seeDoctorIf: ["Перепады настроения, мешающие жизни"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsBipolar],
  },
  {
    id: "ocd",
    category: "mental-health",
    urgencyDefault: "consultation",
    priority: 4,
    keywords: {
      en: ["OCD", "obsessive compulsive disorder", "intrusive thoughts compulsions"],
      fr: ["TOC", "trouble obsessionnel compulsif", "pensées intrusives compulsions"],
      he: ["הפרעה טורדנית כפייתית", "OCD", "מחשבות חודרניות כפייתיות"],
      ru: ["ОКР", "обсессивно-компульсивное расстройство", "навязчивые мысли ритуалы"],
    },
    titles: { en: "OCD — orientation", fr: "TOC — orientation", he: "OCD — התמצאות", ru: "ОКР — ориентир" },
    guidance: g(
      { summary: "OCD involves unwanted intrusive thoughts and repetitive rituals. NHS: talking therapies (e.g. CBT/ERP) and sometimes medicines — never invent SSRI doses. Emergency: suicidal crisis or inability to function with severe self-neglect — crisis pathways.", emergencyIf: ["Suicidal thoughts/plans", "Severe self-neglect with medical risk"], seeDoctorIf: ["Rituals or intrusive thoughts consuming hours daily", "Avoidance disrupting work/relationships"], doNot: ["Do not invent SSRI or antipsychotic doses", "Do not force rituals as advice"] },
      { summary: "TOC: pensées/compulsions. Thérapies; pas de posologies inventées. Urgences si crise suicidaire.", emergencyIf: ["Idées suicidaires", "Négligence grave avec risque médical"], seeDoctorIf: ["Rituels envahissants"], doNot: ["Pas de posologies inventées"] },
      { summary: "OCD: מחשבות/טקסים. טיפולים; אין מינונים מומצאים. חירום במשבר אובדני.", emergencyIf: ["מחשבות אובדניות", "הזנחה עצמית חמורה"], seeDoctorIf: ["טקסים שגוזלים שעות"], doNot: ["אין מינונים מומצאים"] },
      { summary: "ОКР: мысли/ритуалы. Терапии; дозы не выдумывать. Неотложка при суицидальном кризисе.", emergencyIf: ["Суицидальные мысли", "Тяжёлая самозапущенность"], seeDoctorIf: ["Ритуалы на часы в день"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsOCD],
  },
  {
    id: "ptsd",
    category: "mental-health",
    urgencyDefault: "consultation",
    priority: 5,
    keywords: {
      en: ["PTSD", "post traumatic stress", "flashbacks trauma nightmares"],
      fr: ["TSPT", "stress post-traumatique", "flashbacks cauchemars traumatisme"],
      he: ["פוסט טראומה", "PTSD", "פלאשבקים סיוטים טראומה"],
      ru: ["ПТСР", "посттравматическое стрессовое", "флэшбеки кошмары травма"],
    },
    titles: { en: "PTSD — orientation", fr: "TSPT — orientation", he: "פוסט-טראומה — התמצאות", ru: "ПТСР — ориентир" },
    guidance: g(
      { summary: "PTSD can follow trauma with flashbacks, nightmares, hyperarousal and avoidance. NHS: trauma-focused therapies; medicines only if clinician-prescribed — never invent doses. Emergency: suicidal crisis, harm to others, or acute dissociation with inability to stay safe.", emergencyIf: ["Suicidal plans", "Immediate risk of harm to self/others", "Unable to stay safe during acute flashbacks"], seeDoctorIf: ["Symptoms lasting weeks after trauma", "Avoidance and nightmares disrupting life"], doNot: ["Do not invent benzodiazepine or antidepressant regimens", "Do not force detailed trauma retelling in casual chat"] },
      { summary: "TSPT: flashbacks, cauchemars. Thérapies; pas de posologies inventées. Urgences si crise suicidaire.", emergencyIf: ["Idées suicidaires avec plan", "Risque immédiat de danger"], seeDoctorIf: ["Symptômes prolongés après traumatisme"], doNot: ["Pas de posologies inventées"] },
      { summary: "PTSD: פלאשבקים, סיוטים. טיפולים; אין מינונים מומצאים. חירום במשבר אובדני.", emergencyIf: ["תוכניות אובדניות", "סיכון מיידי לפגיעה"], seeDoctorIf: ["תסמינים ממושכים אחרי טראומה"], doNot: ["אין מינונים מומצאים"] },
      { summary: "ПТСР: флэшбеки, кошмары. Терапии; дозы не выдумывать. Неотложка при суицидальном кризисе.", emergencyIf: ["Суицидальные планы", "Непосредственный риск вреда"], seeDoctorIf: ["Симптомы неделями после травмы"], doNot: ["Не изобретать дозы"] }
    ),
    sources: [S.nhsPTSD],
  },
  {
    id: "eating-disorders",
    category: "mental-health",
    urgencyDefault: "consultation",
    priority: 6,
    keywords: {
      en: ["eating disorder", "anorexia bulimia binge eating", "restricting food purging"],
      fr: ["trouble alimentaire", "anorexie boulimie", "restriction alimentaire vomissements"],
      he: ["הפרעת אכילה", "אנורקסיה בולימיה", "הגבלת אוכל טיהור"],
      ru: ["расстройство пищевого поведения", "анорексия булимия", "ограничение еды очищение"],
    },
    titles: { en: "Eating disorders — orientation", fr: "Troubles alimentaires — orientation", he: "הפרעות אכילה — התמצאות", ru: "Расстройства пищевого поведения — ориентир" },
    guidance: g(
      { summary: "Eating disorders are serious mental and physical health conditions. NHS: early help improves outcomes; specialist pathways exist. Emergency: fainting, chest pain, severe weakness, suicidal crisis, or inability to keep fluids down — urgent medical care. Never invent refeeding or laxative regimens.", emergencyIf: ["Fainting, chest pain, severe weakness", "Cannot keep fluids down", "Suicidal plans", "Very rapid weight loss with medical instability signs"], seeDoctorIf: ["Restricting, bingeing or purging affecting health", "Distress about weight/shape dominating life"], doNot: ["Do not invent calorie/refeeding plans or laxative advice", "Do not praise extreme restriction"] },
      { summary: "Troubles alimentaires: graves. Urgences si malaise, douleur thoracique, impossibilité de boire, crise suicidaire. Pas de régimes inventés.", emergencyIf: ["Malaise, douleur thoracique, faiblesse sévère", "Impossible de garder les liquides", "Idées suicidaires"], seeDoctorIf: ["Restriction / crises / purges"], doNot: ["Pas de plans de renutrition inventés"] },
      { summary: "הפרעות אכילה: מסוכנות. חירום בהתעלפות, כאב חזה, אי יכולת לשתות, משבר אובדני. אין תוכניות הזנה מומצאות.", emergencyIf: ["התעלפות, כאב חזה, חולשה קשה", "לא מחזיק נוזלים", "תוכניות אובדניות"], seeDoctorIf: ["הגבלה / זלילה / טיהור"], doNot: ["אין תוכניות קלוריות מומצאות"] },
      { summary: "РПП: серьёзны. Неотложка при обмороке, боли в груди, невозможности пить, суицидальном кризисе. Схемы не выдумывать.", emergencyIf: ["Обморок, боль в груди, тяжёлая слабость", "Не удерживает жидкости", "Суицидальные планы"], seeDoctorIf: ["Ограничение / срывы / очищение"], doNot: ["Не изобретать планы питания"] }
    ),
    sources: [S.nhsED],
  },
  {
    id: "trigger-finger",
    category: "msk",
    urgencyDefault: "consultation",
    priority: 2,
    keywords: {
      en: ["trigger finger", "finger clicks locks", "stenosing tenosynovitis finger"],
      fr: ["doigt à ressaut", "doigt qui se bloque", "ténosynovite sténosante"],
      he: ["אצבע הדק", "אצבע ננעלת נקישה", "טנוסינוביטיס באצבע"],
      ru: ["щёлкающий палец", "палец защёлкивается", "стенозирующий тендовагинит"],
    },
    titles: { en: "Trigger finger", fr: "Doigt à ressaut", he: "אצבע הדק", ru: "«Щёлкающий» палец" },
    guidance: g(
      { summary: "Trigger finger causes clicking, catching or locking of a finger. NHS: rest, splints, and clinician-led injections/surgery if needed — never invent steroid doses. Emergency: rapidly spreading hand infection, fever with red streaking, or trauma with deformity.", emergencyIf: ["Spreading redness with fever after injection/injury", "Hand trauma with deformity or numbness"], seeDoctorIf: ["Finger locking that interferes with grip", "Painful nodule at the base of a finger"], doNot: ["Do not invent steroid injection doses"] },
      { summary: "Doigt à ressaut: blocage/clic. Urgences si infection diffuse ou traumatisme. Pas de posologies inventées.", emergencyIf: ["Rougeur extensive avec fièvre", "Traumatisme avec déformation"], seeDoctorIf: ["Doigt qui se bloque"], doNot: ["Pas d'injections inventées"] },
      { summary: "אצבע הדק: נעילה/נקישה. חירום בזיהום מתפשט או חבלה. אין מינונים מומצאים.", emergencyIf: ["אדמומיות מתפשטת עם חום", "חבלה עם עיוות"], seeDoctorIf: ["אצבע ננעלת"], doNot: ["אין הזרקות מומצאות"] },
      { summary: "Щёлкающий палец: блокировка/щелчок. Неотложка при инфекции или травме. Дозы не выдумывать.", emergencyIf: ["Распространяющееся покраснение с лихорадкой", "Травма с деформацией"], seeDoctorIf: ["Палец блокируется"], doNot: ["Не изобретать инъекции"] }
    ),
    sources: [S.nhsTrigger],
  },
  {
    id: "dupuytrens-contracture",
    category: "msk",
    urgencyDefault: "consultation",
    priority: 2,
    keywords: {
      en: ["Dupuytren contracture", "Dupuytren fingers bent", "palmar fascia cords"],
      fr: ["maladie de Dupuytren", "Dupuytren doigts fléchis", "brides palmaires"],
      he: ["דופויטרן", "כיווץ דופויטרן באצבעות", "מיתרים בכף היד"],
      ru: ["контрактура Дюпюитрена", "Дюпюитрен пальцы согнуты", "тяжи ладони"],
    },
    titles: { en: "Dupuytren's contracture", fr: "Maladie de Dupuytren", he: "קונטרקטורת דופויטרן", ru: "Контрактура Дюпюитрена" },
    guidance: g(
      { summary: "Dupuytren's causes thickened palm cords that gradually bend fingers. NHS: observation or specialist procedures when function is limited — never invent injection doses. Emergency uncommon; seek care for rapidly painful red hand (infection) or trauma.", emergencyIf: ["Painful red swollen hand with fever", "Hand trauma with loss of sensation"], seeDoctorIf: ["Cannot lay the hand flat on a table", "Progressive finger contracture"], doNot: ["Do not invent collagenase injection regimens"] },
      { summary: "Dupuytren: brides fléchissant les doigts. Rarement urgent; avis si infection ou traumatisme. Pas de posologies inventées.", emergencyIf: ["Main rouge douloureuse fébrile", "Traumatisme avec anesthésie"], seeDoctorIf: ["Impossible de poser la main à plat"], doNot: ["Pas d'injections inventées"] },
      { summary: "דופויטרן: מיתרים שמכופפים אצבעות. חירום נדיר; פנה בזיהום או חבלה. אין מינונים מומצאים.", emergencyIf: ["כף יד אדומה כואבת עם חום", "חבלה עם אובדן תחושה"], seeDoctorIf: ["לא ניתן להשטיח את כף היד"], doNot: ["אין הזרקות מומצאות"] },
      { summary: "Дюпюитрен: тяжи сгибающие пальцы. Неотложка редка; при инфекции или травме. Дозы не выдумывать.", emergencyIf: ["Красная болезненная кисть с лихорадкой", "Травма с потерей чувствительности"], seeDoctorIf: ["Нельзя положить ладонь плоско"], doNot: ["Не изобретать инъекции"] }
    ),
    sources: [S.nhsDupuytren],
  },
  {
    id: "ingrown-toenail",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["ingrown toenail", "nail digging into skin toe", "infected toenail red"],
      fr: ["ongle incarné", "ongle qui rentre dans la peau", "ongle infecté orteil"],
      he: ["ציפורן חודרנית", "ציפורן ננעצת בעור", "זיהום בציפורן הבוהן"],
      ru: ["вросший ноготь", "ноготь врезается в кожу", "инфицированный ноготь пальца"],
    },
    titles: { en: "Ingrown toenail", fr: "Ongle incarné", he: "ציפורן חודרנית", ru: "Вросший ноготь" },
    guidance: g(
      { summary: "Ingrown toenails hurt when the nail edge digs into skin; redness and pus suggest infection. NHS: soak, keep clean, avoid cutting nails too short at corners; GP/podiatry if infected. Emergency: spreading redness, fever, or diabetes/poor circulation with foot infection.", emergencyIf: ["Spreading redness up the foot/leg with fever", "Diabetes or poor circulation with worsening foot infection"], seeDoctorIf: ["Pus, increasing pain, or recurrent ingrown nails"], doNot: ["Do not dig aggressively under the nail", "Do not invent antibiotic doses"] },
      { summary: "Ongle incarné: trempages, hygiène; avis si infection. Urgences si lymphangite fébrile ou pied diabétique infecté.", emergencyIf: ["Rougeur extensive avec fièvre", "Diabète / mauvais flux avec infection du pied"], seeDoctorIf: ["Pus, douleur croissante"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "ציפורן חודרנית: השריה וניקיון; רופא בזיהום. חירום באדמומיות מתפשטת עם חום או סוכרת עם זיהום.", emergencyIf: ["אדמומיות מתפשטת עם חום", "סוכרת / זרימה ירודה עם זיהום בכף הרגל"], seeDoctorIf: ["מוגלה, כאב גובר"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Вросший ноготь: ванночки, гигиена; врач при инфекции. Неотложка при распространяющемся покраснении с лихорадкой или диабетической стопе.", emergencyIf: ["Распространяющееся покраснение с лихорадкой", "Диабет / плохой кровоток с инфекцией стопы"], seeDoctorIf: ["Гной, нарастающая боль"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsIngrown],
  },
  {
    id: "corns-calluses",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 1,
    keywords: {
      en: ["corns and calluses", "hard skin feet corns", "callus on foot"],
      fr: ["cors et callosités", "peau dure pieds cors", "durillon pied"],
      he: ["יבלות וקשיחות", "עור קשה בכף הרגל", "קאלוס ברגל"],
      ru: ["мозоли и натоптыши", "жёсткая кожа на стопах", "натоптыш"],
    },
    titles: { en: "Corns and calluses", fr: "Cors et callosités", he: "יבלות וקשיחות בעור", ru: "Мозоли и натоптыши" },
    guidance: g(
      { summary: "Corns/calluses are thickened skin from pressure/friction. NHS: better-fitting shoes, padding, podiatry — avoid aggressive home cutting if you have diabetes or poor circulation. Emergency: spreading infection, ulcer under a corn, or black/painful ischaemic toe.", emergencyIf: ["Ulcer or spreading infection under a corn", "Black painful toe", "Fever with foot infection"], seeDoctorIf: ["Painful corns limiting walking", "Diabetes with foot skin changes"], doNot: ["Do not cut deep into corns if diabetic/poor circulation", "Do not invent acid treatments as guaranteed cures"] },
      { summary: "Cors/callosités: chaussures adaptées, podologue. Urgences si ulcère/infection ou orteil ischémique.", emergencyIf: ["Ulcère / infection sous un cor", "Orteil noir douloureux", "Fièvre avec infection du pied"], seeDoctorIf: ["Cors douloureux"], doNot: ["Ne pas couper profondément si diabète"] },
      { summary: "יבלות: נעליים מתאימות, פודיאטר. חירום בכיב/זיהום או אצבע איסכמית.", emergencyIf: ["כיב / זיהום תחת יבלת", "אצבע שחורה כואבת", "חום עם זיהום בכף הרגל"], seeDoctorIf: ["יבלות כואבות"], doNot: ["לא לחתוך עמוק אם סוכרת"] },
      { summary: "Мозоли: удобная обувь, подолог. Неотложка при язве/инфекции или ишемическом пальце.", emergencyIf: ["Язва / инфекция под мозолью", "Чёрный болезненный палец", "Лихорадка с инфекцией стопы"], seeDoctorIf: ["Болезненные мозоли"], doNot: ["Не срезать глубоко при диабете"] }
    ),
    sources: [S.nhsCorns],
  },
  {
    id: "vitiligo",
    category: "derm",
    urgencyDefault: "consultation",
    priority: 2,
    keywords: {
      en: ["vitiligo", "white patches skin pigment loss", "depigmentation patches"],
      fr: ["vitiligo", "taches blanches peau", "dépigmentation"],
      he: ["ויטיליגו", "כתמים לבנים בעור", "אובדן פיגמנט"],
      ru: ["витилиго", "белые пятна на коже", "депигментация"],
    },
    titles: { en: "Vitiligo", fr: "Vitiligo", he: "ויטיליגו", ru: "Витилиго" },
    guidance: g(
      { summary: "Vitiligo causes white patches from pigment loss. NHS: sun protection, camouflage, and dermatology options — never invent steroid/phototherapy regimens. Urgent review for sudden widespread blistering, severe burns on depigmented skin, or rapidly progressive painful rash (other diagnoses).", emergencyIf: ["Severe sunburn/blistering on exposed white patches", "Rapidly progressive painful blistering rash"], seeDoctorIf: ["New white patches", "Distress about appearance / treatment options"], doNot: ["Do not invent topical steroid or phototherapy schedules"] },
      { summary: "Vitiligo: taches blanches. Protection solaire; pas de posologies inventées. Urgences si brûlures sévères ou éruption bulleuse.", emergencyIf: ["Brûlures sévères sur zones dépigmentées", "Éruption bulleuse douloureuse rapide"], seeDoctorIf: ["Nouvelles taches blanches"], doNot: ["Pas de schémas de corticoïdes inventés"] },
      { summary: "ויטיליגו: כתמים לבנים. הגנה מהשמש; אין מינונים מומצאים. חירום בכוויות קשות או פריחה שלפוחיתית.", emergencyIf: ["כוויות קשות באזורים בהירים", "פריחה שלפוחיתית כואבת מהירה"], seeDoctorIf: ["כתמים לבנים חדשים"], doNot: ["אין משטרי סטרואידים מומצאים"] },
      { summary: "Витилиго: белые пятна. Защита от солнца; дозы не выдумывать. Неотложка при сильных ожогах или пузырьковой сыпи.", emergencyIf: ["Сильные ожоги на депигментированных участках", "Быстрая болезненная пузырьковая сыпь"], seeDoctorIf: ["Новые белые пятна"], doNot: ["Не изобретать схемы стероидов"] }
    ),
    sources: [S.nhsVitiligo],
  },
  {
    id: "osteoarthritis",
    category: "msk",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["osteoarthritis", "OA joint wear pain", "wear and tear arthritis"],
      fr: ["arthrose", "usure articulaire arthrose", "douleur articulaire arthrose"],
      he: ["אוסטיאוארתריטיס", "שחיקת מפרקים", "דלקת מפרקים ניוונית"],
      ru: ["остеоартрит", "артроз износ суставов", "боль в суставе артроз"],
    },
    titles: { en: "Osteoarthritis", fr: "Arthrose", he: "אוסטיאוארתריטיס", ru: "Остеоартрит / артроз" },
    guidance: g(
      { summary: "Osteoarthritis causes joint pain and stiffness from cartilage wear. NHS: activity, weight management, physiotherapy, and clinician-advised pain relief — never invent opioid or injection doses. Emergency: hot swollen joint with fever (possible septic arthritis), or sudden inability to bear weight after trauma.", emergencyIf: ["Hot swollen joint with fever", "Sudden inability to walk after injury", "Joint redness with severe systemic illness"], seeDoctorIf: ["Persistent joint pain limiting activity", "Night pain or progressive deformity"], doNot: ["Do not invent opioid or steroid-injection regimens"] },
      { summary: "Arthrose: douleur/raideur. Urgences si articulation chaude fébrile (arthrite septique) ou impotence brutale. Pas de posologies inventées.", emergencyIf: ["Articulation chaude avec fièvre", "Impotence brutale après traumatisme"], seeDoctorIf: ["Douleur articulaire persistante"], doNot: ["Pas d'opioïdes/injections inventés"] },
      { summary: "אוסטיאוארתריטיס: כאב/נוקשות. חירום במפרק חם עם חום או אי יכולת לדרוך אחרי חבלה. אין מינונים מומצאים.", emergencyIf: ["מפרק חם עם חום", "אי יכולת לדרוך אחרי חבלה"], seeDoctorIf: ["כאב מפרקים מתמשך"], doNot: ["אין אופיאטים/הזרקות מומצאים"] },
      { summary: "Артроз: боль/скованность. Неотложка при горячем суставе с лихорадкой или внезапной невозможности наступать. Дозы не выдумывать.", emergencyIf: ["Горячий сустав с лихорадкой", "Внезапная невозможность ходить после травмы"], seeDoctorIf: ["Стойкая боль в суставе"], doNot: ["Не изобретать опиоиды/инъекции"] }
    ),
    sources: [S.nhsOA],
  },
  {
    id: "kidney-infection",
    category: "uro",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["kidney infection", "pyelonephritis", "flank pain fever UTI"],
      fr: ["infection rénale", "pyélonéphrite", "douleur flanc fièvre infection urinaire"],
      he: ["דלקת כליות", "פיאלונפריטיס", "כאב מותן חום דלקת שתן"],
      ru: ["инфекция почек", "пиелонефрит", "боль в боку лихорадка цистит"],
    },
    titles: { en: "Kidney infection (pyelonephritis)", fr: "Infection rénale (pyélonéphrite)", he: "דלקת כליות", ru: "Инфекция почек (пиелонефрит)" },
    guidance: g(
      { summary: "Kidney infection often causes fever, flank/back pain, nausea and urinary symptoms. NHS: needs prompt medical assessment and prescribed antibiotics — never invent doses. Emergency: confusion, very high fever, vomiting preventing pills, pregnancy with fever/flank pain, or low blood pressure signs.", emergencyIf: ["Confusion or very high fever with shaking", "Cannot keep fluids/medicines down", "Pregnant with fever and flank pain", "Signs of sepsis (extreme weakness, mottled skin)"], seeDoctorIf: ["Fever with flank pain or UTI symptoms lasting", "Blood in urine with fever"], doNot: ["Do not invent antibiotic regimens", "Do not delay care for fever with flank pain"] },
      { summary: "Pyélonéphrite: fièvre, douleur de flanc. Avis médical rapide; pas d'antibiotiques inventés. Urgences si sepsis, grossesse fébrile, vomissements.", emergencyIf: ["Confusion / très forte fièvre", "Vomissements empêchant les médicaments", "Grossesse avec fièvre et douleur de flanc", "Signes de sepsis"], seeDoctorIf: ["Fièvre avec douleur de flanc"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "דלקת כליות: חום וכאב מותן. הערכה דחופה; אין אנטיביוטיקה מומצאת. חירום באלח דם, הריון עם חום, הקאות.", emergencyIf: ["בלבול / חום גבוה מאוד", "הקאות שמונעות תרופות", "הריון עם חום וכאב מותן", "סימני אלח דם"], seeDoctorIf: ["חום עם כאב מותן"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Пиелонефрит: лихорадка, боль в боку. Срочная оценка; антибиотики не выдумывать. Неотложка при сепсисе, беременности с лихорадкой, рвоте.", emergencyIf: ["Спутанность / очень высокая лихорадка", "Рвота, мешающая лекарствам", "Беременность с лихорадкой и болью в боку", "Признаки сепсиса"], seeDoctorIf: ["Лихорадка с болью в боку"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsKidneyInf],
  },
  {
    id: "urinary-incontinence",
    category: "uro",
    urgencyDefault: "consultation",
    priority: 3,
    keywords: {
      en: ["urinary incontinence", "leak urine when coughing", "bladder leakage urge"],
      fr: ["incontinence urinaire", "fuites urinaires à la toux", "fuites d'urine urgenturie"],
      he: ["דליפת שתן", "אי שליטה בשתן בשיעול", "דליפה דחופה"],
      ru: ["недержание мочи", "подтекание мочи при кашле", "ургентное недержание"],
    },
    titles: { en: "Urinary incontinence", fr: "Incontinence urinaire", he: "דליפת שתן", ru: "Недержание мочи" },
    guidance: g(
      { summary: "Urinary incontinence (stress or urge) is common and treatable. NHS: pelvic-floor exercises, bladder training, GP/continence pathways — never invent antimuscarinic doses. Emergency: sudden inability to pass urine (retention), or incontinence with new back pain/leg weakness (possible cauda equina — urgent).", emergencyIf: ["Cannot pass urine at all (retention)", "New incontinence with severe back pain and leg weakness/numbness around the saddle area"], seeDoctorIf: ["Leakage affecting quality of life", "Frequent urgency and nocturia"], doNot: ["Do not invent bladder-drug doses", "Do not ignore red-flag neurological signs with incontinence"] },
      { summary: "Incontinence: rééducation, avis. Urgences si rétention ou incontinence avec déficit neuro (queue de cheval). Pas de posologies inventées.", emergencyIf: ["Rétention urinaire complète", "Incontinence avec lombalgie sévère et déficit des jambes / anesthésie en selle"], seeDoctorIf: ["Fuites gênantes"], doNot: ["Pas de médicaments vésicaux inventés"] },
      { summary: "דליפת שתן: תרגילים, ייעוץ. חירום באצירה או דליפה עם חולשת רגליים/כאבי גב (זנב סוס). אין מינונים מומצאים.", emergencyIf: ["אצירת שתן מלאה", "דליפה עם כאב גב קשה וחולשת רגליים / חוסר תחושה באזור האוכף"], seeDoctorIf: ["דליפה שפוגעת באיכות החיים"], doNot: ["אין תרופות שלפוחית מומצאות"] },
      { summary: "Недержание: упражнения, консультация. Неотложка при задержке или недержании с неврологическим дефицитом (конский хвост). Дозы не выдумывать.", emergencyIf: ["Полная задержка мочи", "Недержание с сильной болью в спине и слабостью ног / онемением промежности"], seeDoctorIf: ["Подтекание, мешающее жизни"], doNot: ["Не изобретать лекарства для мочевого пузыря"] }
    ),
    sources: [S.nhsIncontinence],
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

const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const categories = [...new Set(files.map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")).category))].sort();
const meta = JSON.parse(readFileSync(join(root, "data/knowledge/pack.meta.json"), "utf8"));
meta.version = "1.9.0";
meta.entryCount = files.length;
meta.updatedAt = R;
meta.categories = categories;
meta.entryFiles = files.map((f) => `entries/${f}`);
writeFileSync(join(root, "data/knowledge/pack.meta.json"), JSON.stringify(meta, null, 2) + "\n");

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

#!/usr/bin/env node
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsRA: { id: "nhs-rheumatoid-arthritis", name: "NHS — Rheumatoid arthritis", org: "NHS", url: "https://www.nhs.uk/conditions/rheumatoid-arthritis/", retrievedAt: R },
  nhsRASymptoms: { id: "nhs-ra-symptoms", name: "NHS — Rheumatoid arthritis symptoms", org: "NHS", url: "https://www.nhs.uk/conditions/rheumatoid-arthritis/symptoms/", retrievedAt: R },
  nhsHepA: { id: "nhs-hepatitis-a", name: "NHS — Hepatitis A", org: "NHS", url: "https://www.nhs.uk/conditions/hepatitis-a/", retrievedAt: R },
  nhsRabies: { id: "nhs-rabies", name: "NHS — Rabies", org: "NHS", url: "https://www.nhs.uk/conditions/rabies/", retrievedAt: R },
  nhsChlamydia: { id: "nhs-chlamydia", name: "NHS — Chlamydia", org: "NHS", url: "https://www.nhs.uk/conditions/chlamydia/", retrievedAt: R },
  nhsGonorrhoea: { id: "nhs-gonorrhoea", name: "NHS — Gonorrhoea", org: "NHS", url: "https://www.nhs.uk/conditions/gonorrhoea/", retrievedAt: R },
  nhsMigraine: { id: "nhs-migraine", name: "NHS — Migraine", org: "NHS", url: "https://www.nhs.uk/conditions/migraine/", retrievedAt: R },
  nhsCluster: { id: "nhs-cluster-headaches", name: "NHS — Cluster headaches", org: "NHS", url: "https://www.nhs.uk/conditions/cluster-headaches/", retrievedAt: R },
  nhsAnaphylaxis: { id: "nhs-anaphylaxis", name: "NHS — Anaphylaxis", org: "NHS", url: "https://www.nhs.uk/conditions/anaphylaxis/", retrievedAt: R },
  nhsTemporal: { id: "nhs-temporal-arteritis", name: "NHS — Temporal arteritis", org: "NHS", url: "https://www.nhs.uk/conditions/temporal-arteritis/", retrievedAt: R },
  nhsDivertic: { id: "nhs-diverticulitis", name: "NHS — Diverticular disease and diverticulitis", org: "NHS", url: "https://www.nhs.uk/conditions/diverticular-disease-and-diverticulitis/", retrievedAt: R },
  nhsHeartburn: { id: "nhs-heartburn-reflux", name: "NHS — Heartburn and acid reflux", org: "NHS", url: "https://www.nhs.uk/conditions/heartburn-and-acid-reflux/", retrievedAt: R },
  nhsScabies: { id: "nhs-scabies", name: "NHS — Scabies", org: "NHS", url: "https://www.nhs.uk/conditions/scabies/", retrievedAt: R },
  nhsRingworm: { id: "nhs-ringworm", name: "NHS — Ringworm", org: "NHS", url: "https://www.nhs.uk/conditions/ringworm/", retrievedAt: R },
  nhsLyme: { id: "nhs-lyme", name: "NHS — Lyme disease", org: "NHS", url: "https://www.nhs.uk/conditions/lyme-disease/", retrievedAt: R },
  nhsPancreatitis: { id: "nhs-acute-pancreatitis", name: "NHS — Acute pancreatitis", org: "NHS", url: "https://www.nhs.uk/conditions/acute-pancreatitis/", retrievedAt: R },
  nhsFoodPoisoning: { id: "nhs-food-poisoning", name: "NHS — Food poisoning", org: "NHS", url: "https://www.nhs.uk/conditions/food-poisoning/", retrievedAt: R },
  nhsNorovirus: { id: "nhs-norovirus", name: "NHS — Norovirus (vomiting bug)", org: "NHS", url: "https://www.nhs.uk/conditions/norovirus/", retrievedAt: R },
  nhsSunburn: { id: "nhs-sunburn", name: "NHS — Sunburn", org: "NHS", url: "https://www.nhs.uk/conditions/sunburn/", retrievedAt: R },
  nhsConjunctivitis: { id: "nhs-conjunctivitis", name: "NHS — Conjunctivitis", org: "NHS", url: "https://www.nhs.uk/conditions/conjunctivitis/", retrievedAt: R },
  nhsOralThrush: { id: "nhs-oral-thrush", name: "NHS — Oral thrush (mouth)", org: "NHS", url: "https://www.nhs.uk/conditions/oral-thrush-mouth/", retrievedAt: R },
};

const entries = [
  {
    id: "rheumatoid-arthritis",
    category: "rheum",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["rheumatoid arthritis", "RA flare", "morning joint stiffness hands", "symmetric joint swelling"],
      fr: ["polyarthrite rhumatoïde", "poussée de PR", "raideur matinale articulations", "gonflement articulaire symétrique"],
      he: ["דלקת מפרקים שגרונית", "התלקחות RA", "נוקשות בוקר במפרקים", "נפיחות מפרקים דו-צדדית"],
      ru: ["ревматоидный артрит", "обострение РА", "утренняя скованность суставов", "симметричный отёк суставов"],
    },
    titles: { en: "Rheumatoid arthritis (orientation)", fr: "Polyarthrite rhumatoïde (orientation)", he: "דלקת מפרקים שגרונית (הכוונה)", ru: "Ревматоидный артрит (ориентация)" },
    guidance: g(
      { summary: "RA causes joint pain, swelling and stiffness (often hands/feet/wrists), frequently worse in the morning and sometimes symmetrical. Flares worsen symptoms. NHS: see a GP for assessment; long-term DMARDs/steroids are clinician-managed — never invent doses. Chest pain or sudden vision issues with known systemic disease need urgent pathways.", seeDoctorIf: ["Persistent joint pain, swelling or morning stiffness lasting longer than typical osteoarthritis stiffness", "Suspected RA flare", "New chest pain or dry eyes with known RA — clinical review"], doNot: ["Do not invent methotrexate, biologic, or steroid regimens", "Do not stop DMARDs without clinical advice"] },
      { summary: "La PR provoque douleur, gonflement et raideur articulaire (souvent mains/pieds), parfois matinale et symétrique. Traitements de fond = médecin. Pas de doses inventées.", seeDoctorIf: ["Douleur/gonflement/raideur matinale persistants", "Poussée suspectée"], doNot: ["Pas de méthotrexate/biologiques/corticoïdes inventés"] },
      { summary: "RA גורמת לכאב, נפיחות ונוקשות מפרקים (לרוב ידיים/רגליים), לעיתים בבוקר ובאופן סימטרי. טיפולים ארוכי טווח — רופא. אין מינונים מומצאים.", seeDoctorIf: ["כאב/נפיחות/נוקשות בוקר מתמשכים", "חשד להתלקחות"], doNot: ["אין מתוטרקסט/ביולוגיים/סטרואידים מומצאים"] },
      { summary: "РА даёт боль, отёк и скованность суставов (часто кисти/стопы), нередко утром и симметрично. Базисная терапия — у врача. Дозы не выдумывать.", seeDoctorIf: ["Стойкая боль/отёк/утренняя скованность", "Подозрение на обострение"], doNot: ["Не изобретать метотрексат/биопрепараты/стероиды"] }
    ),
    sources: [S.nhsRA, S.nhsRASymptoms],
  },
  {
    id: "hepatitis-a",
    category: "travel",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["hepatitis A", "hep A", "jaundice after travel food", "dark urine pale stools travel"],
      fr: ["hépatite A", "ictère après voyage alimentaire", "urines foncées selles pâles voyage"],
      he: ["הפטיטיס A", "צהבת אחרי נסיעה מזון", "שתן כהה צואה בהירה נסיעה"],
      ru: ["гепатит A", "желтуха после поездки еда", "тёмная моча светлый стул поездка"],
    },
    titles: { en: "Hepatitis A (orientation)", fr: "Hépatite A (orientation)", he: "הפטיטיס A (הכוונה)", ru: "Гепатит A (ориентация)" },
    guidance: g(
      { summary: "Hepatitis A is a liver infection spread via faecal–oral route. Symptoms: fever, flu-like illness, nausea, upper tummy pain, diarrhoea/constipation, pale stools, dark urine, itch, jaundice. NHS: see a GP if recent travel/exposure; urgent advice if pregnant, over 60, or known liver disease. Rest, fluids; infectious ~7 days after jaundice/symptom onset. Vaccination for risk groups is clinic-led — no invented vaccine schedules.", seeDoctorIf: ["You think you might have hepatitis A", "Recent travel to a high-risk country", "Pregnant, >60, or liver condition with suspected hep A — urgent advice"], selfCare: ["Rest; fluids; limit contact while infectious as advised; hand hygiene after toilet"], doNot: ["Do not invent antivirals or vaccine catch-up calendars", "Do not share towels/food prep while infectious"] },
      { summary: "L'hépatite A se transmet féco-orale. Fièvre, nausées, douleur haute, selles pâles, urines foncées, ictère. Avis médical ; urgent si grossesse, >60 ans, maladie du foie. Pas de schémas vaccinaux inventés.", seeDoctorIf: ["Suspicion d'hépatite A", "Voyage récent en zone à risque", "Grossesse / >60 ans / foie — avis urgent"], selfCare: ["Repos ; hydratation ; hygiène des mains"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "הפטיטיס A מועבר צואה-פה. חום, בחילה, כאב בטן עליון, צואה בהירה, שתן כהה, צהבת. ייעוץ; דחוף בהריון/>60/מחלת כבד. אין לוח חיסונים מומצא.", seeDoctorIf: ["חשד להפטיטיס A", "נסיעה לאחרונה לאזור סיכון", "הריון / מעל 60 / כבד — ייעוץ דחוף"], selfCare: ["מנוחה; שתייה; היגיינת ידיים"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Гепатит A — фекально-оральный. Лихорадка, тошнота, боль вверху живота, светлый стул, тёмная моча, желтуха. К врачу; срочно при беременности/>60/болезни печени. Календари вакцин не выдумывать.", seeDoctorIf: ["Подозрение на гепатит A", "Недавняя поездка в зону риска", "Беременность />60 / печень — срочно"], selfCare: ["Покой; жидкость; гигиена рук"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsHepA],
  },
  {
    id: "rabies-exposure",
    category: "travel",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["rabies", "animal bite abroad", "bat scratch", "licked wound animal travel"],
      fr: ["rage", "morsure animale à l'étranger", "griffe de chauve-souris", "lésion léchée animal voyage"],
      he: ["כלבת", "נשיכת בעל חיים בחו\"ל", "שריטת עטלף", "ליקוק פצע על ידי חיה בנסיעה"],
      ru: ["бешенство", "укус животного за границей", "царапина летучей мыши", "животное лизнуло рану в поездке"],
    },
    titles: { en: "Rabies exposure — get help now", fr: "Exposition à la rage — agir immédiatement", he: "חשיפה לכלבת — לפנות מיד", ru: "Контакт с бешенством — немедленно за помощью" },
    guidance: g(
      { summary: "Rabies is almost always fatal once symptoms appear but preventable with prompt post-exposure care. NHS: get medical help immediately after animal bite/scratch abroad, animal licking eyes/nose/mouth/wound abroad, or bat bite/scratch in the UK. Do not wait until return home if abroad. Vaccines/immunoglobulin are clinician-only — no invented schedules. Wash wound with soap and water while seeking care.", emergencyIf: ["Possible rabies exposure (bite/scratch/lick of mucosa or wound by suspect animal)", "Any bat bite/scratch in the UK"], seeDoctorIf: ["Had treatment abroad — GP follow-up on return to check completion"], selfCare: ["Wash the wound thoroughly with soap and water while arranging urgent care"], doNot: ["Do not wait for symptoms", "Do not invent rabies vaccine or immunoglobulin regimens"] },
      { summary: "La rage est presque toujours mortelle une fois les symptômes apparus, mais évitable avec une prise en charge rapide. Soins immédiats après morsure/griffe à l'étranger ou chauve-souris au Royaume-Uni. Pas de schémas inventés.", emergencyIf: ["Exposition possible à la rage", "Morsure/griffe de chauve-souris"], seeDoctorIf: ["Traitement commencé à l'étranger — suivi au retour"], selfCare: ["Laver la plaie au savon en organisant les soins"], doNot: ["Ne pas attendre les symptômes", "Pas de vaccins/immunoglobulines inventés"] },
      { summary: "כלבת כמעט תמיד קטלנית אחרי הופעת תסמינים אך ניתנת למניעה בטיפול מהיר. עזרה מיידית אחרי נשיכה/שריטה בחו\"ל או עטלף. אין לוחות מומצאים.", emergencyIf: ["חשיפה אפשרית לכלבת", "נשיכה/שריטת עטלף"], seeDoctorIf: ["טיפול שהתחיל בחו\"ל — מעקב בחזרה"], selfCare: ["לשטוף את הפצע בסבון תוך ארגון טיפול"], doNot: ["לא לחכות לתסמינים", "אין חיסון/אימונוגלובולין מומצא"] },
      { summary: "Бешенство почти всегда смертельно после симптомов, но предотвратимо быстрым постконтактным лечением. Немедленно после укуса/царапины за границей или летучей мыши. Схемы не выдумывать.", emergencyIf: ["Возможный контакт с бешенством", "Укус/царапина летучей мыши"], seeDoctorIf: ["Лечение начато за границей — контроль по возвращении"], selfCare: ["Промыть рану мылом, организуя помощь"], doNot: ["Не ждать симптомов", "Не изобретать схемы вакцины/иммуноглобулина"] }
    ),
    sources: [S.nhsRabies],
  },
  {
    id: "sti-chlamydia",
    category: "sti",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["chlamydia", "STI discharge burning pee", "partner chlamydia"],
      fr: ["chlamydia", "IST brûlure en urinant", "partenaire chlamydia"],
      he: ["כלמידיה", "זיבה צריבה במתן שתן", "בן זוג כלמידיה"],
      ru: ["хламидиоз", "жжение при мочеиспускании ИППП", "партнёр хламидии"],
    },
    titles: { en: "Chlamydia (STI orientation)", fr: "Chlamydia (orientation IST)", he: "כלמידיה (הכוונה ל־STI)", ru: "Хламидиоз (ориентация по ИППП)" },
    guidance: g(
      { summary: "Chlamydia is a common STI treated with antibiotics. NHS: sexual health clinic or GP if you/partner may have it, unprotected sex, or pregnancy planning with concern. Avoid sex until you and partner finish treatment and tests clear. Untreated infection can lead to PID/infertility/testicular infection. No inventing antibiotic courses.", seeDoctorIf: ["You or a partner think you might have chlamydia", "Unprotected sex with concern", "Pregnant or planning pregnancy with concern"], doNot: ["Do not invent antibiotic regimens", "Do not resume sex until advised clear"] },
      { summary: "La chlamydia est une IST traitée par antibiotiques. Clinique/médecin si suspicion. Pas de rapports jusqu'à fin de traitement et tests négatifs. Pas de posologies inventées.", seeDoctorIf: ["Suspicion chez vous ou un partenaire", "Rapports sans protection", "Grossesse / projet de grossesse"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "כלמידיה היא STI המטופלת באנטיביוטיקה. מרפאה/רופא בחשד. להימנע מיחסי מין עד סיום טיפול ובדיקות שליליות. אין מינון מומצא.", seeDoctorIf: ["חשד אצלך או אצל בן/בת זוג", "יחסי מין ללא קונדום", "הריון / תכנון הריון"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Хламидиоз — ИППП, лечится антибиотиками. В клинику/к врачу при подозрении. Не заниматься сексом до конца лечения и отрицательных тестов. Дозы не выдумывать.", seeDoctorIf: ["Подозрение у вас или партнёра", "Секс без презерватива", "Беременность / планирование"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsChlamydia],
  },
  {
    id: "sti-gonorrhoea",
    category: "sti",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["gonorrhoea", "gonorrhea", "the clap", "STI pus discharge"],
      fr: ["gonorrhée", "blennorragie", "chaude-pisse", "écoulement IST"],
      he: ["זיבה", "גונוריאה", "הפרשה מוגלתית STI"],
      ru: ["гонорея", "триппер", "гнойные выделения ИППП"],
    },
    titles: { en: "Gonorrhoea (STI orientation)", fr: "Gonorrhée (orientation IST)", he: "זיבה (הכוונה ל־STI)", ru: "Гонорея (ориентация по ИППП)" },
    guidance: g(
      { summary: "Gonorrhoea needs antibiotic treatment via sexual health services/GP. NHS urgent advice if suspected gonorrhoea with red/itchy/painful eyes or pus on lashes, fever, joint pain/swelling, or blotchy rash (possible disseminated infection). Avoid sex until treatment and clearance tests done. No invented antibiotic doses.", emergencyIf: [], seeDoctorIf: ["You or a partner think you might have gonorrhoea", "Unprotected sex with concern", "Pregnant with concern"], // urgent below via seeDoctor with note
        doNot: ["Do not invent antibiotic injection/tablet regimens", "Do not resume sex until advised"] },
      { summary: "La gonorrhée nécessite des antibiotiques via filière IST. Avis urgent si yeux rouges/douloureux, fièvre, articulations, éruption. Pas de doses inventées.", seeDoctorIf: ["Suspicion", "Rapports sans protection", "Grossesse avec inquiétude"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "זיבה דורשת אנטיביוטיקה במסגרת בריאות מינית. ייעוץ דחוף אם עיניים אדומות/כואבות, חום, מפרקים, פריחה. אין מינון מומצא.", seeDoctorIf: ["חשד", "יחסי מין ללא קונדום", "הריון עם חשש"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Гонорея требует антибиотиков в ИППП-службе. Срочно при красных/болезненных глазах, лихорадке, суставах, сыпи. Дозы не выдумывать.", seeDoctorIf: ["Подозрение", "Секс без презерватива", "Беременность с беспокойством"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsGonorrhoea],
  },
  {
    id: "migraine",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["migraine", "throbbing headache light sound", "migraine aura zigzag"],
      fr: ["migraine", "céphalée pulsatile lumière bruit", "aura migraine zig zag"],
      he: ["מיגרנה", "כאב ראש פועם רגישות לאור", "אאורה זיגזג במיגרנה"],
      ru: ["мигрень", "пульсирующая головная боль светобоязнь", "аура мигрени зигзаг"],
    },
    titles: { en: "Migraine (vs emergency headache)", fr: "Migraine (vs céphalée d'urgence)", he: "מיגרנה (מול כאב ראש חירומי)", ru: "Мигрень (против неотложной головной боли)" },
    guidance: g(
      { summary: "Migraine attacks: throbbing headache (often one-sided), nausea/vomiting, light/sound sensitivity; aura (zigzags, tingling) should last ≤1 hour. NHS urgent advice if attack >72h, aura >1h, or pregnant/postpartum. Emergency for sudden worst headache, stroke signs, seizure, meningitis features, or recent head injury. Abortive/preventive meds are clinician-prescribed — no invented triptan doses.", emergencyIf: ["Sudden extremely painful headache", "Speech/memory problems, vision loss, drowsiness/confusion, seizure", "Very high temperature with meningitis symptoms", "Weakness on one side", "Recent head injury with headache"], seeDoctorIf: ["Migraine lasting >72 hours", "Aura lasting >1 hour", "Pregnant or just had a baby with migraine", "New or changing migraine pattern"], doNot: ["Do not invent triptan or preventive regimens", "Do not ignore thunderclap headache as 'just migraine'"] },
      { summary: "Migraine : céphalée pulsatile, nausées, photophobie ; aura ≤1 h. Avis urgent si >72 h, aura >1 h, grossesse. Urgence si céphalée brutale maximale, signes d'AVC/méningite. Pas de triptans inventés.", emergencyIf: ["Céphalée brutale extrême", "Troubles de parole/vision, confusion, convulsion", "Fièvre avec signes de méningite", "Faiblesse d'un côté"], seeDoctorIf: ["Crise > 72 h", "Aura > 1 h", "Grossesse / post-partum"], doNot: ["Pas de triptans inventés"] },
      { summary: "מיגרנה: כאב פועם, בחילה, רגישות לאור/רעש; אאורה ≤שעה. ייעוץ דחוף אם מעל 72 שעות, אאורה מעל שעה, הריון. חירום בכאב פתאומי מקסימלי/שבץ/דלקת קרום המוח. אין טריפטנים מומצאים.", emergencyIf: ["כאב ראש פתאומי קיצוני", "הפרעת דיבור/ראייה, בלבול, פרכוס", "חום עם סימני דלקת קרום המוח", "חולשה בצד אחד"], seeDoctorIf: ["התקף מעל 72 שעות", "אאורה מעל שעה", "הריון / אחרי לידה"], doNot: ["אין טריפטנים מומצאים"] },
      { summary: "Мигрень: пульсирующая боль, тошнота, светобоязнь; аура ≤1 ч. Срочно если >72 ч, аура >1 ч, беременность. Неотложка при внезапной максимальной боли/инсульте/менингите. Триптаны не выдумывать.", emergencyIf: ["Внезапная крайне сильная головная боль", "Нарушение речи/зрения, спутанность, судороги", "Лихорадка с признаками менингита", "Слабость с одной стороны"], seeDoctorIf: ["Приступ >72 ч", "Аура >1 ч", "Беременность / после родов"], doNot: ["Не изобретать триптаны"] }
    ),
    sources: [S.nhsMigraine],
  },
  {
    id: "cluster-headache",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["cluster headache", "pain around one eye watering", "suicidal headache cluster"],
      fr: ["algie vasculaire de la face", "douleur autour d'un œil larmoyant", "céphalée en grappe"],
      he: ["כאב ראש מקבצי", "כאב סביב עין אחת דומעת", "cluster headache"],
      ru: ["пучковая головная боль", "боль вокруг одного глаза слезящегося", "кластерная головная боль"],
    },
    titles: { en: "Cluster headache cues", fr: "Algie vasculaire de la face", he: "כאב ראש מקבצי", ru: "Пучковая (кластерная) головная боль" },
    guidance: g(
      { summary: "Cluster headaches: sharp/burning pain usually around one eye, 15 min–3 h, often restlessness, red/watering eye, drooping lid, small pupil, nasal symptoms. NHS: emergency for first-time drooping eyelid or unequal pupils. Urgent advice for severe headache with jaw pain on eating, blurred/double vision, sore scalp, or limb numbness/weakness (possible temporal arteritis). Treatments are specialist — no invented oxygen/triptan protocols here.", emergencyIf: ["First-time drooping eyelid", "One pupil smaller than the other for the first time"], seeDoctorIf: ["Severe headache with jaw pain when eating, blurred/double vision, sore scalp, or limb numbness/weakness", "Suspected cluster pattern needing diagnosis"], doNot: ["Do not invent high-flow oxygen or injectable triptan regimens"] },
      { summary: "AVF : douleur autour d'un œil 15 min–3 h, agitation, œil rouge/larmoyant, ptosis, myosis. Urgence si ptosis/myosis inaugural. Avis urgent si signes d'artérite temporale. Pas de protocoles inventés.", emergencyIf: ["Ptosis inaugural", "Pupille plus petite d'un côté pour la première fois"], seeDoctorIf: ["Céphalée sévère avec douleur de mâchoire à la mastication, diplopie, cuir chevelu douloureux"], doNot: ["Pas de protocoles d'oxygène/triptans inventés"] },
      { summary: "כאב מקבצי: כאב חד סביב עין אחת 15 דק'–3 שעות, אי-שקט, עין אדומה/דומעת, צניחת עפעף. חירום בצניחת עפעף/אישון לא שווה בפעם הראשונה. אין פרוטוקולים מומצאים.", emergencyIf: ["צניחת עפעף בפעם הראשונה", "אישון קטן יותר בצד אחד בפעם הראשונה"], seeDoctorIf: ["כאב חזק עם כאב לסת באכילה, ראייה כפולה, קרקפת כואבת"], doNot: ["אין פרוטוקול חמצן/טריפטן מומצא"] },
      { summary: "Кластерная боль: острая боль вокруг одного глаза 15 мин–3 ч, беспокойство, красный/слезящийся глаз, птоз. Неотложка при первом птозе/анизокории. Протоколы не выдумывать.", emergencyIf: ["Птоз впервые", "Зрачок меньше с одной стороны впервые"], seeDoctorIf: ["Сильная боль с болью в челюсти при еде, двоением, болезненной кожей головы"], doNot: ["Не изобретать схемы кислорода/триптанов"] }
    ),
    sources: [S.nhsCluster, S.nhsTemporal],
  },
  {
    id: "temporal-arteritis",
    category: "rheum",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["temporal arteritis", "giant cell arteritis", "temple headache jaw claudication", "scalp tenderness headache"],
      fr: ["artérite temporale", "maladie de Horton", "céphalée tempe claudication masticatoire", "cuir chevelu douloureux"],
      he: ["דלקת עורקים רקתית", "ארטריטיס תאי ענק", "כאב רקתי צליעה בלסת", "רגישות בקרקפת"],
      ru: ["височный артериит", "гигантоклеточный артериит", "боль в виске хромота челюсти", "болезненность кожи головы"],
    },
    titles: { en: "Temporal arteritis (urgent)", fr: "Artérite temporale (urgent)", he: "דלקת עורקים רקתית (דחוף)", ru: "Височный артериит (срочно)" },
    guidance: g(
      { summary: "Temporal (giant cell) arteritis needs urgent treatment to reduce risk of blindness/stroke. NHS: urgent GP/111 if frequent severe headaches, temple/scalp tenderness, jaw pain while eating/talking, or vision problems (double vision/loss). Steroids are started by clinicians — never invent prednisolone doses.", emergencyIf: ["Sudden vision loss with suspected temporal arteritis", "Stroke symptoms with temple headache"], seeDoctorIf: ["You think you might have temporal arteritis — urgent same-day pathway"], doNot: ["Do not invent high-dose steroid regimens", "Do not delay for 'just a headache' if temple pain + jaw claudication + vision change"] },
      { summary: "L'artérite temporale nécessite un traitement urgent (risque de cécité/AVC). Avis urgent si céphalées sévères, tempes douloureuses, douleur de mâchoire, troubles visuels. Pas de prednisolone inventée.", emergencyIf: ["Perte visuelle brutale", "Signes d'AVC avec céphalée temporale"], seeDoctorIf: ["Suspicion d'artérite temporale — filière urgente"], doNot: ["Pas de fortes doses de corticoïdes inventées"] },
      { summary: "דלקת עורקים רקתית דורשת טיפול דחוף (סיכון לעיוורון/שבץ). ייעוץ דחוף בכאבי ראש, רגישות רקתית, כאב לסת, הפרעות ראייה. אין פרדניזולון מומצא.", emergencyIf: ["אובדן ראייה פתאומי", "סימני שבץ עם כאב רקתי"], seeDoctorIf: ["חשד לדלקת עורקים רקתית — מסלול דחוף"], doNot: ["אין מינון סטרואידים גבוה מומצא"] },
      { summary: "Височный артериит требует срочного лечения (риск слепоты/инсульта). Срочно при сильных головных болях, болезненных висках, боли в челюсти, нарушениях зрения. Преднизолон не выдумывать.", emergencyIf: ["Внезапная потеря зрения", "Признаки инсульта с височной болью"], seeDoctorIf: ["Подозрение на височный артериит — срочный путь"], doNot: ["Не изобретать высокие дозы стероидов"] }
    ),
    sources: [S.nhsTemporal],
  },
  {
    id: "anaphylaxis-aftercare",
    category: "allergy",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["adrenaline auto injector", "EpiPen how to use", "after anaphylaxis", "two adrenaline pens"],
      fr: ["stylo d'adrénaline", "EpiPen utilisation", "après anaphylaxie", "deux stylos adrénaline"],
      he: ["מזרק אדרנלין", "אפיפן איך להשתמש", "אחרי אנפילקסיס", "שני מזרקי אדרנלין"],
      ru: ["автоинъектор адреналина", "ЭпиПен как использовать", "после анафилаксии", "два шприца адреналина"],
    },
    titles: { en: "Anaphylaxis action / auto-injector cues", fr: "Conduite anaphylaxie / stylo d'adrénaline", he: "פעולה באנפילקסיס / מזרק אוטומטי", ru: "Действия при анафилаксии / автоинъектор" },
    guidance: g(
      { summary: "Anaphylaxis is a life-threatening allergic reaction. NHS: use adrenaline auto-injector if available, call emergency services, lie down (left side if pregnant; sit up slowly only if needed to breathe), remove insect sting if present, second dose after 5 minutes if no improvement — do not stand/walk even if feeling better. After hospital care you should leave with two injectors and allergy specialist referral. This pack never invents dosing beyond device instructions on the injector.", emergencyIf: ["Sudden lip/mouth/throat/tongue swelling", "Struggling to breathe / wheeze / choking", "Tight throat / cannot swallow", "Blue/grey/pale skin or lips", "Sudden confusion, drowsiness, dizziness, or unresponsive"], selfCare: ["Follow the instructions printed on your prescribed auto-injector", "Carry two devices once prescribed; seek allergy clinic follow-up"], doNot: ["Do not stand or walk during/after a reaction until advised safe", "Do not invent adrenaline doses beyond the device"] },
      { summary: "Anaphylaxie : utiliser le stylo d'adrénaline si disponible, appeler les secours, s'allonger, 2e dose après 5 min si pas d'amélioration. Sortir avec 2 stylos. Pas de doses inventées hors notice du dispositif.", emergencyIf: ["Gonflement lèvres/gorge/langue", "Détresse respiratoire", "Gorge serrée", "Cyanose", "Confusion / syncope"], selfCare: ["Suivre la notice du stylo prescrit ; en avoir deux"], doNot: ["Ne pas se lever/marcher pendant la réaction", "Pas de doses hors dispositif"] },
      { summary: "אנפילקסיס: להשתמש במזרק אדרנלין אם יש, לקרוא לעזרה, לשכב, מנה שנייה אחרי 5 דקות אם אין שיפור. לצאת עם שני מזרקים. אין מינון מעבר להוראות המכשיר.", emergencyIf: ["נפיחות שפתיים/גרון/לשון", "קושי נשימה", "גרון הדוק", "כחלחלות", "בלבול / עילפון"], selfCare: ["לפי הוראות המזרק שנרשם; לשאת שניים"], doNot: ["לא לעמוד/ללכת בזמן התגובה", "אין מינון מעבר למכשיר"] },
      { summary: "Анафилаксия: использовать автоинъектор адреналина если есть, вызвать помощь, лечь, вторая доза через 5 мин если нет улучшения. Выписывают два устройства. Дозы вне инструкции устройства не выдумывать.", emergencyIf: ["Отёк губ/горла/языка", "Затруднённое дыхание", "Сжатие в горле", "Цианоз", "Спутанность / обморок"], selfCare: ["Следовать инструкции назначенного устройства; носить два"], doNot: ["Не вставать/ходить во время реакции", "Не изобретать дозы вне устройства"] }
    ),
    sources: [S.nhsAnaphylaxis],
  },
  {
    id: "diverticulitis",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["diverticulitis", "lower left tummy pain fever", "diverticular disease"],
      fr: ["diverticulite", "douleur bas ventre gauche fièvre", "maladie diverticulaire"],
      he: ["דיברטיקוליטיס", "כאב בטן שמאל תחתון עם חום", "מחלת דיברטיקולים"],
      ru: ["дивертикулит", "боль внизу слева с температурой", "дивертикулярная болезнь"],
    },
    titles: { en: "Diverticulitis cues", fr: "Diverticulite — orientation", he: "דיברטיקוליטיס — הכוונה", ru: "Дивертикулит — ориентиры" },
    guidance: g(
      { summary: "Diverticulitis: severe constant tummy pain (often lower left), fever, bleeding or mucus from the bottom. NHS urgent advice for blood/mucus in stool, worsening pain, fever/shivers, persistent vomiting, diarrhoea >7 days or vomiting >2 days. Emergency for severe pain with vomiting/swollen tummy/inability to pass stool or wind, or heavy rectal bleeding. Antibiotics only if clinician decides — no invented courses.", emergencyIf: ["Severe tummy pain with vomiting, swollen tummy, or cannot poo/fart", "Heavy bleeding from the bottom"], seeDoctorIf: ["Blood or mucus in stool", "Worsening or persistent tummy pain", "High temperature or shivery", "Cannot keep fluids down"], doNot: ["Do not invent antibiotic regimens"] },
      { summary: "Diverticulite : douleur constante (souvent bas-gauche), fièvre, sang/mucus. Avis urgent ; urgence si douleur sévère avec vomissements/abdomen ballonné/occlusion, ou saignement abondant. Pas d'antibiotiques inventés.", emergencyIf: ["Douleur sévère avec vomissements, ballonnement, impossibilité d'émettre gaz/selles", "Saignement abondant"], seeDoctorIf: ["Sang ou mucus", "Douleur qui empire", "Fièvre", "Vomissements persistants"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "דיברטיקוליטיס: כאב מתמשך (לרוב שמאל תחתון), חום, דם/ריר. ייעוץ דחוף; חירום בכאב חזק עם הקאות/נפיחות/חסימה או דימום כבד. אין אנטיביוטיקה מומצאת.", emergencyIf: ["כאב חזק עם הקאות, בטן נפוחה, או אי יכולת להוציא גזים/צואה", "דימום כבד"], seeDoctorIf: ["דם או ריר", "כאב מחמיר", "חום", "הקאות מתמשכות"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Дивертикулит: постоянная боль (часто слева внизу), лихорадка, кровь/слизь. Срочно; неотложка при сильной боли с рвотой/вздутием/непроходимостью или обильном кровотечении. Антибиотики не выдумывать.", emergencyIf: ["Сильная боль с рвотой, вздутием или невозможностью отхождения газов/стула", "Обильное кровотечение"], seeDoctorIf: ["Кровь или слизь", "Усиливающаяся боль", "Лихорадка", "Стойкая рвота"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsDivertic],
  },
  {
    id: "acute-pancreatitis",
    category: "gi",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["pancreatitis", "severe upper abdominal pain to back", "acute pancreatitis"],
      fr: ["pancréatite", "douleur épigastrique sévère vers le dos", "pancréatite aiguë"],
      he: ["דלקת לבלב", "כאב בטן עליון חזק לגב", "פנקריאטיטיס חדה"],
      ru: ["панкреатит", "сильная боль вверху живота в спину", "острый панкреатит"],
    },
    titles: { en: "Acute pancreatitis red flags", fr: "Pancréatite aiguë — alarmes", he: "דלקת לבלב חדה — דגלים", ru: "Острый панкреатит — красные флаги" },
    guidance: g(
      { summary: "Acute pancreatitis often causes sudden severe upper tummy pain that may go through to the back, with nausea/vomiting. NHS: this can be serious — seek urgent/emergency care for severe persistent upper abdominal pain. Causes include gallstones and alcohol. Hospital care is required; no inventing enzyme or opioid regimens.", emergencyIf: ["Sudden severe upper abdominal pain, especially radiating to the back", "Severe pain with persistent vomiting and looking very unwell"], seeDoctorIf: ["Upper abdominal pain that is severe or not settling"], doNot: ["Do not invent painkiller or pancreatic enzyme doses", "Do not drink alcohol with suspected pancreatitis"] },
      { summary: "La pancréatite aiguë provoque souvent une douleur épigastrique brutale irradiant au dos, avec nausées. Soins urgents/urgences. Pas de posologies inventées.", emergencyIf: ["Douleur épigastrique brutale sévère vers le dos", "Douleur sévère avec vomissements et altération de l'état"], seeDoctorIf: ["Douleur haute sévère ou qui ne cède pas"], doNot: ["Pas d'antalgiques/enzymes inventés"] },
      { summary: "דלקת לבלב חדה: כאב בטן עליון פתאומי חזק שלעיתים מקרין לגב, עם בחילות. טיפול דחוף/חירום. אין מינונים מומצאים.", emergencyIf: ["כאב בטן עליון פתאומי חזק במיוחד לגב", "כאב חזק עם הקאות ומראה חולני"], seeDoctorIf: ["כאב בטן עליון חזק שלא חולף"], doNot: ["אין משככי כאב/אנזימים מומצאים"] },
      { summary: "Острый панкреатит: внезапная сильная боль вверху живота, часто в спину, с тошнотой. Срочная/неотложная помощь. Дозы не выдумывать.", emergencyIf: ["Внезапная сильная боль вверху живота, особенно в спину", "Сильная боль с рвотой и тяжёлым состоянием"], seeDoctorIf: ["Сильная боль вверху живота без улучшения"], doNot: ["Не изобретать дозы анальгетиков/ферментов"] }
    ),
    sources: [S.nhsPancreatitis],
  },
  {
    id: "gerd-heartburn",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["heartburn", "acid reflux", "GORD", "GERD burning chest"],
      fr: ["brûlures d'estomac", "reflux acide", "RGO", "pyrosis"],
      he: ["צרבת", "ריפלוקס", "צריבה בחזה מחומצה", "GORD"],
      ru: ["изжога", "кислотный рефлюкс", "ГЭРБ", "жжение за грудиной"],
    },
    titles: { en: "Heartburn / acid reflux", fr: "Brûlures / reflux acide", he: "צרבת / ריפלוקס", ru: "Изжога / рефлюкс" },
    guidance: g(
      { summary: "Heartburn is a burning chest feeling from acid rising. NHS self-care: smaller meals, avoid triggers, do not eat within 3–4h of bed, elevate if helpful; pharmacy antacids. See GP if frequent/persistent — PPIs are prescribed clinically. Chest pain that could be cardiac still needs emergency pathways (do not assume reflux).", emergencyIf: ["Chest pain with heart-attack features (pressure, arm/jaw radiation, severe breathlessness, collapse)"], seeDoctorIf: ["Frequent or persistent heartburn", "Difficulty swallowing, unintentional weight loss, vomiting blood — urgent clinical review"], selfCare: ["Smaller meals; avoid trigger foods; do not eat close to bedtime; ask pharmacist about antacids"], doNot: ["Do not invent long-term PPI regimens", "Do not ignore possible cardiac chest pain"] },
      { summary: "Le pyrosis vient du reflux acide. Mesures hygiéno-diététiques ; pharmacie. Médecin si fréquent. Douleur thoracique cardiaque = urgence. Pas d'IPP inventés au long cours.", emergencyIf: ["Douleur thoracique avec signes d'infarctus"], seeDoctorIf: ["Brûlures fréquentes", "Dysphagie, amaigrissement, hématémèse"], selfCare: ["Repas plus petits ; éviter déclencheurs ; pas de repas juste avant le coucher"], doNot: ["Pas d'IPP au long cours inventés"] },
      { summary: "צרבת מריפלוקס חומצה. ארוחות קטנות, הימנעות מטריגרים; בית מרקחת. רופא אם תכוף. כאב חזה לבבי — חירום. אין PPI מומצא ארוך טווח.", emergencyIf: ["כאב חזה עם סימני התקף לב"], seeDoctorIf: ["צרבת תכופה", "קושי בבליעה, ירידה במשקל, הקאת דם"], selfCare: ["ארוחות קטנות; להימנע מטריגרים; לא לאכול לפני שינה"], doNot: ["אין PPI ארוך טווח מומצא"] },
      { summary: "Изжога от кислотного рефлюкса. Маленькие порции, избегать триггеров; аптека. Врач если часто. Кардиальная боль — неотложка. Длительные ИПП не выдумывать.", emergencyIf: ["Боль в груди с признаками инфаркта"], seeDoctorIf: ["Частая изжога", "Дисфагия, похудение, кровавая рвота"], selfCare: ["Меньшие порции; избегать триггеров; не есть перед сном"], doNot: ["Не изобретать длительные схемы ИПП"] }
    ),
    sources: [S.nhsHeartburn],
  },
  {
    id: "lyme-disease",
    category: "infectious",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["lyme disease", "tick bite bullseye", "erythema migrans"],
      fr: ["maladie de Lyme", "piqûre de tique érythème migrant", "tache en cible tique"],
      he: ["ליים", "עקיצת קרציה עיגול מטרה", "אריתמה מיגרנס"],
      ru: ["болезнь Лайма", "укус клеща мишень", "мигрирующая эритема"],
    },
    titles: { en: "Lyme disease / tick bite rash", fr: "Maladie de Lyme / tique", he: "מחלת ליים / עקיצת קרציה", ru: "Болезнь Лайма / укус клеща" },
    guidance: g(
      { summary: "Lyme disease can follow a tick bite. A spreading circular 'bull's-eye' rash (erythema migrans) and flu-like symptoms need GP/111 assessment. Antibiotics are clinician-prescribed — no invented courses. Remove ticks carefully; seek advice if rash or systemic symptoms develop.", seeDoctorIf: ["Bull's-eye or spreading rash after tick exposure", "Flu-like illness after a tick bite", "Unsure how to remove an attached tick"], selfCare: ["Remove ticks promptly with fine tweezers close to skin; clean the area; monitor for rash"], doNot: ["Do not invent doxycycline or other antibiotic regimens", "Do not squeeze the tick body"] },
      { summary: "La maladie de Lyme peut suivre une piqûre de tique. Érythème migrant / symptômes grippaux = avis médical. Antibiotiques = prescription. Pas de schémas inventés.", seeDoctorIf: ["Érythème migrant après tique", "Syndrome grippal après piqûre"], selfCare: ["Retirer la tique rapidement à la pince fine"], doNot: ["Pas de doxycycline inventée"] },
      { summary: "ליים עלולה להופיע אחרי קרציה. פריחת מטרה מתפשטת ותסמינים דמויי שפעת — ייעוץ. אנטיביוטיקה — מרשם. אין מינון מומצא.", seeDoctorIf: ["פריחת מטרה אחרי קרציה", "מחלה דמוית שפעת אחרי עקיצה"], selfCare: ["להסיר קרציה במהירות עם פינצטה דקה"], doNot: ["אין דוקסיציקלין מומצא"] },
      { summary: "Болезнь Лайма может быть после укуса клеща. Мигрирующая эритема / гриппоподобные симптомы — к врачу. Антибиотики по рецепту. Схемы не выдумывать.", seeDoctorIf: ["Эритема-мишень после клеща", "Гриппоподобное состояние после укуса"], selfCare: ["Удалить клеща тонким пинцетом близко к коже"], doNot: ["Не изобретать доксициклин"] }
    ),
    sources: [S.nhsLyme],
  },
  {
    id: "scabies",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["scabies", "intense itch at night mites", "itchy burrows fingers"],
      fr: ["gale", "démangeaisons nocturnes intensives", "sillons entre les doigts"],
      he: ["גרדת", "גרד חזק בלילה", "מחילות בין האצבעות"],
      ru: ["чесотка", "сильный зуд ночью", "ходы между пальцами"],
    },
    titles: { en: "Scabies", fr: "Gale", he: "גרדת (סקביאס)", ru: "Чесотка" },
    guidance: g(
      { summary: "Scabies causes intense itching (often worse at night) and a raised rash. NHS: pharmacist treatment for most; whole household treated at the same time; repeat after 7 days. Children under 2 and pregnancy/breastfeeding need tailored advice. Crusted scabies (flaky crusts in immunocompromised) needs clinical care. No inventing permethrin regimens beyond pharmacist/GP guidance.", seeDoctorIf: ["Child under 2 with suspected scabies", "Pregnant or breastfeeding", "Crusted/flaky rash or immunocompromised", "Not improving after pharmacy treatment"], selfCare: ["Treat all household members together when advised; wash bedding/clothes as instructed by pharmacist"], doNot: ["Do not invent scabicide doses for infants", "Do not treat only the itchy person if household treatment is advised"] },
      { summary: "La gale démange fort (souvent la nuit). Traitement pharmacien ; tout le foyer en même temps ; rappel à J7. <2 ans / grossesse = avis adapté. Pas de posologies inventées.", seeDoctorIf: ["Enfant < 2 ans", "Grossesse / allaitement", "Gale croûteuse / immunodépression"], selfCare: ["Traiter le foyer ensemble selon conseil"], doNot: ["Pas de doses inventées pour nourrissons"] },
      { summary: "גרדת גורמת לגרד חזק (לרוב בלילה). טיפול ברוקח; כל הבית יחד; חזרה אחרי 7 ימים. מתחת לגיל 2/הריון — ייעוץ מותאם. אין מינון מומצא.", seeDoctorIf: ["ילד מתחת לגיל 2", "הריון / הנקה", "גרדת קרוסטית / דיכוי חיסוני"], selfCare: ["לטפל בכל בני הבית יחד לפי ייעוץ"], doNot: ["אין מינון לתינוקות מומצא"] },
      { summary: "Чесотка даёт сильный зуд (часто ночью). Лечение у фармацевта; весь дом одновременно; повтор через 7 дней. <2 лет/беременность — особый совет. Дозы не выдумывать.", seeDoctorIf: ["Ребёнок <2 лет", "Беременность / кормление", "Корковая чесотка / иммунодефицит"], selfCare: ["Лечить всех в доме вместе по совету"], doNot: ["Не изобретать дозы для младенцев"] }
    ),
    sources: [S.nhsScabies],
  },
  {
    id: "ringworm",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["ringworm", "tinea", "circular scaly rash fungus", "jock itch"],
      fr: ["teigne", "dermatophytie", "plaque circulaire squameuse", "eczéma marginé"],
      he: ["גזזת", "טינאה", "פריחה עגולה קשקשית פטרייה"],
      ru: ["стригущий лишай", "микроспория", "кольцевидная чешуйчатая сыпь"],
    },
    titles: { en: "Ringworm (fungal rash)", fr: "Teigne / dermatophytie", he: "גזזת / פטרת עור", ru: "Стригущий лишай" },
    guidance: g(
      { summary: "Ringworm is a fungal infection (not a worm) causing a scaly, itchy, often ring-shaped rash. NHS: see a pharmacist first for antifungal cream/gel/spray/tablets as appropriate. Use for the full recommended course. GP if scalp involvement, unclear diagnosis, or not improving.", seeDoctorIf: ["Scalp ringworm", "Not improving after pharmacy treatment", "Uncertain diagnosis", "Extensive rash"], selfCare: ["Ask pharmacist which antifungal suits the site; complete the course even if rash fades"], doNot: ["Do not invent oral antifungal doses", "Do not share towels while contagious"] },
      { summary: "La teigne est une mycose (pas un ver). Pharmacien d'abord pour antifongique. Médecin si cuir chevelu, doute, échec. Pas de comprimés inventés.", seeDoctorIf: ["Atteinte du cuir chevelu", "Échec du traitement pharmacie", "Doute"], selfCare: ["Suivre le conseil du pharmacien jusqu'au bout"], doNot: ["Pas d'antifongiques oraux inventés"] },
      { summary: "גזזת היא פטרת (לא תולעת). רוקח תחילה לתכשיר אנטי־פטרייתי. רופא אם קרקפת, ספק, או אין שיפור. אין מינון פומי מומצא.", seeDoctorIf: ["מעורבות קרקפת", "אין שיפור אחרי טיפול בית מרקחת", "ספק"], selfCare: ["לפי ייעוץ הרוקח עד סוף הקורס"], doNot: ["אין אנטי־פטרייתי פומי מומצא"] },
      { summary: "Стригущий лишай — грибок (не червь). Сначала фармацевт за противогрибковым. Врач при поражении кожи головы, сомнении, неэффективности. Пероральные дозы не выдумывать.", seeDoctorIf: ["Поражение кожи головы", "Нет улучшения после аптеки", "Сомнение"], selfCare: ["Следовать совету фармацевта до конца курса"], doNot: ["Не изобретать пероральные противогрибковые"] }
    ),
    sources: [S.nhsRingworm],
  },
  {
    id: "food-poisoning",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 4,
    keywords: {
      en: ["food poisoning", "ate something bad vomiting diarrhoea", "foodborne illness"],
      fr: ["intoxication alimentaire", "vomissements diarrhée après repas", "toxi-infection alimentaire"],
      he: ["הרעלת מזון", "הקאות ושלשול אחרי אוכל", "זיהום ממזון"],
      ru: ["пищевое отравление", "рвота и понос после еды", "пищевая токсикоинфекция"],
    },
    titles: { en: "Food poisoning", fr: "Intoxication alimentaire", he: "הרעלת מזון", ru: "Пищевое отравление" },
    guidance: g(
      { summary: "Food poisoning usually causes vomiting and/or diarrhoea. NHS: rest, fluids in small sips; most improve in a few days. Urgent care for dehydration signs, blood in stool, high fever, severe pain, or vulnerability (infants, elderly, pregnant, immunocompromised). Antibiotics usually not needed — never invent them.", seeDoctorIf: ["Symptoms lasting more than a few days", "Blood in diarrhoea", "High fever", "Signs of dehydration", "Infant, elderly, pregnant, or immunocompromised"], selfCare: ["Small frequent sips of fluid; rest; hand hygiene; avoid preparing food for others while ill"], doNot: ["Do not invent antibiotics", "Do not give anti-diarrhoeals to children without advice"] },
      { summary: "L'intoxication alimentaire provoque vomissements/diarrhée. Repos, hydratation. Avis si déshydratation, sang, fièvre, terrain fragile. Pas d'antibiotiques inventés.", seeDoctorIf: ["Persistance", "Sang", "Forte fièvre", "Déshydratation", "Nourrisson / âgé / grossesse / immunodépression"], selfCare: ["Petites gorgées ; repos ; hygiène des mains"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "הרעלת מזון: הקאות ו/או שלשול. מנוחה, לגימות. ייעוץ בהתייבשות, דם, חום, או אוכלוסיות בסיכון. אין אנטיביוטיקה מומצאת.", seeDoctorIf: ["נמשך מעבר לימים ספורים", "דם", "חום גבוה", "התייבשות", "תינוק / קשיש / הריון / דיכוי חיסוני"], selfCare: ["לגימות קטנות; מנוחה; היגיינת ידיים"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Пищевое отравление: рвота и/или понос. Покой, глотки жидкости. Врач при обезвоживании, крови, лихорадке, группах риска. Антибиотики не выдумывать.", seeDoctorIf: ["Длится дольше нескольких дней", "Кровь", "Высокая лихорадка", "Обезвоживание", "Младенец / пожилой / беременность / иммунодефицит"], selfCare: ["Маленькие глотки; покой; гигиена рук"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsFoodPoisoning],
  },
  {
    id: "norovirus",
    category: "gi",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["norovirus", "vomiting bug", "winter vomiting"],
      fr: ["norovirus", "gastro virus", "virus vomissements hiver"],
      he: ["נורווירוס", "באג הקאות", "וירוס הקאות חורף"],
      ru: ["норовирус", "желудочный вирус", "зимняя рвота"],
    },
    titles: { en: "Norovirus (vomiting bug)", fr: "Norovirus", he: "נורווירוס", ru: "Норовирус" },
    guidance: g(
      { summary: "Norovirus causes sudden vomiting and diarrhoea and spreads easily. NHS: fluids, rest, strict hand hygiene; stay home until 48 hours after symptoms stop. Seek help for dehydration or high-risk groups. No specific antiviral — do not invent treatments.", seeDoctorIf: ["Dehydration signs", "Cannot keep any fluids down", "Infant, elderly, or immunocompromised with severe symptoms"], selfCare: ["Small sips of fluid; wash hands with soap; stay off work/school until 48h after last symptom"], doNot: ["Do not invent antivirals", "Do not visit hospitals/care homes while symptomatic if avoidable"] },
      { summary: "Le norovirus provoque vomissements/diarrhée brutaux et se transmet facilement. Hydratation, hygiène ; rester isolé 48 h après la fin des symptômes. Pas d'antiviral inventé.", seeDoctorIf: ["Signes de déshydratation", "Impossible de boire", "Terrain fragile"], selfCare: ["Petites gorgées ; lavage des mains ; isolement 48 h après guérison"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "נורווירוס גורם להקאות ושלשול פתאומיים ומידבק. נוזלים, היגיינה; בידוד עד 48 שעות אחרי סיום תסמינים. אין אנטי-ויראלי מומצא.", seeDoctorIf: ["סימני התייבשות", "לא מצליח לשתות", "אוכלוסייה בסיכון"], selfCare: ["לגימות; שטיפת ידיים; בידוד 48 שעות אחרי"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Норовирус даёт внезапную рвоту/понос и легко передаётся. Жидкость, гигиена; изоляция 48 ч после симптомов. Противовирусные не выдумывать.", seeDoctorIf: ["Признаки обезвоживания", "Нельзя пить", "Группы риска"], selfCare: ["Маленькие глотки; мытьё рук; изоляция 48 ч после"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsNorovirus],
  },
  {
    id: "sunburn",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["sunburn", "burned in the sun", "red hot skin after sun"],
      fr: ["coup de soleil", "brûlure solaire", "peau rouge chaude après soleil"],
      he: ["כוויות שמש", "נשרף מהשמש", "עור אדום חם אחרי שמש"],
      ru: ["солнечный ожог", "обгорел на солнце", "красная горячая кожа после солнца"],
    },
    titles: { en: "Sunburn", fr: "Coup de soleil", he: "כוויית שמש", ru: "Солнечный ожог" },
    guidance: g(
      { summary: "Sunburn: cool the skin, hydrate, moisturise, stay out of the sun. NHS: seek urgent help for blistering over large areas, severe pain, fever/chills, dizziness, or heat-illness signs (especially in children). Prevention with shade/SPF matters. No inventing steroid cream strengths.", seeDoctorIf: ["Large areas of blistering", "Severe pain", "Fever, chills, dizziness, confusion with sun exposure"], selfCare: ["Cool showers; fluids; emollient; stay indoors/shade; paracetamol/ibuprofen if suitable per label"], doNot: ["Do not pop blisters", "Do not invent potent topical steroids"] },
      { summary: "Coup de soleil : refroidir, hydrater, rester à l'ombre. Avis urgent si cloques étendues, douleur forte, fièvre, malaise. Pas de dermocorticoïdes inventés.", seeDoctorIf: ["Cloques étendues", "Douleur sévère", "Fièvre / vertiges / confusion"], selfCare: ["Douches tièdes ; boire ; émollient ; ombre"], doNot: ["Ne pas percer les cloques"] },
      { summary: "כוויית שמש: לקרר, לשתות, לחות, להישאר בצל. ייעוץ דחוף בשלפוחיות נרחבות, כאב חזק, חום, סחרחורת. אין סטרואידים מקומיים מומצאים.", seeDoctorIf: ["שלפוחיות נרחבות", "כאב חזק", "חום / סחרחורת / בלבול"], selfCare: ["מקלחת פושרת; שתייה; לחות; צל"], doNot: ["לא לפוצץ שלפוחיות"] },
      { summary: "Солнечный ожог: охладить, пить, увлажнять, тень. Срочно при обширных пузырях, сильной боли, лихорадке, головокружении. Топические стероиды не выдумывать.", seeDoctorIf: ["Обширные пузыри", "Сильная боль", "Лихорадка / головокружение / спутанность"], selfCare: ["Прохладный душ; жидкость; эмолент; тень"], doNot: ["Не вскрывать пузыри"] }
    ),
    sources: [S.nhsSunburn],
  },
  {
    id: "conjunctivitis",
    category: "eye",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["conjunctivitis", "pink eye", "sticky eyes discharge"],
      fr: ["conjonctivite", "œil rouge collant", "yeux gluants"],
      he: ["דלקת לחמית", "עין ורודה", "עיניים דביקות הפרשות"],
      ru: ["конъюнктивит", "красный глаз", "слипшиеся глаза выделения"],
    },
    titles: { en: "Conjunctivitis (pink eye)", fr: "Conjonctivite", he: "דלקת לחמית", ru: "Конъюнктивит" },
    guidance: g(
      { summary: "Conjunctivitis causes red, itchy or sticky eyes. NHS: often self-limiting; pharmacy advice; bathe lids with cooled boiled water; avoid contact lenses. See urgent care for severe pain, light sensitivity, vision change, or newborn eye infection. Do not invent antibiotic eye drops.", seeDoctorIf: ["Symptoms not improving", "Severe pain or photophobia", "Vision change", "Newborn with sticky/red eyes", "Contact lens wearer with eye pain"], selfCare: ["Clean lids; do not share towels; wash hands; avoid lenses until better"], doNot: ["Do not invent antibiotic drop regimens", "Do not ignore vision loss (see eye red-flag entry)"] },
      { summary: "La conjonctivite rend l'œil rouge/collant. Souvent bénin ; pharmacien. Avis urgent si douleur sévère, photophobie, baisse de vision, nouveau-né. Pas de collyres antibiotiques inventés.", seeDoctorIf: ["Pas d'amélioration", "Douleur sévère / photophobie", "Baisse de vision", "Nouveau-né"], selfCare: ["Nettoyer les paupières ; ne pas partager les serviettes"], doNot: ["Pas de collyres antibiotiques inventés"] },
      { summary: "דלקת לחמית: עין אדומה/דביקה. לרוב חולף; רוקח. ייעוץ דחוף בכאב חזק, רגישות לאור, ירידת ראייה, יילוד. אין טיפות אנטיביוטיקה מומצאות.", seeDoctorIf: ["אין שיפור", "כאב חזק / פוטופוביה", "שינוי בראייה", "יילוד"], selfCare: ["ניקוי עפעפיים; לא לשתף מגבות"], doNot: ["אין טיפות אנטיביוטיקה מומצאות"] },
      { summary: "Конъюнктивит: красный/слипшийся глаз. Часто проходит; фармацевт. Срочно при сильной боли, светобоязни, снижении зрения, новорождённом. Капли-антибиотики не выдумывать.", seeDoctorIf: ["Нет улучшения", "Сильная боль / светобоязнь", "Изменение зрения", "Новорождённый"], selfCare: ["Очищать веки; не делиться полотенцами"], doNot: ["Не изобретать антибиотиковые капли"] }
    ),
    sources: [S.nhsConjunctivitis],
  },
  {
    id: "oral-thrush",
    category: "ent",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["oral thrush", "white patches mouth", "candida mouth"],
      fr: ["muguet buccal", "plaques blanches bouche", "candidose orale"],
      he: ["פטרייה בפה", "כתמים לבנים בפה", "קנדידה בפה"],
      ru: ["молочница во рту", "белые пятна во рту", "оральный кандидоз"],
    },
    titles: { en: "Oral thrush", fr: "Muguet buccal", he: "פטרייה בפה", ru: "Молочница во рту" },
    guidance: g(
      { summary: "Oral thrush causes white patches in the mouth that can be wiped leaving red areas, with soreness. NHS: see a pharmacist/GP — antifungal gel/drops may be advised. Check inhaler technique/spacers if on steroid inhalers. Infants and immunocompromised need clinical advice. No inventing systemic antifungal doses.", seeDoctorIf: ["White patches in the mouth", "Infant with feeding difficulty and white mouth patches", "Immunocompromised or diabetes with oral thrush", "Not improving after pharmacy treatment"], doNot: ["Do not invent oral antifungal tablet regimens", "Do not ignore thrush with swallowing pain (possible oesophageal involvement — clinical review)"] },
      { summary: "Le muguet buccal forme des plaques blanches. Pharmacien/médecin pour antifongique local. Technique d'inhalateur à vérifier. Pas d'antifongiques systémiques inventés.", seeDoctorIf: ["Plaques blanches", "Nourrisson avec difficulté à s'alimenter", "Immunodépression / diabète"], doNot: ["Pas d'antifongiques oraux systémiques inventés"] },
      { summary: "פטרייה בפה: כתמים לבנים. רוקח/רופא לתכשיר מקומי. לבדוק טכניקת משאף סטרואידים. אין אנטי־פטרייתי מערכתי מומצא.", seeDoctorIf: ["כתמים לבנים בפה", "תינוק עם קושי בהאכלה", "דיכוי חיסוני / סוכרת"], doNot: ["אין אנטי־פטרייתי פומי מערכתי מומצא"] },
      { summary: "Молочница во рту: белые пятна. Фармацевт/врач за местным противогрибковым. Проверить технику ингалятора. Системные дозы не выдумывать.", seeDoctorIf: ["Белые пятна во рту", "Младенец с трудностью кормления", "Иммунодефицит / диабет"], doNot: ["Не изобретать системные противогрибковые"] }
    ),
    sources: [S.nhsOralThrush],
  },
];

// Clean empty emergencyIf; add urgent seeDoctor notes for gonorrhoea
for (const e of entries) {
  if (e.id === "sti-gonorrhoea") {
    e.guidance.en.seeDoctorIf.push(
      "Urgent: red/itchy/painful eyes or pus on lashes, fever, joint pain/swelling, or blotchy rash with suspected gonorrhoea",
    );
    e.guidance.fr.seeDoctorIf.push(
      "Urgent : yeux rouges/douloureux, fièvre, articulations, éruption avec suspicion de gonorrhée",
    );
    e.guidance.he.seeDoctorIf.push(
      "דחוף: עיניים אדומות/כואבות, חום, כאבי מפרקים או פריחה עם חשד לזיבה",
    );
    e.guidance.ru.seeDoctorIf.push(
      "Срочно: красные/болезненные глаза, лихорадка, суставы или сыпь при подозрении на гонорею",
    );
  }
  for (const lang of ["en", "fr", "he", "ru"]) {
    const g0 = e.guidance[lang];
    if (Array.isArray(g0.emergencyIf) && g0.emergencyIf.length === 0) delete g0.emergencyIf;
  }
  writeFileSync(join(dir, e.id + ".json"), JSON.stringify(e, null, 2) + "\n");
}
console.log("wrote", entries.length);

const catalogPath = join(root, "data/knowledge/sources.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const byId = new Map(catalog.sources.map((s) => [s.id, s]));
for (const s of Object.values(S)) {
  if (!byId.has(s.id)) byId.set(s.id, { id: s.id, name: s.name, org: s.org, url: s.url, topics: [] });
}
catalog.sources = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");

const metaPath = join(root, "data/knowledge/pack.meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
meta.entryFiles = files.map((f) => `entries/${f}`);
meta.version = "1.4.0";
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
console.log("pack", files.length, "sources", catalog.sources.length);

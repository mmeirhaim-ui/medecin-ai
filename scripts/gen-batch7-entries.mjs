#!/usr/bin/env node
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsMiscarriage: { id: "nhs-miscarriage", name: "NHS — Miscarriage", org: "NHS", url: "https://www.nhs.uk/conditions/miscarriage/", retrievedAt: R },
  nhsMastitis: { id: "nhs-mastitis", name: "NHS — Mastitis", org: "NHS", url: "https://www.nhs.uk/conditions/mastitis/", retrievedAt: R },
  nhsCradleCap: { id: "nhs-cradle-cap", name: "NHS — Cradle cap", org: "NHS", url: "https://www.nhs.uk/conditions/cradle-cap/", retrievedAt: R },
  nhsNappyRash: { id: "nhs-nappy-rash", name: "NHS — Nappy rash", org: "NHS", url: "https://www.nhs.uk/conditions/baby/caring-for-a-newborn/nappy-rash/", retrievedAt: R },
  nhsThreadworms: { id: "nhs-threadworms", name: "NHS — Threadworms", org: "NHS", url: "https://www.nhs.uk/conditions/threadworms/", retrievedAt: R },
  nhsHeadLice: { id: "nhs-head-lice", name: "NHS — Head lice and nits", org: "NHS", url: "https://www.nhs.uk/conditions/head-lice-and-nits/", retrievedAt: R },
  nhsVomitingBlood: { id: "nhs-vomiting-blood", name: "NHS — Vomiting blood", org: "NHS", url: "https://www.nhs.uk/conditions/vomiting-blood/", retrievedAt: R },
  nhsRectalBleeding: { id: "nhs-rectal-bleeding", name: "NHS — Rectal bleeding", org: "NHS", url: "https://www.nhs.uk/conditions/rectal-bleeding/", retrievedAt: R },
  nhsLegCramps: { id: "nhs-leg-cramps", name: "NHS — Leg cramps", org: "NHS", url: "https://www.nhs.uk/conditions/leg-cramps/", retrievedAt: R },
  nhsRLS: { id: "nhs-restless-legs", name: "NHS — Restless legs syndrome", org: "NHS", url: "https://www.nhs.uk/conditions/restless-legs-syndrome/", retrievedAt: R },
  nhsVaricose: { id: "nhs-varicose-veins", name: "NHS — Varicose veins", org: "NHS", url: "https://www.nhs.uk/conditions/varicose-veins/", retrievedAt: R },
  nhsCTS: { id: "nhs-carpal-tunnel", name: "NHS — Carpal tunnel syndrome", org: "NHS", url: "https://www.nhs.uk/conditions/carpal-tunnel-syndrome/", retrievedAt: R },
  nhsBedwetting: { id: "nhs-bedwetting", name: "NHS — Bedwetting", org: "NHS", url: "https://www.nhs.uk/conditions/bedwetting/", retrievedAt: R },
  nhsTinnitus: { id: "nhs-tinnitus", name: "NHS — Tinnitus", org: "NHS", url: "https://www.nhs.uk/conditions/tinnitus/", retrievedAt: R },
  nhsHearingLoss: { id: "nhs-hearing-loss", name: "NHS — Hearing loss", org: "NHS", url: "https://www.nhs.uk/conditions/hearing-loss/", retrievedAt: R },
  nhsEarwax: { id: "nhs-earwax", name: "NHS — Earwax build-up", org: "NHS", url: "https://www.nhs.uk/conditions/earwax-build-up/", retrievedAt: R },
  nhsQuinsy: { id: "nhs-quinsy", name: "NHS — Quinsy (peritonsillar abscess)", org: "NHS", url: "https://www.nhs.uk/conditions/quinsy/", retrievedAt: R },
  nhsGlandular: { id: "nhs-glandular-fever", name: "NHS — Glandular fever", org: "NHS", url: "https://www.nhs.uk/conditions/glandular-fever/", retrievedAt: R },
  nhsMumps: { id: "nhs-mumps", name: "NHS — Mumps", org: "NHS", url: "https://www.nhs.uk/conditions/mumps/", retrievedAt: R },
  nhsSlappedCheek: { id: "nhs-slapped-cheek", name: "NHS — Slapped cheek syndrome", org: "NHS", url: "https://www.nhs.uk/conditions/slapped-cheek-syndrome/", retrievedAt: R },
};

const entries = [
  {
    id: "miscarriage-bleeding",
    category: "pregnancy",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["miscarriage", "pregnant bleeding spotting", "pregnancy cramping bleeding"],
      fr: ["fausse couche", "saignement grossesse", "crampes grossesse saignement"],
      he: ["הפלה", "דימום בהריון", "כיווצים ודימום בהריון"],
      ru: ["выкидыш", "кровотечение при беременности", "схватки и кровотечение беременность"],
    },
    titles: { en: "Miscarriage / bleeding in pregnancy cues", fr: "Fausse couche / saignement de grossesse", he: "הפלה / דימום בהריון", ru: "Выкидыш / кровотечение при беременности" },
    guidance: g(
      { summary: "Vaginal bleeding before 24 weeks may be a miscarriage and needs maternity assessment. NHS urgent help for light bleeding/spotting or unusual discharge/fluid leak. Emergency (call services) for severe tummy pain, shoulder pain, feeling sick/faint/dizzy/unconscious, or heavy bleeding soaking a pad quickly. Management options are clinical — never invent medicines or procedures here. Overlaps with ectopic/pregnancy-bleeding red-flag entries when severe.", emergencyIf: ["Pregnant with vaginal bleeding and severe tummy pain", "Shoulder pain with pregnancy bleeding", "Feeling sick, faint, dizzy or losing consciousness", "Heavy bleeding soaking a period pad soon after putting it on"], seeDoctorIf: ["Any light bleeding/spotting in pregnancy", "Unusual vaginal discharge or fluid leaking while pregnant"], doNot: ["Do not invent miscarriage medicines or dosing", "Do not wait at home with severe pain or heavy bleeding"] },
      { summary: "Un saignement avant 24 SA peut être une fausse couche — avis maternité. Urgence si douleur sévère, douleur d'épaule, malaise/syncope, saignement abondant. Pas de médicaments inventés.", emergencyIf: ["Saignement + douleur abdominale sévère", "Douleur d'épaule", "Malaise/syncope", "Saignement abondant saturant une protection rapidement"], seeDoctorIf: ["Tout spotting/saignement léger", "Pertes inhabituelles ou liquide"], doNot: ["Pas de médicaments de fausse couche inventés"] },
      { summary: "דימום לפני שבוע 24 עלול להיות הפלה — ייעוץ יולדות. חירום בכאב חזק, כאב כתף, סחרחורת/התעלפות, דימום כבד. אין תרופות מומצאות.", emergencyIf: ["דימום + כאב בטן חזק", "כאב כתף", "בחילה/עילפון", "דימום כבד שספוג תחבושת במהירות"], seeDoctorIf: ["כל דימום קל/ספוטינג", "הפרשות חריגות או דליפת נוזל"], doNot: ["אין תרופות להפלה מומצאות"] },
      { summary: "Кровотечение до 24 недель может быть выкидышем — к акушерам. Неотложка при сильной боли, боли в плече, обмороке, обильном кровотечении. Лекарства не выдумывать.", emergencyIf: ["Кровотечение + сильная боль в животе", "Боль в плече", "Тошнота/обморок", "Обильное кровотечение, быстро пропитывающее прокладку"], seeDoctorIf: ["Любое лёгкое кровотечение/ spotting", "Необычные выделения или подтекание жидкости"], doNot: ["Не изобретать лекарства при выкидыше"] }
    ),
    sources: [S.nhsMiscarriage],
  },
  {
    id: "mastitis",
    category: "pregnancy",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["mastitis", "hot painful breast breastfeeding", "breast lump hot red"],
      fr: ["mastite", "sein chaud douloureux allaitement", "sein rouge chaud"],
      he: ["דלקת שד", "שד חם כואב בהנקה", "גוש חם אדום בשד"],
      ru: ["мастит", "горячая болезненная грудь при кормлении", "горячий красный участок груди"],
    },
    titles: { en: "Mastitis", fr: "Mastite", he: "דלקת שד (מסטיטיס)", ru: "Мастит" },
    guidance: g(
      { summary: "Mastitis: swollen, hot, painful breast area (often one side), sometimes flu-like symptoms. NHS: continue breastfeeding/expressing if breastfeeding; cold compress; rest; pharmacy/GP pain relief. See GP if not better in 12–24h home care, not better 48h after antibiotics, or mastitis when not breastfeeding. Antibiotics are clinician-prescribed — no invented courses.", seeDoctorIf: ["Not better 12–24 hours after home care", "Not better 48 hours after antibiotics", "Mastitis and not breastfeeding", "Worsening fever or spreading redness"], selfCare: ["Continue feeds if breastfeeding; cold compress 10 min/hour; supportive bra; rest; paracetamol/ibuprofen if suitable per label"], doNot: ["Do not invent antibiotic regimens", "Do not stop breastfeeding solely because of mastitis without advice"] },
      { summary: "Mastite : sein chaud, douloureux, parfois symptômes grippaux. Continuer l'allaitement si possible ; compresses froides. Médecin si pas d'amélioration. Pas d'antibiotiques inventés.", seeDoctorIf: ["Pas d'amélioration en 12–24 h", "Pas d'amélioration 48 h après antibiotiques", "Mastite hors allaitement"], selfCare: ["Continuer tétées ; compresses froides ; repos"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "דלקת שד: אזור חם וכואב, לעיתים דמוי שפעת. להמשיך הנקה אם אפשר; קומפרס קר. רופא אם אין שיפור. אין אנטיביוטיקה מומצאת.", seeDoctorIf: ["אין שיפור תוך 12–24 שעות", "אין שיפור 48 שעות אחרי אנטיביוטיקה", "מסטיטיס בלי הנקה"], selfCare: ["להמשיך הנקה; קומפרס קר; מנוחה"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Мастит: горячий болезненный участок груди, иногда гриппоподобные симптомы. Продолжать кормление если возможно; холодный компресс. Врач если нет улучшения. Антибиотики не выдумывать.", seeDoctorIf: ["Нет улучшения за 12–24 ч", "Нет улучшения через 48 ч после антибиотиков", "Мастит без грудного вскармливания"], selfCare: ["Продолжать кормление; холодный компресс; покой"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsMastitis],
  },
  {
    id: "cradle-cap",
    category: "peds",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["cradle cap", "baby greasy scalp scales", "infant seborrheic dermatitis scalp"],
      fr: ["croûtes de lait", "squames grasses cuir chevelu bébé"],
      he: ["כובע עריסה", "קשקשים שומניים בקרקפת תינוק"],
      ru: ["себорейный дерматит новорождённых", "молочные корочки на голове"],
    },
    titles: { en: "Cradle cap", fr: "Croûtes de lait", he: "כובע עריסה", ru: "Молочные корочки" },
    guidance: g(
      { summary: "Cradle cap is common and usually harmless greasy yellow scales on a baby's scalp. NHS: gentle washing; soften scales with baby oil if advised; do not pick aggressively. See a GP/pharmacist if inflamed, spreading, or baby unwell.", seeDoctorIf: ["Scalp looks infected (red, weeping, spreading)", "Baby seems unwell", "Not improving with gentle care"], selfCare: ["Wash hair regularly with mild baby shampoo; soften scales gently; do not scratch off hard"], doNot: ["Do not pick crusts forcefully", "Do not invent steroid scalp regimens for infants"] },
      { summary: "Les croûtes de lait sont fréquentes et souvent bénignes. Lavage doux ; ne pas gratter fort. Médecin si inflammation/infection.", seeDoctorIf: ["Aspect infecté", "Bébé malade", "Pas d'amélioration"], selfCare: ["Shampoing doux ; assouplir les squames"], doNot: ["Ne pas arracher les croûtes"] },
      { summary: "כובע עריסה נפוץ ולרוב לא מסוכן. שטיפה עדינה; לא לקרוע. רופא אם דלקת/זיהום.", seeDoctorIf: ["מראה מזוהם", "תינוק לא מרגיש טוב", "אין שיפור"], selfCare: ["שמפו עדין; ריכוך קשקשים"], doNot: ["לא לקרוע גלדים בכוח"] },
      { summary: "Молочные корочки часты и обычно безвредны. Мягкое мытьё; не сдирать. Врач при воспалении/инфекции.", seeDoctorIf: ["Признаки инфекции", "Ребёнок плохо себя чувствует", "Нет улучшения"], selfCare: ["Мягкий шампунь; размягчать чешуйки"], doNot: ["Не сдирать корки силой"] }
    ),
    sources: [S.nhsCradleCap],
  },
  {
    id: "nappy-rash",
    category: "peds",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["nappy rash", "diaper rash", "red bottom baby"],
      fr: ["érythème fessier", "rougeurs couches bébé"],
      he: ["תפרחת חיתולים", "אודם בישבן תינוק"],
      ru: ["опрелости под подгузником", "красный поп у малыша"],
    },
    titles: { en: "Nappy (diaper) rash", fr: "Érythème fessier", he: "תפרחת חיתולים", ru: "Опрелости" },
    guidance: g(
      { summary: "Nappy rash is common. NHS: change nappies often, clean gently, leave nappy off when possible, barrier cream from pharmacy. See a GP if not improving, blistering, spreading, fever, or baby in pain.", seeDoctorIf: ["Not improving with barrier cream care", "Blisters, pus, or spreading redness", "Fever or baby very unsettled"], selfCare: ["Frequent changes; gentle cleaning; dry well; barrier cream; nappy-free time"], doNot: ["Do not invent steroid cream strengths for infants", "Do not use adult products without advice"] },
      { summary: "L'érythème fessier est fréquent. Changes fréquents, crème barrière. Médecin si pas d'amélioration, cloques, fièvre.", seeDoctorIf: ["Pas d'amélioration", "Cloques / pus / rougeur extensive", "Fièvre"], selfCare: ["Changes fréquents ; nettoyer doucement ; crème barrière"], doNot: ["Pas de dermocorticoïdes inventés pour nourrissons"] },
      { summary: "תפרחת חיתולים נפוצה. החלפות תכופות, קרם מחסום. רופא אם אין שיפור, שלפוחיות, חום.", seeDoctorIf: ["אין שיפור", "שלפוחיות / מוגלה / אודם מתפשט", "חום"], selfCare: ["החלפות תכופות; ניקוי עדין; קרם מחסום"], doNot: ["אין סטרואיד מקומי מומצא לתינוקות"] },
      { summary: "Опрелости часты. Частая смена, барьерный крем. Врач если нет улучшения, пузыри, лихорадка.", seeDoctorIf: ["Нет улучшения", "Пузыри / гной / распространяющаяся краснота", "Лихорадка"], selfCare: ["Частая смена; мягкая очистка; барьерный крем"], doNot: ["Не изобретать топические стероиды для младенцев"] }
    ),
    sources: [S.nhsNappyRash],
  },
  {
    id: "threadworms",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["threadworms", "pinworms", "itchy bottom at night worms"],
      fr: ["oxyures", "vers intestinaux démangeaisons anus nuit"],
      he: ["תולעי סיכה", "גרד בישבן בלילה תולעים"],
      ru: ["острицы", "зуд в заднем проходе ночью глисты"],
    },
    titles: { en: "Threadworms (pinworms)", fr: "Oxyures", he: "תולעי סיכה", ru: "Острицы" },
    guidance: g(
      { summary: "Threadworms cause anal itching, often worse at night. NHS: pharmacy treatment for most; treat whole household; strict hygiene for 2 weeks. Children under 2 / pregnancy need GP advice. No inventing mebendazole doses.", seeDoctorIf: ["Child under 2", "Pregnant", "Not improving after pharmacy treatment", "Unsure of diagnosis"], selfCare: ["Pharmacy worming treatment when suitable; wash hands; morning shower; change underwear daily; wash bedding"], doNot: ["Do not invent worming tablet doses for infants", "Do not treat only one person if household treatment is advised"] },
      { summary: "Les oxyures démangent l'anus, surtout la nuit. Traitement pharmacie ; foyer entier ; hygiène. <2 ans / grossesse = médecin. Pas de doses inventées.", seeDoctorIf: ["Enfant < 2 ans", "Grossesse", "Échec du traitement"], selfCare: ["Traitement pharmacie adapté ; hygiène stricte"], doNot: ["Pas de doses inventées pour nourrissons"] },
      { summary: "תולעי סיכה גורמות לגרד בפי הטבעת בלילה. טיפול בבית מרקחת; כל הבית; היגיינה. מתחת לגיל 2/הריון — רופא. אין מינון מומצא.", seeDoctorIf: ["ילד מתחת לגיל 2", "הריון", "אין שיפור"], selfCare: ["טיפול בית מרקחת מתאים; היגיינה"], doNot: ["אין מינון לתינוקות מומצא"] },
      { summary: "Острицы вызывают зуд ануса ночью. Аптечное лечение; весь дом; гигиена. <2 лет/беременность — врач. Дозы не выдумывать.", seeDoctorIf: ["Ребёнок <2 лет", "Беременность", "Нет улучшения"], selfCare: ["Аптечное средство при уместности; гигиена"], doNot: ["Не изобретать дозы для младенцев"] }
    ),
    sources: [S.nhsThreadworms],
  },
  {
    id: "head-lice-nits",
    category: "peds",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["head lice", "nits", "itchy scalp lice"],
      fr: ["poux", "lentes", "cuir chevelu qui démange poux"],
      he: ["כינים", "ביצי כינים", "גרד קרקפת כינים"],
      ru: ["вши", "гниды", "зуд кожи головы вши"],
    },
    titles: { en: "Head lice and nits", fr: "Poux et lentes", he: "כינים וביצים", ru: "Вши и гниды" },
    guidance: g(
      { summary: "Head lice are common in children. NHS: wet combing and/or pharmacy lotions; treat only if live lice found; check household. See pharmacist/GP if treatment fails or scalp infected.", seeDoctorIf: ["Treatment not working", "Scalp looks infected", "Unsure how to treat"], selfCare: ["Detection combing; pharmacy products as directed; wash bedding; avoid sharing brushes"], doNot: ["Do not invent pesticide regimens beyond product labels", "Do not treat 'just in case' without live lice if advised otherwise"] },
      { summary: "Les poux sont fréquents. Peignage humide et/ou lotions pharmacie si poux vivants. Médecin/pharmacien si échec.", seeDoctorIf: ["Échec du traitement", "Infection du cuir chevelu"], selfCare: ["Peignage ; produits pharmacie ; ne pas partager brosses"], doNot: ["Pas de schémas inventés hors notice"] },
      { summary: "כינים נפוצות בילדים. סירוק רטוב ו/או תכשירים בבית מרקחת אם יש כינים חיות. רוקח/רופא בכישלון.", seeDoctorIf: ["טיפול לא עוזר", "זיהום בקרקפת"], selfCare: ["סירוק; תכשירי בית מרקחת; לא לשתף מברשות"], doNot: ["אין משטר מומצא מעבר להוראות"] },
      { summary: "Вши часты у детей. Влажное вычёсывание и/или аптечные средства при живых вшах. Фармацевт/врач при неудаче.", seeDoctorIf: ["Лечение не помогает", "Инфекция кожи головы"], selfCare: ["Вычёсывание; аптечные средства; не делиться расчёсками"], doNot: ["Не изобретать схемы вне инструкции"] }
    ),
    sources: [S.nhsHeadLice],
  },
  {
    id: "vomiting-blood",
    category: "gi",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["vomiting blood", "hematemesis", "coffee ground vomit"],
      fr: ["vomissements de sang", "hématémèse", "vomissements marc de café"],
      he: ["הקאת דם", "המטומזיס", "הקאה כמו קפה טחון"],
      ru: ["рвота кровью", "гематемезис", "рвота кофейной гущей"],
    },
    titles: { en: "Vomiting blood", fr: "Vomissements de sang", he: "הקאת דם", ru: "Рвота кровью" },
    guidance: g(
      { summary: "Vomiting blood or coffee-ground material needs urgent medical assessment. NHS: emergency care especially with dizziness, fainting, severe abdominal pain, black stools, or large amounts. Do not eat/drink if advised NPO for possible endoscopy — follow clinicians. No inventing acid-suppressant IV regimens.", emergencyIf: ["Vomiting blood or coffee-ground vomit", "Vomiting blood with dizziness, fainting, severe pain, or black stools"], seeDoctorIf: ["Any unexplained blood in vomit — same-day urgent pathway"], doNot: ["Do not delay emergency care", "Do not invent PPI/antacid treatment plans for GI bleed"] },
      { summary: "Vomir du sang ou un aspect marc de café = urgence. Surtout avec malaise, douleur, selles noires. Pas de schémas inventés.", emergencyIf: ["Vomissements de sang / marc de café", "Avec vertige, syncope, douleur sévère, selles noires"], seeDoctorIf: ["Tout sang dans les vomissements"], doNot: ["Ne pas retarder les urgences"] },
      { summary: "הקאת דם או מראה קפה טחון — חירום. במיוחד עם סחרחורת, כאב, צואה שחורה. אין פרוטוקולים מומצאים.", emergencyIf: ["הקאת דם / קפה טחון", "עם סחרחורת, עילפון, כאב חזק, צואה שחורה"], seeDoctorIf: ["כל דם בהקאה"], doNot: ["לא לדחות טיפול חירום"] },
      { summary: "Рвота кровью или «кофейной гущей» — неотложка. Особенно с головокружением, болью, чёрным стулом. Схемы не выдумывать.", emergencyIf: ["Рвота кровью / кофейной гущей", "С головокружением, обмороком, сильной болью, чёрным стулом"], seeDoctorIf: ["Любая кровь в рвоте"], doNot: ["Не откладывать неотложную помощь"] }
    ),
    sources: [S.nhsVomitingBlood],
  },
  {
    id: "rectal-bleeding",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["rectal bleeding", "blood in stool", "bleeding from bottom"],
      fr: ["saignement rectal", "sang dans les selles", "saignement par l'anus"],
      he: ["דימום רקטלי", "דם בצואה", "דימום מפי הטבעת"],
      ru: ["ректальное кровотечение", "кровь в стуле", "кровь из заднего прохода"],
    },
    titles: { en: "Rectal bleeding", fr: "Saignement rectal", he: "דימום רקטלי", ru: "Ректальное кровотечение" },
    guidance: g(
      { summary: "Blood from the bottom needs assessment — causes range from piles to more serious disease. NHS: see a GP for unexplained rectal bleeding. Emergency for heavy bleeding, dizziness/fainting, black tarry stools with unwellness, or severe pain. Do not assume piles without review.", emergencyIf: ["Heavy rectal bleeding", "Bleeding with dizziness or fainting", "Black tarry stools with feeling very unwell", "Severe abdominal pain with bleeding"], seeDoctorIf: ["Any unexplained blood in stool or on wiping", "Change in bowel habit with bleeding"], doNot: ["Do not assume all bleeding is haemorrhoids", "Do not invent treatments for GI bleeding"] },
      { summary: "Un saignement anal nécessite un avis. Urgence si abondant, malaise, selles noires, douleur sévère. Ne pas attribuer d'emblée aux hémorroïdes.", emergencyIf: ["Saignement abondant", "Avec vertige/syncope", "Selles noires + malaise", "Douleur abdominale sévère"], seeDoctorIf: ["Tout sang inexpliqué", "Changement de transit avec sang"], doNot: ["Ne pas conclure aux hémorroïdes sans avis"] },
      { summary: "דימום מפי הטבעת דורש הערכה. חירום אם כבד, סחרחורת, צואה שחורה, כאב חזק. לא להניח שזה רק טחורים.", emergencyIf: ["דימום כבד", "עם סחרחורת/עילפון", "צואה שחורה + הרגשה רעה", "כאב בטן חזק"], seeDoctorIf: ["כל דם לא מוסבר", "שינוי ביציאות עם דם"], doNot: ["לא להניח שזה טחורים בלי בדיקה"] },
      { summary: "Кровь из заднего прохода требует оценки. Неотложка при обильном кровотечении, головокружении, чёрном стуле, сильной боли. Не считать сразу геморроем.", emergencyIf: ["Обильное кровотечение", "С головокружением/обмороком", "Чёрный стул + плохое самочувствие", "Сильная боль в животе"], seeDoctorIf: ["Любая необъяснимая кровь", "Изменение стула с кровью"], doNot: ["Не считать геморроем без осмотра"] }
    ),
    sources: [S.nhsRectalBleeding],
  },
  {
    id: "leg-cramps",
    category: "msk",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["leg cramps", "charley horse", "night calf cramp"],
      fr: ["crampes aux jambes", "crampe de mollet la nuit"],
      he: ["התכווצויות רגליים", "התכווצות שוק בלילה"],
      ru: ["судороги в ногах", "ночная судорога икры"],
    },
    titles: { en: "Leg cramps", fr: "Crampes des jambes", he: "התכווצויות רגליים", ru: "Судороги ног" },
    guidance: g(
      { summary: "Leg cramps are sudden painful muscle contractions, often at night. NHS: stretch and massage; gentle walking; stay hydrated. See a GP if very frequent, severe, or with swelling/redness (possible clot/other cause). No inventing quinine regimens.", seeDoctorIf: ["Very frequent or severe cramps", "Cramps with leg swelling, redness, or shortness of breath", "Cramps only in one leg with other DVT cues"], selfCare: ["Stretch the muscle; massage; heat/cold as tolerated; regular gentle exercise; fluids"], doNot: ["Do not invent quinine or muscle-relaxant doses", "Do not ignore unilateral swollen painful leg (DVT pathway)"] },
      { summary: "Les crampes sont des contractions douloureuses, souvent nocturnes. Étirement, hydratation. Médecin si fréquentes ou avec signes de phlébite. Pas de quinine inventée.", seeDoctorIf: ["Crampes très fréquentes", "Avec gonflement/rougeur / dyspnée"], selfCare: ["Étirer ; masser ; boire"], doNot: ["Pas de quinine inventée"] },
      { summary: "התכווצויות רגליים כואבות, לרוב בלילה. מתיחה, שתייה. רופא אם תכופות או עם סימני קריש. אין כינין מומצא.", seeDoctorIf: ["התכווצויות תכופות מאוד", "עם נפיחות/אודם / קוצר נשימה"], selfCare: ["מתיחה; עיסוי; שתייה"], doNot: ["אין כינין מומצא"] },
      { summary: "Судороги ног — внезапные болезненные сокращения, часто ночью. Растяжка, жидкость. Врач если частые или с признаками тромбоза. Хинин не выдумывать.", seeDoctorIf: ["Очень частые судороги", "С отёком/краснотой / одышкой"], selfCare: ["Растянуть; массаж; пить"], doNot: ["Не изобретать хинин"] }
    ),
    sources: [S.nhsLegCramps],
  },
  {
    id: "restless-legs",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["restless legs", "RLS urge to move legs at night"],
      fr: ["jambes sans repos", "besoin de bouger les jambes la nuit"],
      he: ["תסמונת רגליים חסרות מנוחה", "דחף להזיז רגליים בלילה"],
      ru: ["синдром беспокойных ног", "желание двигать ногами ночью"],
    },
    titles: { en: "Restless legs syndrome", fr: "Syndrome des jambes sans repos", he: "תסמונת רגליים חסרות מנוחה", ru: "Синдром беспокойных ног" },
    guidance: g(
      { summary: "RLS causes an urge to move the legs, often worse at rest/night. NHS: see a GP for assessment (iron studies sometimes relevant). Lifestyle measures may help; medicines are clinician-prescribed — no invented dopamine-agonist doses.", seeDoctorIf: ["Symptoms disrupting sleep", "Worsening or new onset"], selfCare: ["Regular sleep schedule; moderate exercise; avoid excess caffeine/alcohol late; discuss iron checks with GP"], doNot: ["Do not invent RLS drug regimens", "Do not ignore severe sleep disruption"] },
      { summary: "Le SJSR donne une envie irrépressible de bouger les jambes, surtout la nuit. Avis médical ; pas de médicaments inventés.", seeDoctorIf: ["Perturbation du sommeil", "Aggravation"], selfCare: ["Horaires de sommeil réguliers ; activité modérée ; limiter caféine"], doNot: ["Pas d'agonistes dopaminergiques inventés"] },
      { summary: "RLS: דחף להזיז רגליים, לרוב במנוחה/לילה. ייעוץ רפואי; אין תרופות מומצאות.", seeDoctorIf: ["הפרעת שינה", "החמרה"], selfCare: ["שגרת שינה; פעילות מתונה; להגביל קפאין"], doNot: ["אין אגוניסטים דופמינרגיים מומצאים"] },
      { summary: "СБН: желание двигать ногами, хуже в покое/ночью. К врачу; лекарства не выдумывать.", seeDoctorIf: ["Нарушение сна", "Ухудшение"], selfCare: ["Режим сна; умеренная активность; меньше кофеина"], doNot: ["Не изобретать дозы дофаминовых агонистов"] }
    ),
    sources: [S.nhsRLS],
  },
  {
    id: "varicose-veins",
    category: "cardio",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["varicose veins", "bulging leg veins", "twisted veins legs"],
      fr: ["varices", "veines gonflées jambes", "veines tortueuses"],
      he: ["דליות", "ורידים בולטים ברגליים"],
      ru: ["варикоз", "вздутые вены на ногах"],
    },
    titles: { en: "Varicose veins", fr: "Varices", he: "דליות ברגליים", ru: "Варикозное расширение вен" },
    guidance: g(
      { summary: "Varicose veins are swollen twisted leg veins that can ache or itch. NHS: elevate legs, stay active, compression if advised. See GP for pain, skin changes, ulcers, or bleeding. Urgent care for sudden one-leg swelling (DVT) or heavy bleeding from a vein.", emergencyIf: ["Sudden one-leg swelling/pain (possible DVT)", "Heavy bleeding from a varicose vein that does not stop with pressure"], seeDoctorIf: ["Aching varicose veins affecting life", "Skin discoloration or ulcers near ankles", "Bleeding from a vein"], selfCare: ["Elevate legs; avoid prolonged standing; walk regularly; compression as advised"], doNot: ["Do not invent sclerotherapy or surgery plans", "Do not ignore unilateral swollen painful leg"] },
      { summary: "Les varices peuvent faire mal ou démanger. Surélever, marcher. Médecin si troubles cutanés/ulcères. Urgence si phlébite suspectée ou saignement abondant.", emergencyIf: ["Jambe unilatérale gonflée/douloureuse (TVP possible)", "Saignement abondant d'une varice"], seeDoctorIf: ["Gêne importante", "Troubles cutanés / ulcères"], selfCare: ["Surélever ; marcher ; compression si conseillée"], doNot: ["Pas de plans de sclérothérapie inventés"] },
      { summary: "דליות יכולות לכאוב או לגרד. להרים רגליים, ללכת. רופא בשינויי עור/כיבים. חירום בחשד לפקקת או דימום כבד.", emergencyIf: ["נפיחות/כאב חד־צדדי (חשד ל־DVT)", "דימום כבד מדליה"], seeDoctorIf: ["הפרעה משמעותית", "שינויי עור / כיבים"], selfCare: ["הרמת רגליים; הליכה; לחץ לפי ייעוץ"], doNot: ["אין תוכניות סקלרותרפיה מומצאות"] },
      { summary: "Варикоз может болеть или чесаться. Приподнимать ноги, ходить. Врач при изменениях кожи/язвах. Неотложка при подозрении на ТГВ или обильном кровотечении.", emergencyIf: ["Односторонний отёк/боль (возможен ТГВ)", "Обильное кровотечение из вены"], seeDoctorIf: ["Сильный дискомфорт", "Изменения кожи / язвы"], selfCare: ["Приподнимать ноги; ходить; компрессия по совету"], doNot: ["Не изобретать планы склеротерапии"] }
    ),
    sources: [S.nhsVaricose],
  },
  {
    id: "carpal-tunnel",
    category: "msk",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["carpal tunnel", "numb fingers at night", "tingling thumb index middle"],
      fr: ["canal carpien", "engourdissement doigts la nuit", "fourmillements pouce index médius"],
      he: ["תעלת שורש כף היד", "נימול אצבעות בלילה", "עקצוץ אגודל אצבע אמה"],
      ru: ["синдром запястного канала", "онемение пальцев ночью", "покалывание большого указательного среднего"],
    },
    titles: { en: "Carpal tunnel syndrome", fr: "Syndrome du canal carpien", he: "תסמונת תעלת השורש", ru: "Синдром запястного канала" },
    guidance: g(
      { summary: "Carpal tunnel causes tingling/numbness in thumb, index, middle fingers, often worse at night. NHS: wrist splints, activity modification; GP for persistent symptoms. Surgery/steroid injection are clinician decisions — no invented injection doses. Urgent review for sudden severe weakness or progressive hand weakness.", seeDoctorIf: ["Persistent night tingling/numbness", "Dropping objects / weakness", "Symptoms not helped by splints"], selfCare: ["Night wrist splint if advised; avoid repetitive strain; short breaks"], doNot: ["Do not invent steroid injection regimens", "Do not ignore progressive weakness"] },
      { summary: "Le canal carpien engourdit pouce/index/médius, surtout la nuit. Attelle ; médecin si persistant. Pas d'injections inventées.", seeDoctorIf: ["Fourmillements nocturnes persistants", "Faiblesse / objets qui tombent"], selfCare: ["Attelle nocturne si conseillée ; pauses"], doNot: ["Pas d'injections de corticoïdes inventées"] },
      { summary: "תעלת שורש: נימול באגודל/אצבע/אמה, לרוב בלילה. סד; רופא אם נמשך. אין זריקות מומצאות.", seeDoctorIf: ["נימול לילי מתמשך", "חולשה / נפילת חפצים"], selfCare: ["סד לילה לפי ייעוץ; הפסקות"], doNot: ["אין זריקות סטרואידים מומצאות"] },
      { summary: "Запястный канал: онемение большого/указательного/среднего пальцев, хуже ночью. Шина; врач если длится. Инъекции не выдумывать.", seeDoctorIf: ["Стойкое ночное онемение", "Слабость / падение предметов"], selfCare: ["Ночная шина по совету; перерывы"], doNot: ["Не изобретать инъекции стероидов"] }
    ),
    sources: [S.nhsCTS],
  },
  {
    id: "bedwetting",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["bedwetting", "enuresis", "child wets the bed"],
      fr: ["énurésie", "pipi au lit", "enfant mouille le lit"],
      he: ["הרטבת לילה", "ילד מרטיב במיטה"],
      ru: ["ночное недержание", "ребёнок мочится в постель"],
    },
    titles: { en: "Bedwetting (enuresis)", fr: "Énurésie nocturne", he: "הרטבת לילה", ru: "Ночной энурез" },
    guidance: g(
      { summary: "Bedwetting is common in young children and often improves with time. NHS: supportive approach; see GP if starting after being dry, daytime symptoms, pain, thirst, or family distress. Alarms/medicines are clinician-guided — no invented desmopressin doses.", seeDoctorIf: ["New bedwetting after a long dry period", "Daytime wetting, pain, excessive thirst", "Constipation with wetting", "Family wanting structured help"], selfCare: ["Calm support; easy night access to toilet; limit blame; waterproof mattress cover"], doNot: ["Do not invent desmopressin regimens", "Do not punish the child"] },
      { summary: "L'énurésie est fréquente et s'améliore souvent. Approche bienveillante ; médecin si récidive après propreté, symptômes diurnes, soif. Pas de desmopressine inventée.", seeDoctorIf: ["Réapparition après période sèche", "Symptômes diurnes / douleur / soif", "Constipation associée"], selfCare: ["Soutien calme ; accès toilettes ; housse impermeable"], doNot: ["Pas de desmopressine inventée", "Ne pas punir"] },
      { summary: "הרטבת לילה נפוצה ומשתפרת לרוב. גישה תומכת; רופא אם חוזר אחרי יובש, תסמיני יום, צמא. אין דסמופרסין מומצא.", seeDoctorIf: ["הרטבה חדשה אחרי תקופה יבשה", "הרטבה ביום / כאב / צמא מוגבר", "עצירות נלווית"], selfCare: ["תמיכה רגועה; גישה לשירותים; כיסוי אטום"], doNot: ["אין דסמופרסין מומצא", "לא להעניש"] },
      { summary: "Ночной энурез частый и часто проходит. Поддержка; врач если после сухого периода, дневные симптомы, жажда. Десмопрессин не выдумывать.", seeDoctorIf: ["Новое недержание после сухого периода", "Дневные симптомы / боль / жажда", "Запор"], selfCare: ["Спокойная поддержка; доступ к туалету; непромокаемый чехол"], doNot: ["Не изобретать десмопрессин", "Не наказывать"] }
    ),
    sources: [S.nhsBedwetting],
  },
  {
    id: "tinnitus",
    category: "ent",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["tinnitus", "ringing in ears", "buzzing in ears"],
      fr: ["acouphènes", "sifflements dans les oreilles", "bourdonnements"],
      he: ["טיניטוס", "צלצולים באוזניים", "זמזום באוזניים"],
      ru: ["тиннитус", "звон в ушах", "шум в ушах"],
    },
    titles: { en: "Tinnitus", fr: "Acouphènes", he: "טיניטוס", ru: "Тиннитус" },
    guidance: g(
      { summary: "Tinnitus is hearing sounds with no external source. NHS: see a GP for assessment; sudden hearing loss with tinnitus needs urgent care. Management is supportive/clinical — no inventing unproven supplements as treatment.", emergencyIf: ["Sudden hearing loss with tinnitus", "Tinnitus with new neurological deficits (face/arm/speech)"], seeDoctorIf: ["Persistent ringing/buzzing", "Tinnitus with hearing loss, dizziness, or one-sided symptoms"], doNot: ["Do not invent miracle supplement regimens", "Do not ignore sudden one-sided hearing loss"] },
      { summary: "Les acouphènes sont des bruits sans source externe. Médecin ; urgence si surdité brutale. Pas de compléments miracles inventés.", emergencyIf: ["Surdité brutale avec acouphènes", "Avec déficit neurologique nouveau"], seeDoctorIf: ["Acouphènes persistants", "Avec baisse d'audition / vertige / unilatéral"], doNot: ["Pas de compléments miracles inventés"] },
      { summary: "טיניטוס: שמיעת רעשים ללא מקור חיצוני. רופא; חירום בירידת שמיעה פתאומית. אין תוספים מופלאים מומצאים.", emergencyIf: ["ירידת שמיעה פתאומית עם טיניטוס", "עם חסר נוירולוגי חדש"], seeDoctorIf: ["צלצול מתמשך", "עם ירידת שמיעה / סחרחורת / חד־צדדי"], doNot: ["אין תוספים מופלאים מומצאים"] },
      { summary: "Тиннитус — звуки без внешнего источника. К врачу; неотложка при внезапной потере слуха. Чудо-добавки не выдумывать.", emergencyIf: ["Внезапная потеря слуха с тиннитусом", "С новым неврологическим дефицитом"], seeDoctorIf: ["Стойкий звон", "Со снижением слуха / головокружением / односторонностью"], doNot: ["Не изобретать чудо-БАДы"] }
    ),
    sources: [S.nhsTinnitus],
  },
  {
    id: "hearing-loss-sudden",
    category: "ent",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["sudden hearing loss", "deaf in one ear suddenly", "sudden deafness"],
      fr: ["surdité brutale", "sourd d'une oreille soudainement"],
      he: ["ירידת שמיעה פתאומית", "חרש פתאומי באוזן אחת"],
      ru: ["внезапная потеря слуха", "внезапно оглох на одно ухо"],
    },
    titles: { en: "Sudden hearing loss", fr: "Surdité brutale", he: "ירידת שמיעה פתאומית", ru: "Внезапная потеря слуха" },
    guidance: g(
      { summary: "Sudden hearing loss in one or both ears is an urgent ENT issue. NHS: seek same-day urgent assessment. Do not wait to 'see if it passes'. Treatments (e.g. steroids) are clinician-only — no invented doses. Also rule out stroke/red-flag neuro symptoms.", emergencyIf: ["Sudden hearing loss", "Sudden hearing loss with facial weakness, speech trouble, or severe headache"], seeDoctorIf: ["Any sudden drop in hearing — urgent same-day care"], doNot: ["Do not wait days hoping it improves", "Do not invent oral/IV steroid regimens"] },
      { summary: "Une surdité brutale est une urgence ORL. Avis le jour même. Pas de corticoïdes inventés. Écarter signes d'AVC.", emergencyIf: ["Surdité brutale", "Avec faiblesse faciale / trouble de parole / céphalée sévère"], seeDoctorIf: ["Toute baisse soudaine d'audition"], doNot: ["Ne pas attendre des jours", "Pas de corticoïdes inventés"] },
      { summary: "ירידת שמיעה פתאומית היא דחופה. הערכה באותו יום. אין סטרואידים מומצאים. לשלול שבץ.", emergencyIf: ["ירידת שמיעה פתאומית", "עם חולשת פנים / דיבור / כאב ראש חזק"], seeDoctorIf: ["כל ירידה פתאומית בשמיעה"], doNot: ["לא לחכות ימים", "אין סטרואידים מומצאים"] },
      { summary: "Внезапная потеря слуха — срочная ЛОР-проблема. Оценка в тот же день. Стероиды не выдумывать. Исключать инсульт.", emergencyIf: ["Внезапная потеря слуха", "С слабостью лица / речи / сильной головной болью"], seeDoctorIf: ["Любое внезапное снижение слуха"], doNot: ["Не ждать днями", "Не изобретать стероиды"] }
    ),
    sources: [S.nhsHearingLoss],
  },
  {
    id: "earwax-buildup",
    category: "ent",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["earwax", "blocked ear wax", "cannot hear wax"],
      fr: ["cérumen", "oreille bouchée cérumen", "bouchon de cérumen"],
      he: ["שעוות אוזניים", "אוזן סתומה משעווה"],
      ru: ["серная пробка", "заложенное ухо сера"],
    },
    titles: { en: "Earwax build-up", fr: "Bouchon de cérumen", he: "שעוות אוזניים", ru: "Серная пробка" },
    guidance: g(
      { summary: "Earwax can block hearing. NHS: pharmacy drops to soften; do not use cotton buds. See GP/audiology if not clearing, pain, discharge, or after ear surgery/perforation history. No inventing irrigation protocols beyond clinical advice.", seeDoctorIf: ["Wax not clearing with drops", "Ear pain, discharge, or hearing loss after drops", "History of perforated eardrum / ear surgery"], selfCare: ["Pharmacy softening drops as directed; no cotton buds"], doNot: ["Do not insert cotton buds or objects", "Do not invent home syringing if advised against"] },
      { summary: "Le cérumen peut boucher l'oreille. Gouttes pharmacie ; pas de coton-tige. Médecin si échec, douleur, écoulement.", seeDoctorIf: ["Pas d'amélioration", "Douleur / otorrhée", "Antécédent de perforation / chirurgie"], selfCare: ["Gouttes assouplissantes ; pas de coton-tige"], doNot: ["Ne rien introduire dans l'oreille"] },
      { summary: "שעווה עלולה לסתום. טיפות בבית מרקחת; לא מקלוני צמר גפן. רופא בכישלון, כאב, הפרשות.", seeDoctorIf: ["אין שיפור", "כאב / הפרשות", "היסטוריית ניקוב / ניתוח"], selfCare: ["טיפות מרככות; בלי מקלונים"], doNot: ["לא להכניס חפצים לאוזן"] },
      { summary: "Сера может блокировать слух. Аптечные капли; не ватные палочки. Врач при неудаче, боли, отделяемом.", seeDoctorIf: ["Нет улучшения", "Боль / отделяемое", "Перфорация / операция в анамнезе"], selfCare: ["Смягчающие капли; без палочек"], doNot: ["Не вводить предметы в ухо"] }
    ),
    sources: [S.nhsEarwax],
  },
  {
    id: "quinsy-abscess",
    category: "ent",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["quinsy", "peritonsillar abscess", "tonsillitis one side swelling trismus"],
      fr: ["phlegmon péri-amygdalien", "abcès périamygdalien", "angine unilatérale trismus"],
      he: ["מורסה ליד שקד", "קווינזי", "דלקת שקדים חד צדדית קושי לפתוח פה"],
      ru: ["паратонзиллярный абсцесс", "флегмона вокруг миндалины", "односторонний тонзиллит тризм"],
    },
    titles: { en: "Quinsy (peritonsillar abscess)", fr: "Phlegmon péri-amygdalien", he: "מורסה סביב השקד (קווינזי)", ru: "Паратонзиллярный абсцесс" },
    guidance: g(
      { summary: "Quinsy is a collection of pus beside a tonsil after tonsillitis — severe one-sided throat pain, fever, muffled voice, difficulty opening mouth, drooling. NHS: urgent medical care; may need drainage/antibiotics in hospital. Emergency if breathing difficulty. No inventing drainage or antibiotic regimens.", emergencyIf: ["Difficulty breathing", "Unable to swallow saliva / severe drooling", "Severe one-sided throat swelling with fever and trismus"], seeDoctorIf: ["Suspected quinsy after tonsillitis — urgent same-day care"], doNot: ["Do not invent antibiotic or drainage plans", "Do not wait at home with progressive swelling"] },
      { summary: "Le phlegmon péri-amygdalien : douleur unilatérale sévère, fièvre, voix étouffée, trismus. Soins urgents ; urgence si dyspnée. Pas de schémas inventés.", emergencyIf: ["Dyspnée", "Impossible d'avaler la salive", "Gonflement unilatéral sévère avec fièvre et trismus"], seeDoctorIf: ["Suspicion après angine — avis urgent"], doNot: ["Pas d'antibiotiques/drainage inventés"] },
      { summary: "קווינזי: כאב חד־צדדי חזק, חום, קול עמום, קושי לפתוח פה. טיפול דחוף; חירום בקושי נשימה. אין פרוטוקולים מומצאים.", emergencyIf: ["קושי נשימה", "לא יכול לבלוע רוק", "נפיחות חד־צדדית עם חום וטריזמוס"], seeDoctorIf: ["חשד אחרי דלקת שקדים — דחוף"], doNot: ["אין אנטיביוטיקה/ניקוז מומצאים"] },
      { summary: "Паратонзиллярный абсцесс: сильная односторонняя боль, лихорадка, гнусавость, тризм. Срочная помощь; неотложка при одышке. Схемы не выдумывать.", emergencyIf: ["Затруднённое дыхание", "Нельзя проглотить слюну", "Сильный односторонний отёк с лихорадкой и тризмом"], seeDoctorIf: ["Подозрение после тонзиллита — срочно"], doNot: ["Не изобретать антибиотики/дренаж"] }
    ),
    sources: [S.nhsQuinsy],
  },
  {
    id: "glandular-fever",
    category: "infectious",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["glandular fever", "mono", "infectious mononucleosis", "EBV sore throat glands"],
      fr: ["mononucléose", "fièvre glandulaire", "angine ganglions fatigue"],
      he: ["מחלת הנשיקה", "מונונוקלאוזיס", "כאב גרון ובלוטות עייפות"],
      ru: ["инфекционный мононуклеоз", "железистая лихорадка", "ангина железы усталость"],
    },
    titles: { en: "Glandular fever (mono)", fr: "Mononucléose infectieuse", he: "מחלת הנשיקה / מונו", ru: "Инфекционный мононуклеоз" },
    guidance: g(
      { summary: "Glandular fever causes sore throat, fever, swollen glands, and marked fatigue. NHS: rest, fluids; see GP for diagnosis. Avoid contact sports while recovering (spleen risk). Urgent care for severe throat swelling/breathing difficulty or severe abdominal pain. No inventing antivirals.", emergencyIf: ["Severe breathing difficulty or inability to swallow", "Severe abdominal pain after glandular fever (possible spleen issue)"], seeDoctorIf: ["Suspected glandular fever", "Prolonged severe fatigue", "Jaundice"], selfCare: ["Rest; fluids; avoid alcohol; no contact sports until advised clear"], doNot: ["Do not invent antivirals", "Do not return to contact sports early"] },
      { summary: "La mononucléose : angine, fièvre, ganglions, fatigue. Repos ; médecin. Éviter sports de contact. Urgence si dyspnée ou douleur abdominale sévère. Pas d'antiviraux inventés.", emergencyIf: ["Dyspnée / impossibilité d'avaler", "Douleur abdominale sévère"], seeDoctorIf: ["Suspicion de mononucléose", "Fatigue prolongée", "Ictère"], selfCare: ["Repos ; boire ; pas de sport de contact"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "מחלת הנשיקה: כאב גרון, חום, בלוטות, עייפות. מנוחה; רופא. להימנע מספורט מגע. חירום בקושי נשימה או כאב בטן חזק. אין אנטי-ויראלי מומצא.", emergencyIf: ["קושי נשימה / לא יכול לבלוע", "כאב בטן חזק"], seeDoctorIf: ["חשד למחלת נשיקה", "עייפות ממושכת", "צהבת"], selfCare: ["מנוחה; שתייה; בלי ספורט מגע"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Мононуклеоз: боль в горле, лихорадка, железы, усталость. Покой; врач. Избегать контактного спорта. Неотложка при одышке или сильной боли в животе. Противовирусные не выдумывать.", emergencyIf: ["Одышка / нельзя глотать", "Сильная боль в животе"], seeDoctorIf: ["Подозрение на мононуклеоз", "Длительная усталость", "Желтуха"], selfCare: ["Покой; жидкость; без контактного спорта"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsGlandular],
  },
  {
    id: "mumps",
    category: "infectious",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["mumps", "swollen jaw glands", "parotitis"],
      fr: ["oreillons", "parotidite", "gonflement mâchoire"],
      he: ["חזרת", "נפיחות בבלוטות הרוק", "פרוטיטיס"],
      ru: ["свинка", "эпидемический паротит", "отёк околоушных желёз"],
    },
    titles: { en: "Mumps", fr: "Oreillons", he: "חזרת", ru: "Эпидемический паротит (свинка)" },
    guidance: g(
      { summary: "Mumps causes fever and painful swelling of salivary glands (often jaw angle). NHS: see a GP; rest, fluids; highly contagious — stay off school/work as advised. Urgent care for severe headache/stiff neck (meningitis), testicular pain, or breathing difficulty. Vaccination prevents mumps; no inventing antivirals.", emergencyIf: ["Severe headache or stiff neck with mumps", "Severe testicular pain", "Difficulty breathing/swallowing"], seeDoctorIf: ["Suspected mumps", "Contact if pregnant/immunocompromised — clinical advice"], selfCare: ["Rest; fluids; soft foods; isolation as advised"], doNot: ["Do not invent antivirals", "Do not attend school/work while advised contagious"] },
      { summary: "Les oreillons : fièvre et gonflement des parotides. Médecin ; repos. Urgence si méningisme, douleur testiculaire, dyspnée. Pas d'antiviraux inventés.", emergencyIf: ["Céphalée sévère / raideur de nuque", "Douleur testiculaire sévère", "Dyspnée"], seeDoctorIf: ["Suspicion d'oreillons"], selfCare: ["Repos ; boire ; isolement selon conseil"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "חזרת: חום ונפיחות בבלוטות רוק. רופא; מנוחה. חירום בכאב ראש/נוקשות עורף, כאב אשך, קושי נשימה. אין אנטי-ויראלי מומצא.", emergencyIf: ["כאב ראש חזק / נוקשות עורף", "כאב אשך חזק", "קושי נשימה"], seeDoctorIf: ["חשד לחזרת"], selfCare: ["מנוחה; שתייה; בידוד לפי ייעוץ"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Свинка: лихорадка и отёк слюнных желёз. К врачу; покой. Неотложка при менингизме, боли в яичке, одышке. Противовирусные не выдумывать.", emergencyIf: ["Сильная головная боль / ригидность шеи", "Сильная боль в яичке", "Одышка"], seeDoctorIf: ["Подозрение на паротит"], selfCare: ["Покой; жидкость; изоляция по совету"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsMumps],
  },
  {
    id: "slapped-cheek",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["slapped cheek", "fifth disease", "parvovirus B19 rash"],
      fr: ["mégalérythème épidémique", "5e maladie", "parvovirus B19"],
      he: ["לחי סטורה", "מחלת הפרבווירוס", "פריחת לחי אדומה ילד"],
      ru: ["пятая болезнь", "синдром пощёчины", "парвовирус B19"],
    },
    titles: { en: "Slapped cheek syndrome", fr: "Mégalérythème (5e maladie)", he: "תסמונת הלחי הסטורה", ru: "Пятая болезнь (парвовирус)" },
    guidance: g(
      { summary: "Slapped cheek (parvovirus B19) causes a bright red cheek rash, often after mild fever, then a body lace-like rash. NHS: usually mild in children; see GP if unsure. Pregnant people, sickle-cell/haemolytic anaemia, or immunocompromised contacts need prompt clinical advice. No inventing antivirals.", seeDoctorIf: ["Unsure of diagnosis", "Pregnant after exposure/symptoms", "Blood disorder or immunocompromised with exposure", "Child very unwell"], selfCare: ["Rest; fluids; paracetamol if suitable per label for fever/discomfort"], doNot: ["Do not invent antivirals", "Do not ignore pregnancy exposure — seek advice"] },
      { summary: "Le mégalérythème : joues rouges puis exanthème. Souvent bénin ; médecin si doute. Grossesse / anémies / immunodépression = avis prompt. Pas d'antiviraux inventés.", seeDoctorIf: ["Doute", "Grossesse après contact", "Anémie / immunodépression", "Enfant très malade"], selfCare: ["Repos ; boire ; paracétamol selon notice"], doNot: ["Pas d'antiviraux inventés"] },
      { summary: "לחי סטורה: לחיים אדומות ואז פריחה. לרוב קל; רופא בספק. הריון/אנמיה/דיכוי חיסוני — ייעוץ מהיר. אין אנטי-ויראלי מומצא.", seeDoctorIf: ["ספק", "הריון אחרי חשיפה", "הפרעת דם / דיכוי חיסוני", "ילד חולה מאוד"], selfCare: ["מנוחה; שתייה; פרצטמול לפי התווית"], doNot: ["אין אנטי-ויראלי מומצא"] },
      { summary: "Пятая болезнь: яркие красные щёки, затем сыпь. Обычно лёгкая; врач при сомнении. Беременность/анемия/иммунодефицит — быстрый совет. Противовирусные не выдумывать.", seeDoctorIf: ["Сомнение", "Беременность после контакта", "Болезнь крови / иммунодефицит", "Ребёнок очень болен"], selfCare: ["Покой; жидкость; парацетамол по инструкции"], doNot: ["Не изобретать противовирусные"] }
    ),
    sources: [S.nhsSlappedCheek],
  },
];

for (const e of entries) {
  writeFileSync(join(dir, e.id + ".json"), JSON.stringify(e, null, 2) + "\n");
}
console.log("wrote", entries.length);

const catalog = JSON.parse(readFileSync(join(root, "data/knowledge/sources.json"), "utf8"));
const byId = new Map(catalog.sources.map((s) => [s.id, s]));
for (const s of Object.values(S)) {
  if (!byId.has(s.id)) byId.set(s.id, { id: s.id, name: s.name, org: s.org, url: s.url, topics: [] });
}
catalog.sources = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(join(root, "data/knowledge/sources.json"), JSON.stringify(catalog, null, 2) + "\n");

const meta = JSON.parse(readFileSync(join(root, "data/knowledge/pack.meta.json"), "utf8"));
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
meta.entryFiles = files.map((f) => `entries/${f}`);
meta.version = "1.6.0";
meta.updatedAt = R;
writeFileSync(join(root, "data/knowledge/pack.meta.json"), JSON.stringify(meta, null, 2) + "\n");

function camel(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
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
console.log("pack", files.length, "sources", catalog.sources.length);

#!/usr/bin/env node
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsPmr: { id: "nhs-pmr", name: "NHS — Polymyalgia rheumatica", org: "NHS", url: "https://www.nhs.uk/conditions/polymyalgia-rheumatica/", retrievedAt: R },
  nhsPmrSx: { id: "nhs-pmr-symptoms", name: "NHS — Polymyalgia rheumatica symptoms", org: "NHS", url: "https://www.nhs.uk/conditions/polymyalgia-rheumatica/symptoms/", retrievedAt: R },
  nhsInsect: { id: "nhs-insect-bites", name: "NHS — Insect bites and stings", org: "NHS", url: "https://www.nhs.uk/conditions/insect-bites-and-stings/", retrievedAt: R },
  nhsSnake: { id: "nhs-snake-bites", name: "NHS — Snake bites", org: "NHS", url: "https://www.nhs.uk/conditions/snake-bites/", retrievedAt: R },
  nhsColdSore: { id: "nhs-cold-sores", name: "NHS — Cold sores", org: "NHS", url: "https://www.nhs.uk/conditions/cold-sores/", retrievedAt: R },
  nhsTonsillitis: { id: "nhs-tonsillitis", name: "NHS — Tonsillitis", org: "NHS", url: "https://www.nhs.uk/conditions/tonsillitis/", retrievedAt: R },
  nhsLaryngitis: { id: "nhs-laryngitis", name: "NHS — Laryngitis", org: "NHS", url: "https://www.nhs.uk/conditions/laryngitis/", retrievedAt: R },
  nhsBronchitis: { id: "nhs-bronchitis", name: "NHS — Bronchitis", org: "NHS", url: "https://www.nhs.uk/conditions/bronchitis/", retrievedAt: R },
  nhsPleurisy: { id: "nhs-pleurisy", name: "NHS — Pleurisy", org: "NHS", url: "https://www.nhs.uk/conditions/pleurisy/", retrievedAt: R },
  nhsHypo: { id: "nhs-hypoglycaemia", name: "NHS — Low blood sugar (hypoglycaemia)", org: "NHS", url: "https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/", retrievedAt: R },
  nhsHyper: { id: "nhs-hyperglycaemia", name: "NHS — High blood sugar (hyperglycaemia)", org: "NHS", url: "https://www.nhs.uk/conditions/high-blood-sugar-hyperglycaemia/", retrievedAt: R },
  nhsPreeclampsia: { id: "nhs-pre-eclampsia", name: "NHS — Pre-eclampsia", org: "NHS", url: "https://www.nhs.uk/conditions/pre-eclampsia/", retrievedAt: R },
  nhsGlueEar: { id: "nhs-glue-ear", name: "NHS — Glue ear", org: "NHS", url: "https://www.nhs.uk/conditions/glue-ear/", retrievedAt: R },
  nhsMouthUlcers: { id: "nhs-mouth-ulcers", name: "NHS — Mouth ulcers", org: "NHS", url: "https://www.nhs.uk/conditions/mouth-ulcers/", retrievedAt: R },
  nhsBoils: { id: "nhs-boils", name: "NHS — Boils", org: "NHS", url: "https://www.nhs.uk/conditions/boils/", retrievedAt: R },
  nhsFrostbite: { id: "nhs-frostbite", name: "NHS — Frostbite", org: "NHS", url: "https://www.nhs.uk/conditions/frostbite/", retrievedAt: R },
  nhsChilblains: { id: "nhs-chilblains", name: "NHS — Chilblains", org: "NHS", url: "https://www.nhs.uk/conditions/chilblains/", retrievedAt: R },
  nhsMotion: { id: "nhs-motion-sickness", name: "NHS — Motion sickness", org: "NHS", url: "https://www.nhs.uk/conditions/motion-sickness/", retrievedAt: R },
  nhsInsomnia: { id: "nhs-insomnia", name: "NHS — Insomnia", org: "NHS", url: "https://www.nhs.uk/conditions/insomnia/", retrievedAt: R },
  nhsHiccups: { id: "nhs-hiccups", name: "NHS — Hiccups", org: "NHS", url: "https://www.nhs.uk/symptoms/hiccups/", retrievedAt: R },
  nhsAsthma: { id: "nhs-asthma", name: "NHS — Asthma", org: "NHS", url: "https://www.nhs.uk/conditions/asthma/", retrievedAt: R },
  nhsUti: { id: "nhs-uti", name: "NHS — Urinary tract infection (UTI)", org: "NHS", url: "https://www.nhs.uk/conditions/urinary-tract-infections-utis/", retrievedAt: R },
};

const entries = [
  {
    id: "polymyalgia-rheumatica",
    category: "rheum",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["polymyalgia rheumatica", "PMR", "morning stiffness shoulders hips", "stiffness shoulders neck hips"],
      fr: ["pseudopolyarthrite rhizomélique", "PPR", "raideur matinale épaules hanches", "raideur épaules cou hanches"],
      he: ["פולימיאלגיה ראומטיקה", "PMR", "נוקשות בוקר כתפיים ירכיים"],
      ru: ["ревматическая полимиалгия", "ПМР", "утренняя скованность плечи бёдра"],
    },
    titles: { en: "Polymyalgia rheumatica (PMR)", fr: "Pseudopolyarthrite rhizomélique (PPR)", he: "פולימיאלגיה ראומטיקה", ru: "Ревматическая полимиалгия" },
    guidance: g(
      { summary: "PMR causes pain and stiffness around shoulders, neck and hips, often worse in the morning for >45 minutes, both sides. NHS: see a GP if pain/stiffness lasts >1 week. Immediate advice if new sudden headache, scalp tenderness, jaw pain when eating/talking, or vision problems (possible temporal arteritis). Steroids are clinician-prescribed — no invented prednisolone doses.", emergencyIf: ["Sudden vision loss with suspected PMR/temporal arteritis"], seeDoctorIf: ["Pain and stiffness lasting more than a week", "Diagnosed/suspected PMR with new sudden headache, scalp tenderness, jaw pain when eating/talking, or vision problems — urgent advice"], doNot: ["Do not invent steroid regimens", "Do not ignore temporal arteritis red flags"] },
      { summary: "La PPR provoque douleur et raideur des ceintures, souvent >45 min le matin. Médecin si >1 semaine. Avis immédiat si céphalée, cuir chevelu douloureux, claudication de mâchoire, trouble visuel (artérite temporale). Pas de corticoïdes inventés.", seeDoctorIf: ["Douleur/raideur > 1 semaine", "Céphalée/tempes/mâchoire/vision — avis urgent"], doNot: ["Pas de prednisolone inventée"] },
      { summary: "PMR: כאב ונוקשות בכתפיים/צוואר/ירכיים, לרוב בבוקר מעל 45 דק'. רופא אם מעל שבוע. ייעוץ מיידי בכאב ראש חדש, רגישות קרקפת, כאב לסת, הפרעת ראייה. אין סטרואידים מומצאים.", seeDoctorIf: ["כאב/נוקשות מעל שבוע", "כאב ראש/קרקפת/לסת/ראייה — דחוף"], doNot: ["אין פרדניזולון מומצא"] },
      { summary: "ПМР: боль и скованность плеч/шеи/бёдер, часто утром >45 мин. К врачу если >1 недели. Срочно при головной боли, болезненной коже головы, боли в челюсти, нарушении зрения. Стероиды не выдумывать.", seeDoctorIf: ["Боль/скованность >1 недели", "Головная боль/кожа головы/челюсть/зрение — срочно"], doNot: ["Не изобретать преднизолон"] }
    ),
    sources: [S.nhsPmr, S.nhsPmrSx],
  },
  {
    id: "insect-bites-stings",
    category: "allergy",
    urgencyDefault: "auto_soins",
    priority: 4,
    keywords: {
      en: ["insect bite", "wasp sting", "bee sting", "mosquito bite swollen"],
      fr: ["piqûre d'insecte", "piqûre de guêpe", "piqûre d'abeille", "piqûre de moustique gonflée"],
      he: ["עקיצת חרק", "עקיצת צרעה", "עקיצת דבורה", "עקיצת יתוש נפוחה"],
      ru: ["укус насекомого", "укус осы", "укус пчелы", "укус комара отёк"],
    },
    titles: { en: "Insect bites and stings", fr: "Piqûres d'insectes", he: "עקיצות חרקים", ru: "Укусы насекомых" },
    guidance: g(
      { summary: "Most insect bites/stings improve in a few days. NHS: remove stinger by scraping (not tweezers), wash, ice pack wrapped, elevate, pharmacy antihistamine/hydrocortisone if suitable. Urgent advice if worsening, sting in mouth/throat/near eyes, tummy pain/vomiting, dizziness, fever with swollen glands, multiple stings, or prior severe allergy. Emergency for anaphylaxis features.", emergencyIf: ["Sudden lip/mouth/throat/tongue swelling", "Struggling to breathe or swallow", "Blue/grey/pale skin or lips", "Confusion, drowsiness, or unresponsive"], seeDoctorIf: ["Bite/sting worsening or not improving", "Stung in mouth, throat, or near eyes", "Dizziness, tummy pain/vomiting, fever with glands, multiple stings, prior severe reaction"], selfCare: ["Scrape stinger sideways; wash with soap; cold pack up to 20 min; raise the area"], doNot: ["Do not squeeze a bee stinger with tweezers", "Do not invent adrenaline doses — use prescribed auto-injector if you have one"] },
      { summary: "La plupart des piqûres s'améliorent en quelques jours. Retirer le dard en raclant, laver, glace. Urgence si anaphylaxie. Avis urgent si empire, bouche/gorge/yeux, malaise.", emergencyIf: ["Gonflement lèvres/gorge", "Détresse respiratoire", "Cyanose", "Confusion"], seeDoctorIf: ["Aggravation", "Piqûre bouche/gorge/près des yeux", "Vertige, vomissements, fièvre, piqûres multiples"], selfCare: ["Racler le dard ; laver ; froid ; surélever"], doNot: ["Ne pas pincer le dard avec une pince"] },
      { summary: "רוב העקיצות משתפרות תוך ימים. להסיר עוקץ בגרידה, לשטוף, קרח. חירום באנפילקסיס. ייעוץ דחוף בהחמרה, פה/גרון/עיניים.", emergencyIf: ["נפיחות שפתיים/גרון", "קושי נשימה", "כחלחלות", "בלבול"], seeDoctorIf: ["החמרה", "עקיצה בפה/גרון/ליד עיניים", "סחרחורת, הקאות, חום, עקיצות מרובות"], selfCare: ["לגרד עוקץ הצידה; לשטוף; קרח; להרים"], doNot: ["לא למשוך עוקץ במלקחיים"] },
      { summary: "Большинство укусов проходят за дни. Удалить жало соскабливанием, промыть, лёд. Неотложка при анафилаксии. Срочно при ухудшении, укусе во рту/горле/у глаз.", emergencyIf: ["Отёк губ/горла", "Затруднённое дыхание", "Цианоз", "Спутанность"], seeDoctorIf: ["Ухудшение", "Укус во рту/горле/у глаз", "Головокружение, рвота, лихорадка, множественные укусы"], selfCare: ["Соскоблить жало; промыть; холод; приподнять"], doNot: ["Не вытаскивать жало пинцетом"] }
    ),
    sources: [S.nhsInsect],
  },
  {
    id: "snake-bites",
    category: "trauma",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["snake bite", "bitten by a snake", "snakebite"],
      fr: ["morsure de serpent", "mordu par un serpent"],
      he: ["הכשת נחש", "נחש נשך"],
      ru: ["укус змеи", "змея укусила"],
    },
    titles: { en: "Snake bite — emergency care", fr: "Morsure de serpent — urgence", he: "הכשת נחש — חירום", ru: "Укус змеи — неотложная помощь" },
    guidance: g(
      { summary: "NHS: call emergency services / go to A&E for any snake bite. Stay calm; keep the bitten part still; recovery position if needed; paracetamol for pain; remove jewellery/loosen clothes near the bite; note colour/pattern from a safe distance. Do not catch the snake, suck/cut venom, apply tight tourniquets, or take aspirin/ibuprofen (bleeding risk). Antivenom is hospital-only.", emergencyIf: ["Any suspected snake bite"], selfCare: ["Keep still; arrange emergency transport; do not drive yourself if possible"], doNot: ["Do not catch or kill the snake", "Do not suck or cut the wound", "Do not apply a tight tourniquet", "Do not take aspirin or ibuprofen", "Do not invent antivenom doses"] },
      { summary: "Toute morsure de serpent = urgences. Rester calme ; immobiliser ; paracétamol ; retirer bijoux. Ne pas aspirer/couper, garrot serré, aspirine/ibuprofène. Sérum antivenimeux = hôpital.", emergencyIf: ["Toute morsure de serpent suspectée"], selfCare: ["Immobiliser ; transport d'urgence"], doNot: ["Ne pas attraper le serpent", "Ne pas aspirer/couper", "Pas de garrot serré", "Pas d'aspirine/ibuprofène"] },
      { summary: "כל הכשת נחש — חירום. להישאר רגועים; לייצב; פרצטמול; להסיר תכשיטים. לא למצוץ/לחתוך, חוסם עורקים הדוק, אספירין/איבופרופן. נסיוב — בית חולים.", emergencyIf: ["כל חשד להכשת נחש"], selfCare: ["לייצב; פינוי חירום"], doNot: ["לא לתפוס את הנחש", "לא למצוץ/לחתוך", "לא חוסם הדוק", "לא אספירין/איבופרופן"] },
      { summary: "Любой укус змеи — неотложка. Спокойствие; обездвижить; парацетамол; снять украшения. Не отсасывать/резать, тугой жгут, аспирин/ибупрофен. Сыворотка — только в больнице.", emergencyIf: ["Любой подозреваемый укус змеи"], selfCare: ["Обездвижить; экстренная транспортировка"], doNot: ["Не ловить змею", "Не отсасывать/резать", "Не тугой жгут", "Не аспирин/ибупрофен"] }
    ),
    sources: [S.nhsSnake],
  },
  {
    id: "cold-sores",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["cold sore", "herpes labialis", "fever blister lip"],
      fr: ["bouton de fièvre", "herpès labial", "vescicules lèvre"],
      he: ["הרפס שפתיים", "שלפוחית חום בשפה", "cold sore"],
      ru: ["герпес на губах", "простуда на губе", "лихорадочный пузырёк"],
    },
    titles: { en: "Cold sores (herpes labialis)", fr: "Bouton de fièvre (herpès labial)", he: "הרפס שפתיים", ru: "Герпес губ" },
    guidance: g(
      { summary: "Cold sores are usually self-limiting. NHS: pharmacy antiviral cream may help if started early; avoid kissing/sharing while sores present; do not touch eyes. See a GP if sores near eyes, immunocompromised, or not healing. No inventing oral antiviral doses.", seeDoctorIf: ["Cold sores near the eyes", "Immunocompromised with cold sores", "Not healing or very frequent severe outbreaks"], selfCare: ["Pharmacy advice on topical antivirals; avoid touching/spreading; separate towels"], doNot: ["Do not invent oral antiviral regimens", "Do not pick sores"] },
      { summary: "Le bouton de fièvre est souvent bénin. Crème antivirale en pharmacie tôt ; éviter de contaminer les yeux. Médecin si près des yeux, immunodépression, non cicatrisation. Pas d'antiviraux oraux inventés.", seeDoctorIf: ["Près des yeux", "Immunodépression", "Ne cicatrise pas"], selfCare: ["Avis pharmacien ; ne pas toucher/essaimer"], doNot: ["Pas d'antiviraux oraux inventés"] },
      { summary: "הרפס שפתיים לרוב חולף. משחה בבית מרקחת מוקדם; לא לגעת בעיניים. רופא ליד עיניים/דיכוי חיסוני/לא נרפא. אין אנטי-ויראלי פומי מומצא.", seeDoctorIf: ["ליד העיניים", "דיכוי חיסוני", "לא נרפא"], selfCare: ["ייעוץ רוקח; לא לגעת/להדביק"], doNot: ["אין אנטי-ויראלי פומי מומצא"] },
      { summary: "Герпес губ обычно проходит. Аптечный крем рано; не трогать глаза. Врач у глаз/иммунодефицит/не заживает. Пероральные противовирусные не выдумывать.", seeDoctorIf: ["Около глаз", "Иммунодефицит", "Не заживает"], selfCare: ["Совет фармацевта; не трогать/не распространять"], doNot: ["Не изобретать пероральные противовирусные"] }
    ),
    sources: [S.nhsColdSore],
  },
  {
    id: "tonsillitis",
    category: "ent",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["tonsillitis", "swollen tonsils white spots", "sore throat tonsils"],
      fr: ["amygdalite", "angine amygdales", "amygdales gonflées points blancs"],
      he: ["דלקת שקדים", "שקדים נפוחים נקודות לבנות", "כאב גרון שקדים"],
      ru: ["тонзиллит", "опухшие миндалины белые точки", "боль в горле миндалины"],
    },
    titles: { en: "Tonsillitis", fr: "Amygdalite / angine", he: "דלקת שקדים", ru: "Тонзиллит" },
    guidance: g(
      { summary: "Tonsillitis causes sore throat, swollen tonsils, sometimes white spots, fever, difficulty swallowing. NHS: fluids, rest, soft foods, pharmacy pain relief; antibiotics only if clinician judges bacterial. Urgent care for breathing difficulty, drooling, severe swelling, or inability to swallow fluids. No invented antibiotic courses.", emergencyIf: ["Severe breathing difficulty", "Unable to swallow saliva / drooling with severe throat swelling"], seeDoctorIf: ["Severe sore throat lasting more than a few days", "High fever", "Not able to swallow fluids comfortably", "Recurrent tonsillitis"], selfCare: ["Fluids; rest; soft foods; paracetamol/ibuprofen if suitable per label"], doNot: ["Do not invent antibiotic regimens", "Do not ignore breathing difficulty"] },
      { summary: "L'amygdalite provoque mal de gorge, amygdales gonflées, parfois points blancs. Hydratation, repos ; antibiotiques seulement si avis médical. Urgence si détresse/salive impossible.", emergencyIf: ["Détresse respiratoire", "Impossible d'avaler la salive"], seeDoctorIf: ["Angine sévère prolongée", "Forte fièvre", "Difficulté à boire"], selfCare: ["Boire ; repos ; aliments mous"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "דלקת שקדים: כאב גרון, שקדים נפוחים, לעיתים נקודות לבנות. נוזלים, מנוחה; אנטיביוטיקה רק לפי רופא. חירום בקושי נשימה/ריור.", emergencyIf: ["קושי נשימה חמור", "לא יכול לבלוע רוק"], seeDoctorIf: ["כאב גרון חזק ממושך", "חום גבוה", "קושי לשתות"], selfCare: ["נוזלים; מנוחה; מזון רך"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Тонзиллит: боль в горле, отёк миндалин, иногда белые точки. Жидкость, покой; антибиотики только по решению врача. Неотложка при одышке/слюнотечении.", emergencyIf: ["Тяжёлая одышка", "Нельзя проглотить слюну"], seeDoctorIf: ["Сильная длительная боль в горле", "Высокая лихорадка", "Трудно пить"], selfCare: ["Жидкость; покой; мягкая еда"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsTonsillitis],
  },
  {
    id: "laryngitis",
    category: "ent",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["laryngitis", "lost my voice", "hoarse voice sore throat"],
      fr: ["laryngite", "voix éraillée", "extinction de voix"],
      he: ["דלקת גרון תיבת קול", "איבדתי את הקול", "צרידות"],
      ru: ["ларингит", "осипший голос", "пропал голос"],
    },
    titles: { en: "Laryngitis (hoarse voice)", fr: "Laryngite (voix enrouée)", he: "דלקת גרון / צרידות", ru: "Ларингит (охриплость)" },
    guidance: g(
      { summary: "Laryngitis often follows a cold and causes hoarseness or voice loss. NHS: rest the voice, fluids, steam/humid air, avoid smoke; usually improves in 1–2 weeks. See a GP if lasting longer, difficulty breathing, or blood in spit. No inventing steroid courses for voice.", seeDoctorIf: ["Hoarseness lasting more than 2–3 weeks", "Difficulty breathing", "Coughing up blood", "Unexplained weight loss with voice change"], selfCare: ["Voice rest; fluids; avoid whispering/shouting; humidify air; no smoking"], doNot: ["Do not invent oral steroid regimens for laryngitis", "Do not ignore prolonged hoarseness (possible other causes)"] },
      { summary: "La laryngite enroue la voix. Repos vocal, hydratation ; amélioration souvent en 1–2 semaines. Médecin si prolongé ou dyspnée. Pas de corticoïdes inventés.", seeDoctorIf: ["Enrouement > 2–3 semaines", "Dyspnée", "Crachats de sang"], selfCare: ["Repos de la voix ; boire ; éviter fumée"], doNot: ["Pas de corticoïdes oraux inventés"] },
      { summary: "דלקת גרון גורמת לצרידות. מנוחת קול, נוזלים; לרוב משתפר תוך 1–2 שבועות. רופא אם ממושך או קושי נשימה. אין סטרואידים מומצאים.", seeDoctorIf: ["צרידות מעל 2–3 שבועות", "קושי נשימה", "דם בשיעול"], selfCare: ["מנוחת קול; שתייה; להימנע מעישון"], doNot: ["אין סטרואידים פומיים מומצאים"] },
      { summary: "Ларингит даёт охриплость. Покой голоса, жидкость; обычно 1–2 недели. Врач если длится или одышка. Стероиды не выдумывать.", seeDoctorIf: ["Охриплость >2–3 недель", "Одышка", "Кровь в мокроте"], selfCare: ["Покой голоса; пить; без дыма"], doNot: ["Не изобретать пероральные стероиды"] }
    ),
    sources: [S.nhsLaryngitis],
  },
  {
    id: "bronchitis",
    category: "respiratory",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["bronchitis", "chesty cough mucus", "acute bronchitis"],
      fr: ["bronchite", "toux grasse", "bronchite aiguë"],
      he: ["ברונכיטיס", "שיעול ליחתי", "דלקת סימפונות חדה"],
      ru: ["бронхит", "влажный кашель", "острый бронхит"],
    },
    titles: { en: "Bronchitis (chesty cough)", fr: "Bronchite", he: "ברונכיטיס", ru: "Бронхит" },
    guidance: g(
      { summary: "Acute bronchitis often causes a chesty cough with mucus after a cold. NHS: rest, fluids; antibiotics usually not needed for viral bronchitis. Seek urgent care for breathing difficulty, coughing blood, high fever lasting, chest pain, or if you have heart/lung disease. No invented antibiotic or inhaler regimens.", emergencyIf: ["Severe difficulty breathing", "Coughing up blood", "Blue/grey lips or sudden confusion"], seeDoctorIf: ["Cough lasting more than 3 weeks", "High fever", "Chest pain", "Known heart/lung disease with worsening cough"], selfCare: ["Rest; fluids; honey for cough in adults/older children if suitable (not under 1 year)"], doNot: ["Do not invent antibiotics", "Do not give honey to infants under 1 year"] },
      { summary: "La bronchite aiguë donne une toux grasse. Repos, hydratation ; antibiotiques souvent inutiles si viral. Avis urgent si dyspnée, hémoptysie, fièvre, douleur thoracique.", emergencyIf: ["Détresse respiratoire", "Crachats de sang", "Cyanose / confusion"], seeDoctorIf: ["Toux > 3 semaines", "Forte fièvre", "Douleur thoracique", "Cardiopathie/pneumopathie connue"], selfCare: ["Repos ; boire"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "ברונכיטיס חדה: שיעול ליחתי. מנוחה, נוזלים; אנטיביוטיקה לרוב לא נחוצה אם ויראלי. ייעוץ דחוף בקושי נשימה, דם, חום, כאב חזה.", emergencyIf: ["קושי נשימה חמור", "שיעול דם", "כחלחלות / בלבול"], seeDoctorIf: ["שיעול מעל 3 שבועות", "חום גבוה", "כאב חזה", "מחלת לב/ריאות ידועה"], selfCare: ["מנוחה; שתייה"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Острый бронхит: влажный кашель. Покой, жидкость; антибиотики часто не нужны при вирусе. Срочно при одышке, крови, лихорадке, боли в груди.", emergencyIf: ["Тяжёлая одышка", "Кровь при кашле", "Цианоз / спутанность"], seeDoctorIf: ["Кашель >3 недель", "Высокая лихорадка", "Боль в груди", "Известная болезнь сердца/лёгких"], selfCare: ["Покой; пить"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsBronchitis],
  },
  {
    id: "pleurisy",
    category: "respiratory",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["pleurisy", "pain when breathing in", "sharp chest pain breathing"],
      fr: ["pleurésie", "douleur en inspirant", "douleur thoracique à la respiration"],
      he: ["דלקת צדר", "כאב בנשימה פנימה", "כאב חד בחזה בנשימה"],
      ru: ["плеврит", "боль на вдохе", "острая боль в груди при дыхании"],
    },
    titles: { en: "Pleurisy (pain on breathing)", fr: "Pleurésie (douleur à l'inspiration)", he: "דלקת צדר (כאב בנשימה)", ru: "Плеврит (боль при дыхании)" },
    guidance: g(
      { summary: "Pleurisy is inflammation of the lung lining causing sharp chest pain worse on breathing or coughing. NHS: see a GP — causes vary and need assessment. Emergency if severe breathlessness, coughing blood, sudden one-sided swelling with chest pain (possible clot), or cardiac red flags. Do not invent anti-inflammatory regimens.", emergencyIf: ["Severe breathlessness", "Coughing blood", "Chest pain with heart-attack features", "Sudden chest pain with one-leg swelling (possible PE/DVT pathway)"], seeDoctorIf: ["Sharp chest pain worse on breathing or coughing"], doNot: ["Do not assume 'just a muscle strain' without assessment when pain is pleuritic", "Do not invent NSAID/steroid doses"] },
      { summary: "La pleurésie donne une douleur thoracique aiguë à l'inspiration. Avis médical. Urgence si dyspnée sévère, hémoptysie, signes d'infarctus/embolie. Pas d'AINS inventés.", emergencyIf: ["Dyspnée sévère", "Crachats de sang", "Douleur type infarctus", "Douleur + jambe gonflée unilatérale"], seeDoctorIf: ["Douleur thoracique à l'inspiration"], doNot: ["Pas d'AINS/corticoïdes inventés"] },
      { summary: "דלקת צדר: כאב חד בחזה שמחמיר בנשימה. ייעוץ רפואי. חירום בקוצר נשימה חמור, דם, סימני התקף לב/תסחיף. אין NSAID מומצא.", emergencyIf: ["קוצר נשימה חמור", "שיעול דם", "כאב חזה חשוד להתקף לב", "כאב + נפיחות ברגל אחת"], seeDoctorIf: ["כאב חד בנשימה/שיעול"], doNot: ["אין NSAID/סטרואידים מומצאים"] },
      { summary: "Плеврит: острая боль в груди хуже на вдохе. К врачу. Неотложка при тяжёлой одышке, крови, признаках инфаркта/ТЭЛА. НПВП не выдумывать.", emergencyIf: ["Тяжёлая одышка", "Кровь при кашле", "Боль как при инфаркте", "Боль + отёк одной ноги"], seeDoctorIf: ["Острая боль при дыхании/кашле"], doNot: ["Не изобретать НПВП/стероиды"] }
    ),
    sources: [S.nhsPleurisy],
  },
  {
    id: "hypoglycaemia",
    category: "endocrine",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["hypoglycaemia", "low blood sugar", "hypo shaking sweaty", "blood sugar too low"],
      fr: ["hypoglycémie", "sucre bas", "hypo tremblements sueurs", "glycémie trop basse"],
      he: ["היפוגליקמיה", "סוכר נמוך", "רעד והזעה מסוכר נמוך"],
      ru: ["гипогликемия", "низкий сахар", "гипо дрожь пот"],
    },
    titles: { en: "Low blood sugar (hypoglycaemia)", fr: "Hypoglycémie", he: "היפוגליקמיה", ru: "Гипогликемия" },
    guidance: g(
      { summary: "Hypos can cause shaking, sweating, hunger, confusion, irritability, and if severe — seizures or unconsciousness. NHS: treat mild hypos with fast-acting carbohydrate per diabetes care plan; emergency if severe/unconscious. This pack never invents insulin or exact gram protocols beyond urging follow of the person's prescribed plan / emergency services.", emergencyIf: ["Unconscious or having a seizure with suspected low sugar", "Unable to swallow safely", "Severe confusion not improving after usual hypo treatment"], seeDoctorIf: ["Repeated hypos", "Unsure how to manage diabetes lows — diabetes team/GP"], doNot: ["Do not give food/drink if unconscious", "Do not invent insulin dose changes", "Do not put anything in the mouth if not alert"] },
      { summary: "L'hypoglycémie : tremblements, sueurs, faim, confusion ; sévère = convulsions/inconscience. Traiter selon plan diabète ; urgence si grave. Pas d'insulinothérapie inventée.", emergencyIf: ["Inconscient ou convulsions", "Impossible d'avaler", "Confusion sévère"], seeDoctorIf: ["Hypoglycémies répétées"], doNot: ["Rien dans la bouche si inconscient", "Pas de changements d'insuline inventés"] },
      { summary: "היפו: רעד, הזעה, רעב, בלבול; חמור — פרכוס/איבוד הכרה. לטפל לפי תוכנית סוכרת; חירום אם חמור. אין שינוי אינסולין מומצא.", emergencyIf: ["מחוסר הכרה או פרכוס", "לא יכול לבלוע בבטחה", "בלבול חמור"], seeDoctorIf: ["היפו חוזר"], doNot: ["לא לתת אוכל/שתייה אם מחוסר הכרה", "אין שינוי מינון אינסולין מומצא"] },
      { summary: "Гипо: дрожь, пот, голод, спутанность; тяжёлая — судороги/бессознательное состояние. Лечить по плану диабета; неотложка если тяжело. Инсулин не менять самостоятельно здесь.", emergencyIf: ["Без сознания или судороги", "Нельзя безопасно глотать", "Тяжёлая спутанность"], seeDoctorIf: ["Повторные гипо"], doNot: ["Ничего в рот без сознания", "Не изобретать изменения доз инсулина"] }
    ),
    sources: [S.nhsHypo],
  },
  {
    id: "hyperglycaemia",
    category: "endocrine",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["hyperglycaemia", "high blood sugar", "blood sugar too high", "polyuria polydipsia diabetes"],
      fr: ["hyperglycémie", "sucre élevé", "glycémie trop haute", "soif urines fréquentes diabète"],
      he: ["היפרגליקמיה", "סוכר גבוה", "צמא והשתנה מרובה בסוכרת"],
      ru: ["гипергликемия", "высокий сахар", "жажда частое мочеиспускание диабет"],
    },
    titles: { en: "High blood sugar (hyperglycaemia)", fr: "Hyperglycémie", he: "היפרגליקמיה", ru: "Гипергликемия" },
    guidance: g(
      { summary: "High blood sugar can cause thirst, frequent urination, tiredness, blurred vision. NHS: follow diabetes sick-day rules with your care team; urgent/emergency care for vomiting, abdominal pain, fruity breath, deep breathing, confusion (possible DKA — see diabetes-sick-day-dka). Never invent insulin sliding scales here.", emergencyIf: ["Vomiting with high sugars, abdominal pain, fruity breath, deep/rapid breathing, confusion (possible DKA)", "Cannot keep fluids down with known diabetes"], seeDoctorIf: ["Persistent high readings", "Thirst and frequent urination with possible new diabetes"], doNot: ["Do not invent insulin dose adjustments", "Do not ignore DKA warning signs"] },
      { summary: "L'hyperglycémie : soif, polyurie, fatigue. Suivre le plan diabète. Urgence si signes d'acidocétose. Pas de schémas d'insuline inventés.", emergencyIf: ["Vomissements, douleur abdominale, haleine fruitée, respiration profonde, confusion (AAD possible)"], seeDoctorIf: ["Glycémies hautes persistantes", "Soif/polyurie — possible diabète nouveau"], doNot: ["Pas d'ajustements d'insuline inventés"] },
      { summary: "סוכר גבוה: צמא, השתנה מרובה, עייפות. לפי תוכנית סוכרת. חירום בסימני חמצת קטוטית. אין התאמת אינסולין מומצאת.", emergencyIf: ["הקאות, כאב בטן, ריח פירותי, נשימה עמוקה, בלבול (חשד ל־DKA)"], seeDoctorIf: ["ערכים גבוהים מתמשכים", "צמא/השתנה מרובה — סוכרת חדשה אפשרית"], doNot: ["אין התאמת אינסולין מומצאת"] },
      { summary: "Высокий сахар: жажда, частое мочеиспускание, усталость. По плану диабета. Неотложка при признаках ДКА. Схемы инсулина не выдумывать.", emergencyIf: ["Рвота, боль в животе, фруктовый запах, глубокое дыхание, спутанность (возможный ДКА)"], seeDoctorIf: ["Стойко высокие показатели", "Жажда/полиурия — возможный новый диабет"], doNot: ["Не изобретать корректировки инсулина"] }
    ),
    sources: [S.nhsHyper],
  },
  {
    id: "pre-eclampsia",
    category: "pregnancy",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["pre-eclampsia", "preeclampsia", "pregnancy headache swelling vision", "high blood pressure pregnant"],
      fr: ["pré-éclampsie", "prééclampsie", "céphalée grossesse œdème vision", "hypertension grossesse"],
      he: ["רעלת הריון", "פרה אקלמפסיה", "כאב ראש בהריון בצקת ראייה", "לחץ דם גבוה בהריון"],
      ru: ["преэклампсия", "головная боль беременность отёк зрение", "высокое давление беременность"],
    },
    titles: { en: "Pre-eclampsia cues", fr: "Pré-éclampsie — signes d'alarme", he: "רעלת הריון — דגלים", ru: "Преэклампсия — тревожные признаки" },
    guidance: g(
      { summary: "Pre-eclampsia is a pregnancy complication with high blood pressure that can be dangerous for mother and baby. NHS: seek urgent assessment for severe headache, vision problems, severe pain under ribs, sudden swelling of face/hands/feet, vomiting, or feeling very unwell in pregnancy. This is not diagnosed by chat — urgent clinical care only. No inventing antihypertensives.", emergencyIf: ["Severe headache in pregnancy", "Vision problems in pregnancy", "Severe pain under the ribs", "Sudden swelling of face/hands/feet", "Vomiting and feeling very unwell while pregnant"], seeDoctorIf: ["Any concern about blood pressure or new swelling/headache in pregnancy — same-day maternity advice"], doNot: ["Do not invent blood-pressure medicines", "Do not wait at home with severe symptoms"] },
      { summary: "La pré-éclampsie associe HTA gravidique et peut menacer mère et fœtus. Avis urgent si céphalée sévère, troubles visuels, douleur sous les côtes, œdème brutal, vomissements. Pas d'antihypertenseurs inventés.", emergencyIf: ["Céphalée sévère grossesse", "Troubles visuels", "Douleur sous les côtes", "Œdème brutal face/mains/pieds", "Vomissements / malaise grave"], seeDoctorIf: ["Toute inquiétude tension/œdème/céphalée — filière maternité le jour même"], doNot: ["Pas d'antihypertenseurs inventés"] },
      { summary: "רעלת הריון מסוכנת לאם ולעובר. ייעוץ דחוף בכאב ראש חזק, הפרעת ראייה, כאב מתחת לצלעות, בצקת פתאומית, הקאות. אין תרופות לחץ דם מומצאות.", emergencyIf: ["כאב ראש חזק בהריון", "הפרעת ראייה", "כאב חזק מתחת לצלעות", "בצקת פתאומית בפנים/ידיים/רגליים", "הקאות / הרגשה רעה מאוד"], seeDoctorIf: ["כל חשש ללחץ דם/בצקת/כאב ראש — ייעוץ יולדות באותו יום"], doNot: ["אין תרופות לחץ דם מומצאות"] },
      { summary: "Преэклампсия опасна для матери и плода. Срочно при сильной головной боли, нарушении зрения, боли под рёбрами, внезапном отёке, рвоте. Антигипертензивные не выдумывать.", emergencyIf: ["Сильная головная боль при беременности", "Нарушение зрения", "Сильная боль под рёбрами", "Внезапный отёк лица/рук/ног", "Рвота / очень плохое самочувствие"], seeDoctorIf: ["Любое беспокойство о давлении/отёке/головной боли — в тот же день к акушерам"], doNot: ["Не изобретать антигипертензивные"] }
    ),
    sources: [S.nhsPreeclampsia],
  },
  {
    id: "glue-ear",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["glue ear", "hearing muffled child", "fluid behind eardrum"],
      fr: ["otite séreuse", "oreille collée", "audition assourdie enfant"],
      he: ["אוזן דביקה", "שמיעה מעומעמת בילד", "נוזל מאחורי עור התוף"],
      ru: ["экссудативный отит", "приглушённый слух у ребёнка", "жидкость за барабанной перепонкой"],
    },
    titles: { en: "Glue ear (otitis media with effusion)", fr: "Otite séromuqueuse", he: "אוזן דביקה", ru: "Экссудативный средний отит" },
    guidance: g(
      { summary: "Glue ear is fluid behind the eardrum causing muffled hearing, often after colds in children. NHS: many cases improve; see GP/hearing check if hearing problems persist. Not the same as acute painful ear infection. No inventing decongestant or antibiotic regimens.", seeDoctorIf: ["Hearing problems lasting weeks", "Speech delay concerns with hearing", "Painful red ear with fever (possible acute infection — different pathway)"], doNot: ["Do not invent antibiotics for glue ear", "Do not ignore persistent hearing loss"] },
      { summary: "L'otite séreuse : liquide derrière le tympan, audition assourdie. Souvent amélioration ; médecin si persistance. Pas d'antibiotiques inventés.", seeDoctorIf: ["Baisse d'audition prolongée", "Retard de langage", "Oreille rouge douloureuse fébrile"], doNot: ["Pas d'antibiotiques inventés pour otite séreuse"] },
      { summary: "אוזן דביקה: נוזל מאחורי התוף, שמיעה מעומעמת. לרוב משתפר; רופא אם נמשך. אין אנטיביוטיקה מומצאת.", seeDoctorIf: ["בעיית שמיעה שנמשכת שבועות", "חשש לעיכוב שפה", "אוזן אדומה כואבת עם חום"], doNot: ["אין אנטיביוטיקה מומצאת לאוזן דביקה"] },
      { summary: "Экссудативный отит: жидкость за перепонкой, приглушённый слух. Часто проходит; врач если длится. Антибиотики не выдумывать.", seeDoctorIf: ["Проблемы со слухом неделями", "Задержка речи", "Красное болезненное ухо с лихорадкой"], doNot: ["Не изобретать антибиотики при экссудативном отите"] }
    ),
    sources: [S.nhsGlueEar],
  },
  {
    id: "mouth-ulcers",
    category: "ent",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["mouth ulcer", "canker sore", "aphthous ulcer"],
      fr: ["aphte", "ulcération buccale", "plaie dans la bouche"],
      he: ["אפטה", "כיב בפה", "פצע בפה"],
      ru: ["афта", "язва во рту", "ранка во рту"],
    },
    titles: { en: "Mouth ulcers", fr: "Aphtes", he: "אפטות / כיבים בפה", ru: "Афты / язвы во рту" },
    guidance: g(
      { summary: "Most mouth ulcers heal in 1–2 weeks. NHS: soft foods, avoid spicy/acidic triggers; pharmacy gels. See dentist/GP if lasting >3 weeks, unusual, bleeding/more painful, or ulcers elsewhere/joints swollen. No inventing steroid mouth regimens.", seeDoctorIf: ["Ulcer lasting longer than 3 weeks", "Different/larger than usual", "Bleeding or increasingly painful/red", "Ulcers elsewhere on body or painful swollen joints"], selfCare: ["Soft toothbrush; cool drinks; soft foods; pharmacy mouth treatments"], doNot: ["Do not invent steroid mouth sprays/tablets", "Do not ignore ulcers >3 weeks"] },
      { summary: "Les aphtes guérissent souvent en 1–2 semaines. Aliments doux ; pharmacie. Dentiste/médecin si >3 semaines ou atypique. Pas de corticoïdes buccaux inventés.", seeDoctorIf: ["Aphte > 3 semaines", "Plus gros/atypique", "Saignement / plus douloureux", "Autres ulcères / articulations"], selfCare: ["Brosse souple ; aliments mous ; traitements pharmacie"], doNot: ["Pas de corticoïdes buccaux inventés"] },
      { summary: "אפטות לרוב נרפאות תוך 1–2 שבועות. מזון רך; בית מרקחת. רופא שיניים/רופא אם מעל 3 שבועות או חריג. אין סטרואידים לפה מומצאים.", seeDoctorIf: ["כיב מעל 3 שבועות", "חריג/גדול מהרגיל", "דימום / כואב יותר", "כיבים במקומות אחרים / מפרקים"], selfCare: ["מברשת רכה; מזון רך; טיפול בית מרקחת"], doNot: ["אין סטרואידים לפה מומצאים"] },
      { summary: "Афты обычно заживают за 1–2 недели. Мягкая еда; аптека. Стоматолог/врач если >3 недель или атипично. Стероиды для рта не выдумывать.", seeDoctorIf: ["Язва >3 недель", "Необычная/крупнее", "Кровотечение / больнее", "Язвы на теле / суставы"], selfCare: ["Мягкая щётка; мягкая еда; аптечные средства"], doNot: ["Не изобретать стероиды для рта"] }
    ),
    sources: [S.nhsMouthUlcers],
  },
  {
    id: "boils-skin",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["boil", "furuncle", "painful pus bump skin"],
      fr: ["furoncle", "bouton à pus douloureux", "abcès cutané petit"],
      he: ["מורסה בעור", "פרונקל", "בליטה מוגלתית כואבת"],
      ru: ["фурункул", "чирей", "болезненный гнойный бугорок"],
    },
    titles: { en: "Boils (furuncles)", fr: "Furoncles", he: "מורסות / פרונקלים", ru: "Фурункулы" },
    guidance: g(
      { summary: "Boils are painful pus-filled skin lumps. NHS: warm compresses; do not squeeze; pharmacy/GP if large, fever, spreading redness, on face, or recurrent. Antibiotics/drainage are clinician decisions — no invented regimens.", seeDoctorIf: ["Large or worsening boil", "Fever", "Spreading redness", "Boil on the face", "Recurrent boils"], selfCare: ["Warm compress; keep clean; do not squeeze"], doNot: ["Do not squeeze or lance at home", "Do not invent antibiotic courses"] },
      { summary: "Le furoncle est une bosse douloureuse à pus. Compresses tièdes ; ne pas percer. Médecin si gros, fièvre, rougeur extensive, visage, récidives. Pas d'antibiotiques inventés.", seeDoctorIf: ["Gros/aggravé", "Fièvre", "Rougeur qui s'étend", "Sur le visage", "Récidives"], selfCare: ["Compresse tiède ; ne pas presser"], doNot: ["Ne pas percer à domicile"] },
      { summary: "מורסה: בליטה כואבת עם מוגלה. קומפרסים חמים; לא לסחוט. רופא אם גדול, חום, אודם מתפשט, בפנים, חוזר. אין אנטיביוטיקה מומצאת.", seeDoctorIf: ["גדול/מחמיר", "חום", "אודם מתפשט", "בפנים", "חוזר"], selfCare: ["קומפרס חם; לא לסחוט"], doNot: ["לא לפתוח בבית"] },
      { summary: "Фурункул: болезненный гнойный бугорок. Тёплые компрессы; не выдавливать. Врач если крупный, лихорадка, краснота, на лице, рецидивы. Антибиотики не выдумывать.", seeDoctorIf: ["Крупный/ухудшается", "Лихорадка", "Распространяющаяся краснота", "На лице", "Рецидивы"], selfCare: ["Тёплый компресс; не выдавливать"], doNot: ["Не вскрывать дома"] }
    ),
    sources: [S.nhsBoils],
  },
  {
    id: "frostbite",
    category: "trauma",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["frostbite", "frozen fingers white hard", "frost bitten toes"],
      fr: ["engelure grave", "frostbite", "doigts gelés blancs durs"],
      he: ["כוויית קור", "אצבעות קפואות לבנות קשות"],
      ru: ["отморожение", "замёрзшие белые твёрдые пальцы"],
    },
    titles: { en: "Frostbite", fr: "Gelure (frostbite)", he: "כוויית קור (פרוסטבייט)", ru: "Отморожение" },
    guidance: g(
      { summary: "Frostbite injures skin/tissues from freezing cold. NHS: get out of the cold; warm gradually with body heat/warm (not hot) water if advised; do not rub with snow or use direct heat; seek medical care for white/hard/numb areas, blisters, or severe pain on rewarming. Emergency for extensive injury or hypothermia signs.", emergencyIf: ["Extensive frostbite", "Signs of hypothermia (confusion, severe shivering then stopping, drowsiness)", "Blackened tissue or loss of sensation over large area"], seeDoctorIf: ["White, hard, numb skin after cold exposure", "Blisters after rewarming"], selfCare: ["Move to warmth; remove wet clothes; warm gradually; protect from refreezing"], doNot: ["Do not rub with snow", "Do not use direct fire/heaters on the area", "Do not walk on frostbitten feet if avoidable"] },
      { summary: "La gelure : sortir du froid ; réchauffer progressivement ; ne pas frotter avec de la neige ni chaleur directe. Soins médicaux si zones blanches/dures. Urgence si étendu/hypothermie.", emergencyIf: ["Gelure étendue", "Signes d'hypothermie"], seeDoctorIf: ["Peau blanche/dure/insensible", "Cloques au réchauffement"], selfCare: ["Se mettre au chaud ; vêtements secs ; réchauffement progressif"], doNot: ["Ne pas frotter avec de la neige", "Pas de chaleur directe"] },
      { summary: "כוויית קור: לצאת מהקור; לחמם בהדרגה; לא לשפשף בשלג ולא חום ישיר. טיפול רפואי באזורים לבנים/קשים. חירום אם נרחב/היפותרמיה.", emergencyIf: ["כוויה נרחבת", "סימני היפותרמיה"], seeDoctorIf: ["עור לבן/קשה/חסר תחושה", "שלפוחיות אחרי חימום"], selfCare: ["לחום; בגדים יבשים; חימום הדרגתי"], doNot: ["לא לשפשף בשלג", "לא חום ישיר"] },
      { summary: "Отморожение: уйти с холода; согревать постепенно; не тереть снегом и не греть напрямую. Врач при белых/твёрдых участках. Неотложка при обширном поражении/гипотермии.", emergencyIf: ["Обширное отморожение", "Признаки гипотермии"], seeDoctorIf: ["Белая/твёрдая/онемевшая кожа", "Пузыри после согревания"], selfCare: ["В тепло; сухая одежда; постепенное согревание"], doNot: ["Не тереть снегом", "Не прямой огонь/обогреватель"] }
    ),
    sources: [S.nhsFrostbite],
  },
  {
    id: "chilblains",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["chilblains", "itchy red toes after cold", "perniosis"],
      fr: ["engelures", "orteils rouges qui démangent après le froid", "perniones"],
      he: ["צ'ילבליינס", "אצבעות אדומות מגרדות אחרי קור"],
      ru: ["ознобление", "красные зудящие пальцы после холода"],
    },
    titles: { en: "Chilblains", fr: "Engelures", he: "צ'ילבליינס / כוויות קור קלות", ru: "Ознобление" },
    guidance: g(
      { summary: "Chilblains are itchy, red/purple swellings on extremities after cold. NHS: gentle rewarming, avoid scratching, moisturise; see GP if not improving, infected, or diabetes/poor circulation. Not the same as deep frostbite.", seeDoctorIf: ["Not improving", "Signs of infection", "Diabetes or poor circulation with chilblains"], selfCare: ["Warm gradually; loose warm clothing; moisturise; avoid direct heat and scratching"], doNot: ["Do not massage vigorously or use direct heat", "Do not ignore spreading infection"] },
      { summary: "Les engelures démangent après le froid. Réchauffement doux ; médecin si infection ou terrain à risque. Différent de la gelure profonde.", seeDoctorIf: ["Pas d'amélioration", "Infection", "Diabète / mauvaise circulation"], selfCare: ["Réchauffer doucement ; hydrater ; éviter chaleur directe"], doNot: ["Pas de massage vigoureux / chaleur directe"] },
      { summary: "צ'ילבליינס: נפיחות מגרדות אחרי קור. חימום עדין; רופא אם זיהום או סוכרת. שונה מכוויית קור עמוקה.", seeDoctorIf: ["אין שיפור", "זיהום", "סוכרת / סירקולציה לקויה"], selfCare: ["חימום עדין; לחות; להימנע מחום ישיר"], doNot: ["לא עיסוי חזק / חום ישיר"] },
      { summary: "Ознобление: зудящие красные припухлости после холода. Мягкое согревание; врач при инфекции или диабете. Не глубокое отморожение.", seeDoctorIf: ["Нет улучшения", "Инфекция", "Диабет / плохое кровообращение"], selfCare: ["Мягко согревать; увлажнять; без прямого тепла"], doNot: ["Не сильный массаж / прямое тепло"] }
    ),
    sources: [S.nhsChilblains],
  },
  {
    id: "motion-sickness",
    category: "general",
    urgencyDefault: "auto_soins",
    priority: 1,
    keywords: {
      en: ["motion sickness", "car sick", "seasick", "travel nausea"],
      fr: ["mal des transports", "nausée en voiture", "mal de mer"],
      he: ["מחלת נסיעה", "בחילה ברכב", "מחלת ים"],
      ru: ["укачивание", "тошнота в машине", "морская болезнь"],
    },
    titles: { en: "Motion sickness", fr: "Mal des transports", he: "מחלת נסיעה", ru: "Укачивание" },
    guidance: g(
      { summary: "Motion sickness causes nausea on travel. NHS: look at the horizon, fresh air, sit where motion is least; pharmacy travel sickness medicines if suitable. See a GP if severe/persistent beyond travel. No inventing prescription antiemetic regimens.", seeDoctorIf: ["Severe symptoms not helped by pharmacy options", "Vertigo/hearing symptoms suggesting inner-ear disease"], selfCare: ["Face forward; horizon focus; fresh air; small snacks; pharmacy advice on travel tablets"], doNot: ["Do not invent prescription antiemetic doses", "Do not drive if medicines cause drowsiness"] },
      { summary: "Le mal des transports provoque des nausées. Horizon, air frais ; médicaments pharmacie si adaptés. Pas d'antiémétiques de prescription inventés.", seeDoctorIf: ["Symptômes sévères malgré pharmacie", "Vertige/audition évocateurs d'oreille interne"], selfCare: ["Regarder l'horizon ; air frais ; avis pharmacien"], doNot: ["Pas d'antiémétiques inventés"] },
      { summary: "מחלת נסיעה: בחילה בנסיעה. להסתכל לאופק, אוויר צח; תרופות בית מרקחת. אין נוגדי הקאה מרשם מומצאים.", seeDoctorIf: ["תסמינים חזקים למרות בית מרקחת", "ורטיגו/שמיעה החשודים לאוזן פנימית"], selfCare: ["אופק; אוויר צח; ייעוץ רוקח"], doNot: ["אין נוגדי הקאה מומצאים"] },
      { summary: "Укачивание: тошнота в поездке. Смотреть на горизонт, свежий воздух; аптечные средства. Рецептурные противорвотные не выдумывать.", seeDoctorIf: ["Тяжёлые симптомы несмотря на аптеку", "Вертиго/слух как при болезни внутреннего уха"], selfCare: ["Горизонт; свежий воздух; фармацевт"], doNot: ["Не изобретать рецептурные противорвотные"] }
    ),
    sources: [S.nhsMotion],
  },
  {
    id: "insomnia",
    category: "psych",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["insomnia", "cannot sleep", "lying awake all night"],
      fr: ["insomnie", "n'arrive pas à dormir", "éveillé toute la nuit"],
      he: ["נדודי שינה", "לא מצליח להירדם", "ער כל הלילה"],
      ru: ["бессонница", "не могу уснуть", "не сплю всю ночь"],
    },
    titles: { en: "Insomnia (sleep difficulty)", fr: "Insomnie", he: "נדודי שינה", ru: "Бессонница" },
    guidance: g(
      { summary: "Insomnia is difficulty falling or staying asleep. NHS: sleep hygiene (regular schedule, wind-down, limit caffeine/screens); GP if lasting weeks or affecting life. Sleeping tablets are clinician-prescribed short-term only — never invent regimens. Screen for depression/anxiety/crisis separately.", seeDoctorIf: ["Sleep problems lasting weeks", "Daytime function severely affected", "Possible depression/anxiety contributing"], selfCare: ["Regular sleep/wake times; dark cool room; limit caffeine/alcohol late; wind-down routine"], doNot: ["Do not invent hypnotic/benzodiazepine regimens", "Do not use alcohol as a sleep aid"] },
      { summary: "L'insomnie gêne l'endormissement/maintien du sommeil. Hygiène du sommeil ; médecin si prolongé. Pas d'hypnotiques inventés.", seeDoctorIf: ["Problèmes de sommeil depuis des semaines", "Retentissement diurne majeur"], selfCare: ["Horaires réguliers ; limiter caféine/écrans"], doNot: ["Pas d'hypnotiques/benzodiazépines inventés"] },
      { summary: "נדודי שינה: קושי להירדם/לישון. היגיינת שינה; רופא אם ממושך. אין כדורי שינה מומצאים.", seeDoctorIf: ["בעיות שינה במשך שבועות", "פגיעה בתפקוד יומי"], selfCare: ["שעות קבועות; להגביל קפאין/מסכים"], doNot: ["אין כדורי שינה/בנזודיאזפינים מומצאים"] },
      { summary: "Бессонница: трудно заснуть/спать. Гигиена сна; врач если длится. Снотворные не выдумывать.", seeDoctorIf: ["Проблемы со сном неделями", "Сильное нарушение дневной жизни"], selfCare: ["Режим; ограничить кофеин/экраны"], doNot: ["Не изобретать снотворные/бензодиазепины"] }
    ),
    sources: [S.nhsInsomnia],
  },
  {
    id: "hiccups-persistent",
    category: "general",
    urgencyDefault: "auto_soins",
    priority: 1,
    keywords: {
      en: ["hiccups", "hiccoughs lasting", "cannot stop hiccuping"],
      fr: ["hoquet", "hoquet qui dure", "n'arrive pas à arrêter le hoquet"],
      he: ["שיהוקים", "שיהוקים שנמשכים", "לא מצליח להפסיק לשיהק"],
      ru: ["икота", "длительная икота", "не могу остановить икоту"],
    },
    titles: { en: "Hiccups", fr: "Hoquet", he: "שיהוקים", ru: "Икота" },
    guidance: g(
      { summary: "Short hiccup bouts are common. NHS: sip cold water, breathe into a paper bag carefully if advised for brief spells, hold breath briefly — evidence is limited. See a GP if lasting >48 hours or with chest/abdominal pain, shortness of breath, or vomiting. No inventing chlorpromazine doses.", seeDoctorIf: ["Hiccups lasting more than 48 hours", "Hiccups with chest/abdominal pain, breathlessness, or vomiting"], selfCare: ["Sip cold water; gentle breath-holding; avoid large meals/alcohol triggers"], doNot: ["Do not invent prescription hiccup medicines", "Do not rebreath into a bag if you have breathing/heart problems without advice"] },
      { summary: "Le hoquet court est fréquent. Boire de l'eau froide. Médecin si >48 h ou douleur/dyspnée/vomissements. Pas de médicaments inventés.", seeDoctorIf: ["Hoquet > 48 h", "Avec douleur/dyspnée/vomissements"], selfCare: ["Eau froide ; éviter gros repas/alcool"], doNot: ["Pas de médicaments de prescription inventés"] },
      { summary: "שיהוקים קצרים נפוצים. לגימות מים קרים. רופא אם מעל 48 שעות או עם כאב/קוצר נשימה/הקאות. אין תרופות מומצאות.", seeDoctorIf: ["שיהוקים מעל 48 שעות", "עם כאב/קוצר נשימה/הקאות"], selfCare: ["מים קרים; להימנע מארוחות גדולות/אלכוהול"], doNot: ["אין תרופות מרשם מומצאות"] },
      { summary: "Короткая икота обычна. Глотки холодной воды. Врач если >48 ч или с болью/одышкой/рвотой. Лекарства не выдумывать.", seeDoctorIf: ["Икота >48 ч", "С болью/одышкой/рвотой"], selfCare: ["Холодная вода; избегать больших приёмов пищи/алкоголя"], doNot: ["Не изобретать рецептурные средства от икоты"] }
    ),
    sources: [S.nhsHiccups],
  },
  {
    id: "asthma-inhaler-technique",
    category: "respiratory",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["inhaler technique", "how to use inhaler", "spacer inhaler", "asthma inhaler not working"],
      fr: ["technique d'inhalateur", "comment utiliser inhalateur", "chambre d'inhalation", "inhalateur asthme inefficace"],
      he: ["טכניקת משאף", "איך להשתמש במשאף", "ספייסר למשאף", "משאף אסתמה לא עובד"],
      ru: ["техника ингалятора", "как пользоваться ингалятором", "спейсер", "ингалятор астмы не помогает"],
    },
    titles: { en: "Asthma inhaler technique (orientation)", fr: "Technique d'inhalateur (orientation)", he: "טכניקת משאף אסתמה (הכוונה)", ru: "Техника ингалятора при астме (ориентация)" },
    guidance: g(
      { summary: "Poor inhaler technique is a common reason treatment seems ineffective. NHS: ask a pharmacist/nurse/GP to check technique and spacer use. For acute asthma attack follow the separate asthma-attack entry / emergency care. This pack never invents puff counts or steroid doses.", emergencyIf: ["Asthma attack with severe breathlessness, cannot speak, blue lips — emergency pathway"], seeDoctorIf: ["Inhaler seems ineffective", "Need technique check or spacer advice", "Increasing reliever use"], doNot: ["Do not invent inhaler doses or oral steroid courses", "Do not skip seeking help for a severe attack"] },
      { summary: "Une mauvaise technique d'inhalateur diminue l'efficacité. Faire vérifier en pharmacie/cabinet. Crise d'asthme sévère = urgence. Pas de posologies inventées.", emergencyIf: ["Crise d'asthme sévère — filière urgence"], seeDoctorIf: ["Inhalateur inefficace", "Besoin de vérifier la technique / chambre"], doNot: ["Pas de doses d'inhalateur/corticoïdes inventées"] },
      { summary: "טכניקת משאף לקויה מפחיתה יעילות. לבדוק אצל רוקח/אחות/רופא. התקף חמור — חירום. אין מינונים מומצאים.", emergencyIf: ["התקף אסתמה חמור — מסלול חירום"], seeDoctorIf: ["משאף לא יעיל", "צורך בבדיקת טכניקה / ספייסר"], doNot: ["אין מינון משאף/סטרואידים מומצא"] },
      { summary: "Плохая техника ингалятора снижает эффект. Проверить у фармацевта/медсестры/врача. Тяжёлый приступ — неотложка. Дозы не выдумывать.", emergencyIf: ["Тяжёлый приступ астмы — неотложный путь"], seeDoctorIf: ["Ингалятор не помогает", "Нужна проверка техники / спейсера"], doNot: ["Не изобретать дозы ингалятора/стероидов"] }
    ),
    sources: [S.nhsAsthma],
  },
];

for (const e of entries) {
  for (const lang of ["en", "fr", "he", "ru"]) {
    const g0 = e.guidance[lang];
    if (Array.isArray(g0.emergencyIf) && g0.emergencyIf.length === 0) delete g0.emergencyIf;
  }
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
meta.version = "1.5.0";
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

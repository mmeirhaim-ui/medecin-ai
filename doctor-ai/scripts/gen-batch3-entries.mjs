#!/usr/bin/env node
/**
 * Batch 3 knowledge entries — paraphrased from public NHS/WHO/CDC/MedlinePlus pages only.
 */
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsAlcohol: { id: "nhs-alcohol-use", name: "NHS — Alcohol-use disorder", org: "NHS", url: "https://www.nhs.uk/conditions/alcohol-use-disorder/", retrievedAt: R },
  nhsConfusion: { id: "nhs-confusion", name: "NHS — Sudden confusion (delirium)", org: "NHS", url: "https://www.nhs.uk/symptoms/confusion/", retrievedAt: R },
  nhsHeadInjury: { id: "nhs-head-injury", name: "NHS — Head injury and concussion", org: "NHS", url: "https://www.nhs.uk/conditions/head-injury-and-concussion/", retrievedAt: R },
  nhsMalaria: { id: "nhs-malaria", name: "NHS — Malaria", org: "NHS", url: "https://www.nhs.uk/conditions/malaria/", retrievedAt: R },
  nhsVaccines: { id: "nhs-vaccinations", name: "NHS — Vaccinations and when to have them", org: "NHS", url: "https://www.nhs.uk/vaccinations/nhs-vaccinations-and-when-to-have-them/", retrievedAt: R },
  nhsEctopic: { id: "nhs-ectopic", name: "NHS — Ectopic pregnancy", org: "NHS", url: "https://www.nhs.uk/conditions/ectopic-pregnancy/", retrievedAt: R },
  nhsPid: { id: "nhs-pid", name: "NHS — Pelvic inflammatory disease", org: "NHS", url: "https://www.nhs.uk/conditions/pelvic-inflammatory-disease-pid/", retrievedAt: R },
  nhsMenopause: { id: "nhs-menopause", name: "NHS — Symptoms of menopause and perimenopause", org: "NHS", url: "https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/", retrievedAt: R },
  nhsOsteo: { id: "nhs-osteoporosis", name: "NHS — Osteoporosis", org: "NHS", url: "https://www.nhs.uk/conditions/osteoporosis/", retrievedAt: R },
  nhsAnxiety: { id: "nhs-anxiety-panic", name: "NHS — Anxiety, fear or panic", org: "NHS", url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/", retrievedAt: R },
  nhsDepression: { id: "nhs-depression-low-mood", name: "NHS — Low mood, sadness or depression", org: "NHS", url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-sadness-depression/", retrievedAt: R },
  nhsChickenpox: { id: "nhs-chickenpox", name: "NHS — Chickenpox", org: "NHS", url: "https://www.nhs.uk/conditions/chickenpox/", retrievedAt: R },
  nhsMeasles: { id: "nhs-measles", name: "NHS — Measles", org: "NHS", url: "https://www.nhs.uk/conditions/measles/", retrievedAt: R },
  nhsWhooping: { id: "nhs-whooping-cough", name: "NHS — Whooping cough", org: "NHS", url: "https://www.nhs.uk/conditions/whooping-cough/", retrievedAt: R },
  nhsBrokenBone: { id: "nhs-broken-bone", name: "NHS — Broken bone (fracture)", org: "NHS", url: "https://www.nhs.uk/conditions/broken-bone/", retrievedAt: R },
  nhsNeckPain: { id: "nhs-neck-pain", name: "NHS — Neck pain and stiff neck", org: "NHS", url: "https://www.nhs.uk/symptoms/neck-pain-and-stiff-neck/", retrievedAt: R },
  nhsWhiplash: { id: "nhs-whiplash", name: "NHS — Whiplash", org: "NHS", url: "https://www.nhs.uk/conditions/whiplash/", retrievedAt: R },
  nhsHeavyPeriods: { id: "nhs-heavy-periods", name: "NHS — Heavy periods", org: "NHS", url: "https://www.nhs.uk/conditions/heavy-periods/", retrievedAt: R },
  nhsSeizures: { id: "nhs-seizures-help", name: "NHS — What to do if someone has a seizure (fit)", org: "NHS", url: "https://www.nhs.uk/conditions/what-to-do-if-someone-has-a-seizure-fit/", retrievedAt: R },
  nhsVertigo: { id: "nhs-vertigo", name: "NHS — Vertigo", org: "NHS", url: "https://www.nhs.uk/conditions/vertigo/", retrievedAt: R },
  nhsBell: { id: "nhs-bells-palsy", name: "NHS — Bell's palsy", org: "NHS", url: "https://www.nhs.uk/conditions/bells-palsy/", retrievedAt: R },
  nhsFalls: { id: "nhs-falls", name: "NHS — Falls", org: "NHS", url: "https://www.nhs.uk/conditions/falls/", retrievedAt: R },
  nhsSciatica: { id: "nhs-sciatica", name: "NHS — Sciatica", org: "NHS", url: "https://www.nhs.uk/conditions/sciatica/", retrievedAt: R },
  nhsGout: { id: "nhs-gout", name: "NHS — Gout", org: "NHS", url: "https://www.nhs.uk/conditions/gout/", retrievedAt: R },
  nhsThrush: { id: "nhs-thrush", name: "NHS — Thrush in men and women", org: "NHS", url: "https://www.nhs.uk/conditions/thrush-in-men-and-women/", retrievedAt: R },
  nhsPostmenoBleed: { id: "nhs-postmenopausal-bleeding", name: "NHS — Postmenopausal bleeding", org: "NHS", url: "https://www.nhs.uk/conditions/post-menopausal-bleeding/", retrievedAt: R },
  medlineEmerg: { id: "medlineplus-emergencies", name: "MedlinePlus — Recognizing medical emergencies", org: "MedlinePlus", url: "https://medlineplus.gov/ency/article/001927.htm", retrievedAt: R },
  whoDepression: { id: "who-depression", name: "WHO — Depression fact sheet", org: "WHO", url: "https://www.who.int/news-room/fact-sheets/detail/depression", retrievedAt: R },
  cdcTravel: { id: "cdc-travelers-health", name: "CDC — Travelers' Health", org: "CDC", url: "https://wwwnc.cdc.gov/travel", retrievedAt: R },
  cdcMalaria: { id: "cdc-malaria", name: "CDC — Malaria", org: "CDC", url: "https://www.cdc.gov/malaria/index.html", retrievedAt: R },
  whoMeasles: { id: "who-measles", name: "WHO — Measles fact sheet", org: "WHO", url: "https://www.who.int/news-room/fact-sheets/detail/measles", retrievedAt: R },
};

function entry(partial) {
  return partial;
}

const entries = [
  entry({
    id: "alcohol-withdrawal",
    category: "psych",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["alcohol withdrawal", "delirium tremens", "DT alcohol", "stop drinking shaking", "alcohol seizure", "alcohol hallucinations"],
      fr: ["sevrage alcool", "delirium tremens", "tremblements arrêt alcool", "convulsion alcool", "hallucinations alcool"],
      he: ["גמילה מאלכוהול", "דליריום טרמנס", "רעד מהפסקת שתייה", "פרכוס מאלכוהול", "הזיות מאלכוהול"],
      ru: ["абстиненция алкоголь", "белая горячка", "тремор при отмене алкоголя", "судороги от алкоголя", "алкогольный делирий"],
    },
    titles: { en: "Alcohol withdrawal (severe)", fr: "Sevrage alcoolique (sévère)", he: "גמילה מאלכוהול (חמורה)", ru: "Алкогольная абстиненция (тяжёлая)" },
    guidance: g(
      { summary: "Stopping suddenly when alcohol-dependent can be dangerous. Severe withdrawal (visible shaking, confusion, hallucinations, seizure) needs emergency care. Get medical help before trying to stop if you get withdrawal symptoms. Educational NHS framing — not a detox protocol.", emergencyIf: ["Visible shaking after stopping alcohol", "Unusually restless, irritable or upset with severe withdrawal", "Confusion (e.g. not knowing the day)", "Hallucinations", "Seizure"], seeDoctorIf: ["Any withdrawal symptoms — get medical help before trying to stop", "Anxiety, insomnia, nausea, racing heart, sweating, tremor after cutting down"], doNot: ["Do not attempt unsupported abrupt detox if dependent", "Do not invent benzodiazepine regimens here"] },
      { summary: "Arrêter brutalement en cas de dépendance à l'alcool peut être dangereux. Sevrage sévère (tremblements, confusion, hallucinations, convulsion) = urgence. Pas de protocole de sevrage ici.", emergencyIf: ["Tremblements visibles", "Confusion", "Hallucinations", "Convulsion", "Agitation sévère"], seeDoctorIf: ["Tout symptôme de sevrage — avis médical avant d'arrêter"], doNot: ["Pas de sevrage brutal non encadré", "Pas de benzodiazépines inventées"] },
      { summary: "הפסקה פתאומית בתלות באלכוהול עלולה להיות מסוכנת. גמילה חמורה (רעד, בלבול, הזיות, פרכוס) — חירום. אין פרוטוקול גמילה כאן.", emergencyIf: ["רעד בולט", "בלבול", "הזיות", "פרכוס"], seeDoctorIf: ["כל תסמיני גמילה — ייעוץ לפני הפסקה"], doNot: ["לא לגמול לבד בתלות", "אין מינון לבנזודיאזפינים"] },
      { summary: "Резкая отмена при алкогольной зависимости опасна. Тяжёлая абстиненция (тремор, спутанность, галлюцинации, судороги) — неотложная помощь. Здесь нет протокола детокса.", emergencyIf: ["Видимый тремор", "Спутанность", "Галлюцинации", "Судороги"], seeDoctorIf: ["Любые симптомы отмены — к врачу до попытки бросить"], doNot: ["Не бросайте резко без медпомощи при зависимости", "Не изобретать дозы бензодиазепинов"] }
    ),
    sources: [S.nhsAlcohol],
  }),
  entry({
    id: "delirium-sudden-confusion",
    category: "neuro",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["sudden confusion", "delirium", "disoriented suddenly", "acute confusion elderly"],
      fr: ["confusion soudaine", "délire aigu", "désorientation brutale", "confusion personne âgée"],
      he: ["בלבול פתאומי", "דליריום", "דיסאוריינטציה פתאומית", "בלבול חד בקשיש"],
      ru: ["внезапная спутанность", "делирий", "острая дезориентация", "спутанность у пожилых"],
    },
    titles: { en: "Sudden confusion (delirium)", fr: "Confusion soudaine (délire)", he: "בלבול פתאומי (דליריום)", ru: "Внезапная спутанность (делирий)" },
    guidance: g(
      { summary: "Sudden confusion needs immediate medical assessment — causes can be life-threatening (infection, stroke, low sugar, head injury, medicines, alcohol/CO). Do not self-diagnose. NHS: go to A&E or call emergency services.", emergencyIf: ["Someone suddenly becomes confused or delirious", "Cannot think/speak clearly, disoriented, hallucinations with sudden onset"], seeDoctorIf: ["New or fluctuating confusion in an older person — urgent clinical review"], doNot: ["Do not assume dementia for sudden onset", "Do not delay emergency assessment"] },
      { summary: "Une confusion soudaine nécessite une évaluation immédiate (infection, AVC, hypoglycémie, traumatisme, médicaments, alcool/CO). Ne pas s'autodiagnostiquer.", emergencyIf: ["Confusion ou délire d'apparition brutale"], seeDoctorIf: ["Confusion nouvelle ou fluctuante chez la personne âgée"], doNot: ["Ne pas confondre avec démence d'emblée"] },
      { summary: "בלבול פתאומי דורש הערכה מיידית — גורמים עלולים לסכן חיים. לא לאבחן לבד.", emergencyIf: ["בלבול או דליריום שמתחיל בפתאומיות"], seeDoctorIf: ["בלבול חדש או משתנה בקשיש"], doNot: ["לא להניח שזו דמנציה אם ההתחלה פתאומית"] },
      { summary: "Внезапная спутанность требует немедленной оценки — причины могут быть жизнеугрожающими. Не занимайтесь самодиагностикой.", emergencyIf: ["Внезапная спутанность или делирий"], seeDoctorIf: ["Новая или флюктуирующая спутанность у пожилого"], doNot: ["Не считать сразу деменцией при внезапном начале"] }
    ),
    sources: [S.nhsConfusion, S.medlineEmerg],
  }),
  entry({
    id: "head-injury-concussion",
    category: "neuro",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["head injury", "concussion", "hit head", "knocked out", "fall hit head"],
      fr: ["traumatisme crânien", "commotion cérébrale", "coup à la tête", "perte de connaissance après chute", "choc tête"],
      he: ["חבלת ראש", "זעזוע מוח", "מכה בראש", "איבוד הכרה אחרי נפילה"],
      ru: ["травма головы", "сотрясение мозга", "удар головой", "потеря сознания после падения"],
    },
    titles: { en: "Head injury / concussion red flags", fr: "Traumatisme crânien / commotion — signes d'alarme", he: "חבלת ראש / זעזוע מוח — דגלים אדומים", ru: "Травма головы / сотрясение — красные флаги" },
    guidance: g(
      { summary: "Most head injuries are not serious, but some need emergency care (not waking, seizure, high fall, CSF from ears/nose, new weakness, high-speed impact). Vomiting/dizziness after injury warrants urgent advice. Educational NHS framing.", emergencyIf: ["Knocked out and not woken up", "Cannot stay awake", "Seizure", "Fall >1 metre or 5 stairs", "Vision/hearing problems", "Clear fluid from ears/nose", "Bleeding from ears or bruising behind ears", "New numbness/weakness", "Problems walking/speaking/understanding", "High-speed impact", "Dent in head or object in wound"], seeDoctorIf: ["Vomiting, dizziness, blood thinners, alcohol/drugs at time of injury"], selfCare: ["Ice pack wrapped for swelling; rest; adult supervision first 24h", "Paracetamol for headache per label", "No contact sports ≥3 weeks; no alcohol until better"], doNot: ["Do not drive until recovered", "Do not take sleeping pills unless clinician advised"] },
      { summary: "La plupart des chocs à la tête sont bénins, mais certains signes imposent les urgences (ne se réveille pas, convulsion, chute haute, liquide clair oreilles/nez, déficit).", emergencyIf: ["Ne se réveille pas", "Ne reste pas éveillé", "Convulsion", "Chute > 1 m / 5 marches", "Trouble vision/audition", "Liquide clair oreilles/nez", "Faiblesse/engourdissement nouveau", "Impact haute vitesse"], seeDoctorIf: ["Vomissements, vertiges, anticoagulants, alcool au moment du trauma"], selfCare: ["Glace enveloppée ; repos ; surveillance 24 h"], doNot: ["Ne pas conduire tant que non rétabli"] },
      { summary: "רוב חבלות הראש קלות, אך יש סימנים שדורשים חירום (לא מתעורר, פרכוס, נפילה מגובה, נוזל שקוף מאוזניים/אף, חולשה חדשה).", emergencyIf: ["לא מתעורר", "לא נשאר ער", "פרכוס", "נפילה מעל מטר / 5 מדרגות", "הפרעת ראייה/שמיעה", "נוזל שקוף מאוזן/אף", "חולשה/נימול חדש"], seeDoctorIf: ["הקאות, סחרחורת, מדללי דם"], selfCare: ["קרח עטוף; מנוחה; השגחה 24 שעות"], doNot: ["לא לנהוג עד החלמה"] },
      { summary: "Большинство травм головы несерьёзны, но есть признаки неотложности (не просыпается, судороги, падение с высоты, прозрачная жидкость из ушей/носа, новая слабость).", emergencyIf: ["Не просыпается", "Не может бодрствовать", "Судороги", "Падение >1 м / 5 ступеней", "Проблемы со зрением/слухом", "Прозрачная жидкость из ушей/носа", "Новая слабость/онемение"], seeDoctorIf: ["Рвота, головокружение, антикоагулянты"], selfCare: ["Лёд в ткани; покой; наблюдение 24 ч"], doNot: ["Не водить до восстановления"] }
    ),
    sources: [S.nhsHeadInjury],
  }),
  entry({
    id: "malaria-travel-fever",
    category: "travel",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["malaria", "fever after travel", "tropical fever", "mosquito fever travel", "returned from Africa fever"],
      fr: ["paludisme", "fièvre après voyage", "fièvre tropicaux", "moustique voyage fièvre", "retour Afrique fièvre"],
      he: ["מלריה", "חום אחרי טיול", "חום טרופי", "קדחת יתושים נסיעה", "חזרתי מאפריקה עם חום"],
      ru: ["малярия", "лихорадка после поездки", "тропическая лихорадка", "комары путешествие жар", "вернулся из Африки с температурой"],
    },
    titles: { en: "Fever after travel / malaria concern", fr: "Fièvre après voyage / suspicion de paludisme", he: "חום אחרי נסיעה / חשד למלריה", ru: "Лихорадка после поездки / подозрение на малярию" },
    guidance: g(
      { summary: "Fever during or after travel to malaria-risk areas is a medical emergency until proven otherwise. Seek urgent care and say where you travelled. Prevention (bite avoidance, chemoprophylaxis when advised) is clinician-guided — this pack does not prescribe antimalarials.", emergencyIf: ["Fever, chills, headache, muscle pain, vomiting after travel to a malaria area", "Symptoms can appear weeks after return"], seeDoctorIf: ["Any fever after tropical/subtropical travel — same-day assessment", "Travel clinic advice before trips to risk areas"], doNot: ["Do not wait for 'just a cold' if recently in a malaria zone", "Do not invent antimalarial doses"] },
      { summary: "Une fièvre pendant ou après un séjour en zone de paludisme est une urgence jusqu'à preuve du contraire. Dire où vous avez voyagé. Pas de posologie d'antipaludéens ici.", emergencyIf: ["Fièvre, frissons, céphalées, myalgies, vomissements après voyage en zone à risque"], seeDoctorIf: ["Toute fièvre après voyage tropical — avis le jour même", "Consultation voyage avant le départ"], doNot: ["Ne pas attendre", "Pas de doses d'antipaludéens inventées"] },
      { summary: "חום במהלך או אחרי שהייה באזור מלריה הוא חירום עד שיוכח אחרת. ציינו לאן נסעתם. אין מינון תרופות נגד מלריה כאן.", emergencyIf: ["חום, צמרמורת, כאב ראש, כאבי שרירים, הקאות אחרי נסיעה לאזור מלריה"], seeDoctorIf: ["כל חום אחרי נסיעה טרופית — הערכה באותו יום"], doNot: ["לא לחכות", "אין מינון תרופות נגד מלריה"] },
      { summary: "Лихорадка во время или после поездки в зону малярии — неотложное состояние, пока не доказано иное. Сообщите куда ездили. Доз противомалярийных здесь нет.", emergencyIf: ["Лихорадка, озноб, головная боль, миалгии, рвота после поездки в зону риска"], seeDoctorIf: ["Любая лихорадка после тропической поездки — в тот же день"], doNot: ["Не ждать", "Не изобретать дозы противомалярийных"] }
    ),
    sources: [S.nhsMalaria, S.cdcMalaria, S.cdcTravel],
  }),
  entry({
    id: "travel-vaccines-catchup",
    category: "travel",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["travel vaccines", "vaccination catch up", "missed vaccines", "need travel shots", "yellow fever vaccine"],
      fr: ["vaccins voyage", "rattrapage vaccinal", "vaccins manqués", "fièvre jaune vaccin", "vaccination avant voyage"],
      he: ["חיסוני נסיעות", "השלמת חיסונים", "חיסונים חסרים", "חיסון קדחת צהובה"],
      ru: ["прививки для поездки", "догоняющая вакцинация", "пропущенные прививки", "вакцина жёлтой лихорадки"],
    },
    titles: { en: "Travel vaccines / catch-up (orientation)", fr: "Vaccins voyage / rattrapage (orientation)", he: "חיסוני נסיעה / השלמה (הכוונה)", ru: "Прививки для поездки / догоняющие (ориентация)" },
    guidance: g(
      { summary: "Vaccine needs depend on destination, age, pregnancy, and immune status. Use official schedules (NHS vaccinations pages, CDC Travelers' Health) and a travel clinic or GP — this assistant never issues a personal vaccine prescription or invents catch-up intervals.", seeDoctorIf: ["Planning travel to regions with vaccine-preventable disease risk", "Unsure if childhood or adult vaccines are up to date", "Pregnant, immunocompromised, or infant travelling"], doNot: ["Do not invent doses, brands, or catch-up calendars", "Do not skip destination-specific advice (e.g. yellow fever certificate rules)"] },
      { summary: "Les besoins vaccinaux dépendent de la destination, de l'âge, de la grossesse et de l'immunité. Consulter les calendriers officiels et une clinique du voyage — jamais de schéma inventé ici.", seeDoctorIf: ["Voyage prévu en zone à risque vaccinal", "Schéma vaccinal incomplet", "Grossesse, immunodépression, nourrisson"], doNot: ["Pas de doses ni calendriers inventés"] },
      { summary: "צורכי חיסון תלויים ביעד, גיל, הריון ומצב חיסוני. לוחות רשמיים ומרפאת נסיעות — אין לוח השלמה מומצא כאן.", seeDoctorIf: ["תכנון נסיעה לאזור סיכון", "חיסונים לא מעודכנים", "הריון / דיכוי חיסוני / תינוק"], doNot: ["אין מינונים או לוחות מומצאים"] },
      { summary: "Нужды в вакцинах зависят от направления, возраста, беременности и иммунитета. Официальные календари и клиника путешествий — здесь нет выдуманных схем.", seeDoctorIf: ["Поездка в зону вакциноуправляемого риска", "Неполный график", "Беременность / иммунодефицит / младенец"], doNot: ["Не изобретать дозы и календари"] }
    ),
    sources: [S.nhsVaccines, S.cdcTravel],
  }),
  entry({
    id: "ectopic-pregnancy",
    category: "gyn",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["ectopic pregnancy", "ectopic", "pregnant one sided pain", "shoulder tip pain pregnant", "positive pregnancy test severe pain"],
      fr: ["grossesse extra utérine", "GEU", "douleur unilatérale enceinte", "douleur épaule grossesse", "test grossesse positif douleur forte"],
      he: ["הריון חוץ רחמי", "כאב חד צדדי בהריון", "כאב כתף בהריון", "בדיקת הריון חיובית וכאב חזק"],
      ru: ["внематочная беременность", "боль с одной стороны беременна", "боль в плече при беременности", "положительный тест и сильная боль"],
    },
    titles: { en: "Ectopic pregnancy — emergency cues", fr: "Grossesse extra-utérine — signes d'urgence", he: "הריון חוץ־רחמי — סימני חירום", ru: "Внематочная беременность — признаки неотложности" },
    guidance: g(
      { summary: "Ectopic pregnancy can be life-threatening. NHS: get emergency help for sudden sharp abdominal pain (often one-sided), pain in shoulder tip, dizziness/fainting with possible pregnancy, or heavy bleeding with pain. A positive pregnancy test with severe pain needs urgent assessment. Educational only — not diagnosis.", emergencyIf: ["Sudden severe abdominal or pelvic pain (often one-sided) with possible pregnancy", "Shoulder-tip pain with pregnancy symptoms", "Dizziness, fainting, looking very pale with abdominal pain and possible pregnancy", "Heavy vaginal bleeding with severe pain"], seeDoctorIf: ["Missed period / positive test with any worrying pain or spotting — same-day care"], doNot: ["Do not wait at home if severe pain and possible pregnancy", "Do not assume miscarriage only"] },
      { summary: "La GEU peut menacer le pronostic vital. Douleur abdominale unilatérale brutale, douleur d'épaule, malaise/pâleur avec grossesse possible = urgence.", emergencyIf: ["Douleur abdominale/pelvienne brutale souvent unilatérale", "Douleur d'épaule", "Vertige/syncope/pâleur", "Saignement abondant avec douleur"], seeDoctorIf: ["Test positif ou règles en retard avec douleur — avis le jour même"], doNot: ["Ne pas attendre si douleur sévère et grossesse possible"] },
      { summary: "הריון חוץ־רחמי עלול לסכן חיים. כאב בטן חד־צדדי פתאומי, כאב כתף, סחרחורת/התעלפות עם אפשרות להריון — חירום.", emergencyIf: ["כאב בטן/אגן חזק פתאומי לרוב חד־צדדי", "כאב קצה כתף", "סחרחורת/התעלפות/חיוורון", "דימום כבד עם כאב"], seeDoctorIf: ["בדיקה חיובית או איחור עם כאב — טיפול באותו יום"], doNot: ["לא לחכות בבית אם כאב חזק ואפשרות להריון"] },
      { summary: "Внематочная беременность опасна для жизни. Внезапная односторонняя боль, боль в плече, головокружение/обморок при возможной беременности — неотложка.", emergencyIf: ["Внезапная сильная боль в животе/тазу часто с одной стороны", "Боль в плече", "Головокружение/обморок/бледность", "Обильное кровотечение с болью"], seeDoctorIf: ["Положительный тест или задержка с болью — в тот же день"], doNot: ["Не ждать дома при сильной боли и возможной беременности"] }
    ),
    sources: [S.nhsEctopic],
  }),
  entry({
    id: "pelvic-inflammatory-disease",
    category: "gyn",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["pelvic inflammatory disease", "PID", "pelvic infection", "lower abdominal pain STI", "painful sex fever discharge"],
      fr: ["infection pelvienne", "MIP", "salpingite", "douleur bas ventre IST", "rapports douloureux fièvre pertes"],
      he: ["מחלה דלקתית באגן", "PID", "זיהום אגן", "כאב בטן תחתונה מין", "כאב בקיום יחסים חום הפרשות"],
      ru: ["воспалительные заболевания органов малого таза", "ВЗОМТ", "тазовая инфекция", "боль внизу живота ИППП", "боль при сексе жар выделения"],
    },
    titles: { en: "Pelvic inflammatory disease (PID) cues", fr: "Infection génitale haute / MIP — orientation", he: "מחלה דלקתית של האגן — הכוונה", ru: "ВЗОМТ — ориентиры" },
    guidance: g(
      { summary: "PID is an infection of the upper genital tract. NHS: see a GP urgently for lower abdominal pain with abnormal discharge, painful sex, bleeding between periods/after sex, fever, or pain when peeing. Severe pain or feeling very unwell needs emergency care. Diagnosis and antibiotics are clinician-only — no regimens here.", emergencyIf: ["Severe pelvic/abdominal pain", "Fever with severe pelvic pain", "Vomiting and unable to keep fluids with suspected pelvic infection"], seeDoctorIf: ["Lower abdominal pain with abnormal vaginal discharge", "Painful sex, bleeding between periods or after sex", "Fever or pain when peeing with pelvic symptoms"], doNot: ["Do not self-prescribe antibiotics", "Do not ignore partner notification advice from clinicians"] },
      { summary: "La MIP est une infection de l'appareil génital haut. Douleur bas-ventre avec pertes anormales, rapports douloureux, saignements, fièvre = avis médical urgent. Pas d'antibiotiques inventés.", emergencyIf: ["Douleur pelvienne sévère", "Fièvre avec douleur pelvienne forte"], seeDoctorIf: ["Douleur bas-ventre + pertes anormales", "Rapports douloureux, métrorragies", "Fièvre ou dysurie avec symptômes pelviens"], doNot: ["Pas d'antibiotiques en automédication"] },
      { summary: "PID היא זיהום במערכת המין העליונה. כאב בטן תחתונה עם הפרשות לא תקינות, כאב ביחסים, דימום, חום — ייעוץ דחוף. אין אנטיביוטיקה מומצאת.", emergencyIf: ["כאב אגן/בטן חזק", "חום עם כאב אגן חזק"], seeDoctorIf: ["כאב בטן תחתונה + הפרשות חריגות", "כאב ביחסים, דימום בין וסתות", "חום או כאב במתן שתן עם תסמיני אגן"], doNot: ["לא לרשום אנטיביוטיקה לבד"] },
      { summary: "ВЗОМТ — инфекция верхних отделов половых путей. Боль внизу живота с аномальными выделениями, боль при сексе, кровотечения, лихорадка — срочный осмотр. Антибиотики не выдумывать.", emergencyIf: ["Сильная тазовая/абдоминальная боль", "Лихорадка с сильной тазовой болью"], seeDoctorIf: ["Боль внизу живота + аномальные выделения", "Боль при сексе, кровотечения между менструациями", "Лихорадка или дизурия с тазовыми симптомами"], doNot: ["Не назначать себе антибиотики"] }
    ),
    sources: [S.nhsPid],
  }),
  entry({
    id: "menopause-postmenopausal-bleeding",
    category: "gyn",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["menopause", "hot flushes", "postmenopausal bleeding", "bleeding after menopause", "perimenopause"],
      fr: ["ménopause", "bouffées de chaleur", "saignement post ménopausique", "saignement après ménopause", "périménopause"],
      he: ["מנופאוזה", "גלי חום", "דימום אחרי מנופאוזה", "דימום לאחר הפסקת וסת", "פרימנופאוזה"],
      ru: ["менопауза", "приливы", "кровотечение после менопаузы", "кровянистые после климакса", "перименопауза"],
    },
    titles: { en: "Menopause symptoms / postmenopausal bleeding", fr: "Ménopause / saignement post-ménopausique", he: "מנופאוזה / דימום לאחר מנופאוזה", ru: "Менопауза / кровотечение после менопаузы" },
    guidance: g(
      { summary: "Hot flushes, night sweats, mood and sleep changes are common around menopause. Any vaginal bleeding after menopause needs GP assessment (NHS) — do not ignore. HRT and other treatments are clinician decisions; this pack does not prescribe.", emergencyIf: ["Very heavy bleeding with dizziness or fainting"], seeDoctorIf: ["Any bleeding after menopause", "Symptoms disrupting life (flushes, sleep, mood, vaginal dryness)", "Unsure if bleeding is postmenopausal"], selfCare: ["Layered clothing, cool bedroom, limit alcohol/spicy triggers if they worsen flushes", "Discuss options with a clinician rather than self-medicating hormones"], doNot: ["Do not ignore postmenopausal bleeding", "Do not start hormone therapy without clinical advice"] },
      { summary: "Bouffées, sueurs nocturnes, troubles de l'humeur/sommeil sont fréquents. Tout saignement après la ménopause nécessite un avis médical. Pas d'hormonothérapie inventée.", emergencyIf: ["Saignement très abondant avec malaise"], seeDoctorIf: ["Tout saignement post-ménopausique", "Symptômes qui perturbent la vie"], selfCare: ["Vêtements en couches, chambre fraîche"], doNot: ["Ne pas ignorer un saignement post-ménopausique"] },
      { summary: "גלי חום, הזעות לילה ושינויי מצב רוח נפוצים. כל דימום אחרי מנופאוזה דורש בדיקה. אין HRT מומצא.", emergencyIf: ["דימום כבד מאוד עם סחרחורת"], seeDoctorIf: ["כל דימום אחרי מנופאוזה", "תסמינים שמפריעים לחיים"], selfCare: ["ביגוד בשכבות, חדר קריר"], doNot: ["לא להתעלם מדימום לאחר מנופאוזה"] },
      { summary: "Приливы, ночная потливость, изменения настроения/сна часты. Любое кровотечение после менопаузы — к врачу. ЗГТ не назначать себе.", emergencyIf: ["Очень обильное кровотечение с головокружением"], seeDoctorIf: ["Любое кровотечение после менопаузы", "Симптомы, мешающие жизни"], selfCare: ["Многослойная одежда, прохладная спальня"], doNot: ["Не игнорировать кровотечение после менопаузы"] }
    ),
    sources: [S.nhsMenopause, S.nhsPostmenoBleed],
  }),
  entry({
    id: "heavy-periods",
    category: "gyn",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["heavy periods", "menorrhagia", "flooding periods", "soaking pads hourly"],
      fr: ["règles abondantes", "ménorragies", "règles qui inondent", "changer de protection toutes les heures"],
      he: ["וסת כבדה", "דימום וסתי כבד", "החלפת תחבושת כל שעה"],
      ru: ["обильные менструации", "меноррагия", "прокладки каждый час"],
    },
    titles: { en: "Heavy periods (orientation)", fr: "Règles abondantes (orientation)", he: "וסת כבדה (הכוונה)", ru: "Обильные менструации (ориентация)" },
    guidance: g(
      { summary: "Heavy periods can cause anaemia and may need investigation. NHS: see a GP if periods disrupt life, last >7 days, or you soak through protection hourly. Emergency care for very heavy bleeding with dizziness/fainting. Treatments are clinician-led.", emergencyIf: ["Soaking through protection every hour with dizziness or fainting", "Passing large clots with severe weakness"], seeDoctorIf: ["Periods lasting more than 7 days", "Flooding that limits work/school", "Symptoms of anaemia (tiredness, breathlessness, pale)"], doNot: ["Do not ignore progressive heavy bleeding", "Do not invent hormone or iron doses"] },
      { summary: "Les règles abondantes peuvent entraîner une anémie. Avis médical si gêne majeure, >7 jours, ou protections saturées chaque heure.", emergencyIf: ["Protection saturée chaque heure avec malaise"], seeDoctorIf: ["Règles > 7 jours", "Gêne majeure", "Signes d'anémie"], doNot: ["Pas de doses d'hormones ou fer inventées"] },
      { summary: "וסת כבדה עלולה לגרום לאנמיה. פנו לרופא אם מפריע לחיים, נמשך מעל 7 ימים, או ספיגה כל שעה.", emergencyIf: ["ספיגה כל שעה עם סחרחורת/התעלפות"], seeDoctorIf: ["מעל 7 ימים", "הפרעה משמעותית", "סימני אנמיה"], doNot: ["אין מינון הורמונים או ברזל מומצא"] },
      { summary: "Обильные менструации могут вызвать анемию. К врачу при нарушении жизни, >7 дней или промокании каждый час.", emergencyIf: ["Промокание каждый час с головокружением/обмороком"], seeDoctorIf: [">7 дней", "Сильное нарушение жизни", "Признаки анемии"], doNot: ["Не изобретать дозы гормонов или железа"] }
    ),
    sources: [S.nhsHeavyPeriods],
  }),
  entry({
    id: "panic-anxiety",
    category: "psych",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["panic attack", "anxiety attack", "racing heart anxiety", "fear panic", "hyperventilating anxiety"],
      fr: ["crise de panique", "attaque d'angoisse", "cœur qui s'emballe anxiété", "peur panique", "hyperventilation anxiété"],
      he: ["התקף פאניקה", "חרדה", "דפיקות לב מחרדה", "פחד פאניקה", "היפרוונטילציה מחרדה"],
      ru: ["паническая атака", "приступ тревоги", "сердцебиение от тревоги", "страх паника", "гипервентиляция тревога"],
    },
    titles: { en: "Panic / anxiety (non-crisis)", fr: "Panique / anxiété (hors crise suicidaire)", he: "פאניקה / חרדה (לא משבר אובדני)", ru: "Паника / тревога (не суицидальный кризис)" },
    guidance: g(
      { summary: "Panic attacks are frightening but usually not dangerous. NHS: breathing slows, grounding, and GP/talking therapies if attacks continue. Chest pain, severe breathlessness, or collapse still need emergency ruling-out of physical causes. Suicidal crisis uses the separate mental-health-crisis entry.", emergencyIf: ["Chest pain, severe breathlessness, collapse, or stroke/heart red flags — call emergency services", "Thoughts of self-harm or suicide — use crisis pathways"], seeDoctorIf: ["Repeated panic or anxiety that disrupts life", "Unsure if symptoms are panic vs physical illness"], selfCare: ["Slow breathing; sit somewhere quiet; remind yourself the peak usually passes", "Avoid excess caffeine/alcohol if they trigger attacks"], doNot: ["Do not invent benzodiazepine or antidepressant regimens", "Do not ignore new chest pain as 'just panic' without assessment when unsure"] },
      { summary: "Les crises de panique font peur mais sont souvent sans danger. Respiration lente, ancrage ; médecin/thérapie si répétées. Douleur thoracique/détresse = urgence à écarter. Pas de benzodiazépines inventées.", emergencyIf: ["Douleur thoracique, détresse respiratoire, syncope", "Idées suicidaires — filière crise"], seeDoctorIf: ["Panique/anxiété répétée qui gêne la vie"], selfCare: ["Respiration lente ; endroit calme"], doNot: ["Pas de benzodiazépines inventées"] },
      { summary: "התקפי פאניקה מפחידים אך לרוב אינם מסוכנים. נשימה איטית; רופא/טיפול אם חוזר. כאב חזה/קוצר נשימה — לשלול חירום. אין בנזודיאזפינים מומצאים.", emergencyIf: ["כאב חזה, קוצר נשימה חמור, התמוטטות", "מחשבות אובדניות — מסלול משבר"], seeDoctorIf: ["פאניקה/חרדה חוזרת שמפריעה לחיים"], selfCare: ["נשימה איטית; מקום שקט"], doNot: ["אין מינון בנזודיאזפינים מומצא"] },
      { summary: "Панические атаки пугают, но обычно не опасны. Медленное дыхание; врач/терапия при повторах. Боль в груди/одышка — исключать неотложку. Бензодиазепины не выдумывать.", emergencyIf: ["Боль в груди, тяжёлая одышка, обморок", "Суицидальные мысли — кризисный путь"], seeDoctorIf: ["Повторяющаяся паника/тревога, мешающая жизни"], selfCare: ["Медленное дыхание; тихое место"], doNot: ["Не изобретать дозы бензодиазепинов"] }
    ),
    sources: [S.nhsAnxiety],
  }),
  entry({
    id: "depression-low-mood",
    category: "psych",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["depression", "low mood for weeks", "feeling hopeless", "cannot enjoy anything", "sad for two weeks"],
      fr: ["dépression", "moral bas depuis des semaines", "sentiment de désespoir", "plus de plaisir", "triste depuis deux semaines"],
      he: ["דיכאון", "מצב רוח ירוד שבועות", "תחושת ייאוש", "אין הנאה מכלום", "עצוב שבועיים"],
      ru: ["депрессия", "плохое настроение неделями", "безнадёжность", "нет радости", "грусть две недели"],
    },
    titles: { en: "Low mood / depression (non-crisis)", fr: "Moral bas / dépression (hors crise)", he: "מצב רוח ירוד / דיכאון (לא משבר)", ru: "Пониженное настроение / депрессия (не кризис)" },
    guidance: g(
      { summary: "Low mood lasting ≥2 weeks, loss of enjoyment, hopelessness, or trouble concentrating may be depression (NHS/WHO). See a GP or self-refer to talking therapies where available. Urgent crisis help if suicidal. This pack never starts antidepressants.", emergencyIf: ["Thoughts of suicide or self-harm — emergency/crisis services now"], seeDoctorIf: ["Low mood >2 weeks", "Struggling to cope", "Self-help steps not enough"], selfCare: ["Talk to someone trusted; regular meals/sleep/exercise if able; peer support", "Avoid alcohol/drugs to 'numb' mood"], doNot: ["Do not invent antidepressant doses", "Do not dismiss prolonged low mood as weakness"] },
      { summary: "Un moral bas ≥2 semaines, anhédonie, désespoir peuvent indiquer une dépression. Voir un médecin / thérapies. Crise suicidaire = urgence. Pas d'antidépresseurs inventés.", emergencyIf: ["Idées suicidaires ou d'automutilation"], seeDoctorIf: ["Moral bas > 2 semaines", "Difficulté à faire face"], selfCare: ["Parler à quelqu'un de confiance ; repas/sommeil/activité réguliers"], doNot: ["Pas d'antidépresseurs inventés"] },
      { summary: "מצב רוח ירוד ≥שבועיים, אובדן הנאה או ייאוש עלולים להיות דיכאון. רופא/טיפול בשיחה. משבר אובדני — חירום. אין נוגדי דיכאון מומצאים.", emergencyIf: ["מחשבות אובדניות או פגיעה עצמית"], seeDoctorIf: ["מצב רוח ירוד מעל שבועיים", "קושי להתמודד"], selfCare: ["לדבר עם מישהו; ארוחות/שינה/פעילות סדירים"], doNot: ["אין מינון נוגדי דיכאון מומצא"] },
      { summary: "Пониженное настроение ≥2 недель, ангедония, безнадёжность могут быть депрессией. К врачу/терапии. Суицидальный кризис — неотложка. Антидепрессанты не выдумывать.", emergencyIf: ["Суицидальные мысли или самоповреждение"], seeDoctorIf: ["Плохое настроение >2 недель", "Трудно справляться"], selfCare: ["Поговорить с близким; регулярные еда/сон/активность"], doNot: ["Не изобретать дозы антидепрессантов"] }
    ),
    sources: [S.nhsDepression, S.whoDepression],
  }),
  entry({
    id: "osteoporosis-falls-risk",
    category: "elderly",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["osteoporosis", "fragile bones", "bone density", "fracture from fall elderly"],
      fr: ["ostéoporose", "os fragiles", "densité osseuse", "fracture après chute personne âgée"],
      he: ["אוסטיאופורוזיס", "עצמות שבירות", "צפיפות עצם", "שבר מנפילה בקשיש"],
      ru: ["остеопороз", "хрупкие кости", "плотность кости", "перелом от падения у пожилых"],
    },
    titles: { en: "Osteoporosis / fragility fracture risk", fr: "Ostéoporose / risque de fracture de fragilité", he: "אוסטיאופורוזיס / סיכון לשבר שבריריות", ru: "Остеопороз / риск хрупкого перелома" },
    guidance: g(
      { summary: "Osteoporosis weakens bones and raises fracture risk after falls. NHS: discuss risk factors, falls prevention, and treatments with a clinician. Acute fracture after a fall needs urgent assessment. No inventing bisphosphonate regimens.", emergencyIf: ["Suspected hip/spine fracture after a fall (cannot weight-bear, severe back pain after fall, deformity)"], seeDoctorIf: ["History of low-trauma fracture", "Height loss, kyphosis, long-term steroids, early menopause — discuss bone health", "Recurrent falls"], selfCare: ["Falls prevention: good lighting, remove trip hazards, strength/balance exercise if advised", "Adequate calcium/vitamin D via diet or clinician advice — not invented megadoses"], doNot: ["Do not invent osteoporosis drug doses", "Do not ignore inability to walk after a fall"] },
      { summary: "L'ostéoporose fragilise les os. Prévention des chutes et traitements = avis médical. Fracture après chute = évaluation urgente. Pas de bisphosphonates inventés.", emergencyIf: ["Suspicion de fracture de hanche/rachis après chute"], seeDoctorIf: ["Fracture à faible traumatisme", "Chutes répétées", "Facteurs de risque osseux"], selfCare: ["Prévention des chutes ; activité d'équilibre si conseillée"], doNot: ["Pas de doses d'anti-ostéoporotiques inventées"] },
      { summary: "אוסטיאופורוזיס מחלישה עצמות. מניעת נפילות וטיפול — רופא. חשד לשבר אחרי נפילה — הערכה דחופה. אין ביספוספונטים מומצאים.", emergencyIf: ["חשד לשבר ירך/עמוד שדרה אחרי נפילה"], seeDoctorIf: ["שבר מטראומה קלה", "נפילות חוזרות", "גורמי סיכון לעצם"], selfCare: ["מניעת נפילות; תרגילי שיווי משקל לפי ייעוץ"], doNot: ["אין מינון תרופות לאוסטיאופורוזיס מומצא"] },
      { summary: "Остеопороз ослабляет кости. Профилактика падений и лечение — у врача. Подозрение на перелом после падения — срочно. Бисфосфонаты не выдумывать.", emergencyIf: ["Подозрение на перелом бедра/позвоночника после падения"], seeDoctorIf: ["Перелом при малой травме", "Повторные падения", "Факторы риска кости"], selfCare: ["Профилактика падений; упражнения на баланс по совету"], doNot: ["Не изобретать дозы препаратов от остеопороза"] }
    ),
    sources: [S.nhsOsteo, S.nhsFalls],
  }),
  entry({
    id: "elderly-falls",
    category: "elderly",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["elderly fall", "fallen and cannot get up", "older person fell", "fall in elderly"],
      fr: ["chute personne âgée", "tombé et ne peut se relever", "chute sujet âgé", "chute chez le vieux"],
      he: ["נפילת קשיש", "נפל ולא יכול לקום", "קשיש נפל", "נפילה בגיל מבוגר"],
      ru: ["падение пожилого", "упал и не может встать", "пожилой упал", "падение у стариков"],
    },
    titles: { en: "Falls in older adults", fr: "Chutes chez la personne âgée", he: "נפילות בקשישים", ru: "Падения у пожилых" },
    guidance: g(
      { summary: "Falls are common in older adults and can cause serious injury (hip fracture, head injury). NHS: get help if cannot get up, severe pain, head injury red flags, or new confusion. Recurrent falls need medical review for causes (medicines, vision, balance).", emergencyIf: ["Cannot get up after a fall", "Severe hip/back/head pain", "Head injury red flags (see head injury guidance)", "New confusion or loss of consciousness"], seeDoctorIf: ["Recurrent falls", "Near-falls / unsteady gait", "Fear of falling limiting activity"], selfCare: ["Keep pathways clear; good lighting; sturdy footwear; consider pendant alarm if alone"], doNot: ["Do not leave someone who cannot rise unattended", "Do not ignore anticoagulation + head bump"] },
      { summary: "Les chutes sont fréquentes et peuvent être graves. Aide si impossible de se relever, douleur forte, signes de traumatisme crânien, confusion nouvelle.", emergencyIf: ["Impossible de se relever", "Douleur hanche/dos/tête sévère", "Signes de traumatisme crânien", "Confusion nouvelle"], seeDoctorIf: ["Chutes répétées", "Instabilité"], selfCare: ["Passages dégagés ; éclairage ; chaussures stables"], doNot: ["Ne pas laisser seul quelqu'un qui ne peut se relever"] },
      { summary: "נפילות נפוצות בקשישים ועלולות לגרום לפציעה קשה. עזרה אם לא יכול לקום, כאב חזק, דגלי חבלת ראש, בלבול חדש.", emergencyIf: ["לא יכול לקום", "כאב ירך/גב/ראש חזק", "דגלי חבלת ראש", "בלבול חדש"], seeDoctorIf: ["נפילות חוזרות", "חוסר יציבות"], selfCare: ["מעברים פנויים; תאורה; נעליים יציבות"], doNot: ["לא להשאיר לבד מי שלא יכול לקום"] },
      { summary: "Падения у пожилых часты и могут быть тяжёлыми. Помощь если не встаёт, сильная боль, признаки ЧМТ, новая спутанность.", emergencyIf: ["Не может встать", "Сильная боль в бедре/спине/голове", "Красные флаги ЧМТ", "Новая спутанность"], seeDoctorIf: ["Повторные падения", "Неустойчивость"], selfCare: ["Свободные проходы; освещение; устойчивая обувь"], doNot: ["Не оставлять одного того, кто не встаёт"] }
    ),
    sources: [S.nhsFalls, S.nhsHeadInjury],
  }),
  entry({
    id: "chickenpox",
    category: "peds",
    urgencyDefault: "auto_soins",
    priority: 4,
    keywords: {
      en: ["chickenpox", "varicella", "itchy blisters child", "pox spots"],
      fr: ["varicelle", "boutons qui démangent enfant", "vésicules varicelle"],
      he: ["אבעבועות רוח", "שלפוחיות מגרדות בילד", "אבובות"],
      ru: ["ветрянка", "ветряная оспа", "зудящие пузырьки у ребёнка"],
    },
    titles: { en: "Chickenpox (varicella)", fr: "Varicelle", he: "אבעבועות רוח", ru: "Ветряная оспа" },
    guidance: g(
      { summary: "Chickenpox usually improves in 1–2 weeks. NHS: fluids, paracetamol for discomfort, cool baths; stay off school until spots scab (~5 days). Urgent advice if worsening skin infection, dehydration, breathlessness, pregnancy/immunosuppression exposure, or newborn contact.", emergencyIf: ["Severe breathlessness with chickenpox", "Baby/newborn with chickenpox or significant exposure — urgent advice"], seeDoctorIf: ["Unsure it is chickenpox", "Red/hot/painful skin around blisters", "Dehydration (fewer wet nappies)", "Pregnant or immunocompromised exposure", "Breastfeeding with symptoms"], selfCare: ["Fluids; paracetamol per label; cool baths; loose clothes; trim nails"], doNot: ["Do not give aspirin to children", "Do not invent antiviral doses"] },
      { summary: "La varicelle s'améliore souvent en 1–2 semaines. Hydratation, paracétamol, bains tièdes. Avis urgent si infection cutanée, déshydratation, dyspnée, grossesse/immunodépression, nouveau-né.", emergencyIf: ["Dyspnée sévère", "Nouveau-né atteint ou exposé"], seeDoctorIf: ["Doute diagnostique", "Peau rouge/chaude/douloureuse autour des vésicules", "Déshydratation", "Grossesse ou immunodépression exposée"], selfCare: ["Boire ; paracétamol ; bains frais ; ongles courts"], doNot: ["Pas d'aspirine chez l'enfant", "Pas d'antiviraux inventés"] },
      { summary: "אבעבועות רוח לרוב משתפרות תוך 1–2 שבועות. נוזלים, פרצטמול, אמבטיות קרות. ייעוץ דחוף אם החמרת עור, התייבשות, קוצר נשימה, הריון/דיכוי חיסוני, יילוד.", emergencyIf: ["קוצר נשימה חמור", "יילוד עם מחלה או חשיפה משמעותית"], seeDoctorIf: ["ספק באבחנה", "עור אדום/חם/כואב סביב שלפוחיות", "התייבשות", "חשיפה בהריון או דיכוי חיסוני"], selfCare: ["נוזלים; פרצטמול; אמבט קריר; ציפורניים קצרות"], doNot: ["לא אספירין לילדים", "אין אנטי-ויראלי מומצא"] },
      { summary: "Ветрянка обычно проходит за 1–2 недели. Жидкость, парацетамол, прохладные ванны. Срочно при инфекции кожи, обезвоживании, одышке, беременности/иммунодефиците, новорождённом.", emergencyIf: ["Тяжёлая одышка", "Новорождённый с болезнью или значимым контактом"], seeDoctorIf: ["Сомнения в диагнозе", "Красная/горячая/болезненная кожа вокруг пузырьков", "Обезвоживание", "Контакт при беременности или иммунодефиците"], selfCare: ["Жидкость; парацетамол; прохладные ванны; короткие ногти"], doNot: ["Не давать аспирин детям", "Не изобретать дозы противовирусных"] }
    ),
    sources: [S.nhsChickenpox],
  }),
  entry({
    id: "measles",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 7,
    keywords: {
      en: ["measles", "measles rash", "Koplik", "fever cough rash eyes"],
      fr: ["rougeole", "éruption rougeole", "fièvre toux éruption yeux"],
      he: ["חצבת", "פריחת חצבת", "חום שיעול פריחה עיניים"],
      ru: ["корь", "сыпь кори", "жар кашель сыпь глаза"],
    },
    titles: { en: "Measles — seek care", fr: "Rougeole — consulter", he: "חצבת — לפנות לטיפול", ru: "Корь — обратиться за помощью" },
    guidance: g(
      { summary: "Measles is highly contagious and can be serious. WHO/NHS: fever, cough, runny nose, red eyes, then blotchy rash. Call for urgent advice — do not sit in a crowded waiting room without phoning first. Vaccination (MMR) prevents measles; this pack does not replace public health guidance.", emergencyIf: ["Breathing difficulty, seizures, extreme drowsiness, or stiff neck with suspected measles"], seeDoctorIf: ["Suspected measles symptoms — phone ahead", "Contact with measles if pregnant, infant, or immunocompromised"], doNot: ["Do not delay calling for advice", "Do not invent vitamin A or antiviral regimens"] },
      { summary: "La rougeole est très contagieuse et peut être grave. Fièvre, toux, rhinite, yeux rouges puis éruption. Appeler avant de se présenter. Vaccination ROR.", emergencyIf: ["Détresse respiratoire, convulsions, somnolence extrême, raideur de nuque"], seeDoctorIf: ["Suspicion de rougeole — téléphoner avant", "Contact si grossesse, nourrisson, immunodépression"], doNot: ["Ne pas retarder l'appel"] },
      { summary: "חצבת מדבקת מאוד ועלולה להיות חמורה. חום, שיעול, נזלת, עיניים אדומות ואז פריחה. להתקשר לפני הגעה. חיסון MMR.", emergencyIf: ["קושי נשימה, פרכוסים, ישנוניות קיצונית, נוקשות עורף"], seeDoctorIf: ["חשד לחצבת — להתקשר מראש", "מגע בהריון/תינוק/דיכוי חיסוני"], doNot: ["לא לדחות ייעוץ"] },
      { summary: "Корь очень заразна и может быть тяжёлой. Лихорадка, кашель, насморк, красные глаза, затем сыпь. Позвонить до визита. Вакцинация КПК.", emergencyIf: ["Одышка, судороги, крайняя сонливость, ригидность шеи"], seeDoctorIf: ["Подозрение на корь — позвонить заранее", "Контакт при беременности/младенце/иммунодефиците"], doNot: ["Не откладывать звонок"] }
    ),
    sources: [S.nhsMeasles, S.whoMeasles],
  }),
  entry({
    id: "whooping-cough",
    category: "peds",
    urgencyDefault: "voir_medecin",
    priority: 7,
    keywords: {
      en: ["whooping cough", "pertussis", "whoop cough", "coughing fits baby"],
      fr: ["coqueluche", "quintes de toux", "toux qui coque", "quintes nourrisson"],
      he: ["שעלת", "שיעול שעלת", "התקפי שיעול בתינוק"],
      ru: ["коклюш", "приступообразный кашель", "кашель у грудничка приступами"],
    },
    titles: { en: "Whooping cough (pertussis)", fr: "Coqueluche", he: "שעלת", ru: "Коклюш" },
    guidance: g(
      { summary: "Whooping cough spreads easily and can be serious in babies. NHS: urgent GP/111 for infants under 6 months with symptoms, worsening cough, or pregnancy contact; emergency care for blue/grey colour, hard breathing, chest pain, or seizures. Antibiotics timing is clinician-led.", emergencyIf: ["Lips/tongue/face/skin blue or grey", "Hard to breathe (shallow breathing)", "Chest pain worse with breathing/cough", "Seizures"], seeDoctorIf: ["Baby under 6 months with whooping-cough symptoms", "Very bad cough getting worse", "Pregnant and exposed"], doNot: ["Do not invent antibiotic courses", "Do not delay care for infants"] },
      { summary: "La coqueluche peut être grave chez le nourrisson. Urgence si cyanose, détresse respiratoire, douleur thoracique, convulsions. Avis urgent <6 mois.", emergencyIf: ["Lèvres/visage bleus ou gris", "Respiration difficile", "Douleur thoracique", "Convulsions"], seeDoctorIf: ["Nourrisson < 6 mois avec symptômes", "Toux très forte qui empire", "Grossesse et contact"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "שעלת עלולה להיות חמורה בתינוקות. חירום אם כחלחלות, קושי נשימה, כאב חזה, פרכוסים. ייעוץ דחוף מתחת לגיל 6 חודשים.", emergencyIf: ["שפתיים/פנים כחולות או אפורות", "קושי לנשום", "כאב חזה", "פרכוסים"], seeDoctorIf: ["תינוק מתחת ל־6 חודשים עם תסמינים", "שיעול חזק שמחמיר", "הריון ומגע"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Коклюш опасен для младенцев. Неотложка при цианозе, затруднённом дыхании, боли в груди, судорогах. Срочно для <6 месяцев.", emergencyIf: ["Губы/лицо синие или серые", "Трудно дышать", "Боль в груди", "Судороги"], seeDoctorIf: ["Младенец <6 мес с симптомами", "Очень сильный ухудшающийся кашель", "Беременность и контакт"], doNot: ["Не изобретать курсы антибиотиков"] }
    ),
    sources: [S.nhsWhooping],
  }),
  entry({
    id: "broken-bone-fracture",
    category: "ortho",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["broken bone", "fracture", "bone sticking out", "cannot move arm after fall", "deformed limb"],
      fr: ["os cassé", "fracture", "os qui ressort", "bras immobilisé après chute", "membre déformé"],
      he: ["שבר בעצם", "עצם שבורה", "עצם בולטת", "לא מזיז יד אחרי נפילה", "גפה מעוותת"],
      ru: ["сломанная кость", "перелом", "кость торчит", "не двигает рукой после падения", "деформированная конечность"],
    },
    titles: { en: "Suspected broken bone (fracture)", fr: "Suspicion de fracture", he: "חשד לשבר", ru: "Подозрение на перелом" },
    guidance: g(
      { summary: "Suspected fractures need clinical assessment/imaging. NHS: emergency care for bone through skin, severe deformity, numbness, loss of colour, heavy bleeding, or inability to use the limb. Support the injury; do not push bones back. Educational only.", emergencyIf: ["Bone piercing skin", "Severe deformity", "Numbness or blue/cold limb", "Heavy bleeding", "Cannot use limb after trauma", "Suspected hip fracture in older adult"], seeDoctorIf: ["Pain/swelling after injury that does not improve", "Unsure if fractured"], selfCare: ["Support/immobilize as comfortable; ice wrapped; elevation if possible"], doNot: ["Do not try to realign the bone", "Do not eat/drink if surgery may be needed until advised"] },
      { summary: "Une suspicion de fracture nécessite un avis/imagerie. Urgence si os exposé, déformation majeure, engourdissement, membre froid/bleu, saignement abondant.", emergencyIf: ["Os exposé", "Déformation sévère", "Engourdissement ou membre bleu/froid", "Saignement abondant", "Impossibilité d'utiliser le membre"], seeDoctorIf: ["Douleur/gonflement après trauma sans amélioration"], selfCare: ["Soutenir ; glace enveloppée ; surélever"], doNot: ["Ne pas réaligner soi-même"] },
      { summary: "חשד לשבר דורש הערכה/דימות. חירום אם עצם חודרת עור, עיוות קשה, נימול, גפה כחולה/קרה, דימום כבד.", emergencyIf: ["עצם חודרת עור", "עיוות קשה", "נימול או גפה כחולה/קרה", "דימום כבד", "לא יכול להשתמש בגפה"], seeDoctorIf: ["כאב/נפיחות אחרי חבלה שלא משתפרים"], selfCare: ["תמיכה; קרח עטוף; הרמה"], doNot: ["לא ליישר עצם לבד"] },
      { summary: "Подозрение на перелом требует осмотра/снимка. Неотложка при кости через кожу, сильной деформации, онемении, синей/холодной конечности, обильном кровотечении.", emergencyIf: ["Кость сквозь кожу", "Сильная деформация", "Онемение или синяя/холодная конечность", "Обильное кровотечение", "Нельзя пользоваться конечностью"], seeDoctorIf: ["Боль/отёк после травмы без улучшения"], selfCare: ["Поддерживать; лёд в ткани; приподнять"], doNot: ["Не вправлять самостоятельно"] }
    ),
    sources: [S.nhsBrokenBone],
  }),
  entry({
    id: "neck-trauma-whiplash",
    category: "ortho",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["whiplash", "neck injury after crash", "stiff neck after accident", "neck pain after car accident"],
      fr: ["coup du lapin", "traumisme cervical", "cou raide après accident", "douleur cervicale après accident"],
      he: ["צליפת שוט", "פציעת צוואר אחרי תאונה", "צוואר נוקשה אחרי תאונה", "כאב צוואר אחרי תאונת דרכים"],
      ru: ["хлыстовая травма", "травма шеи после аварии", "жёсткая шея после ДТП", "боль в шее после аварии"],
    },
    titles: { en: "Neck injury / whiplash red flags", fr: "Traumatisme cervical / coup du lapin", he: "פציעת צוואר / צליפת שוט", ru: "Травма шеи / хлыстовая травма" },
    guidance: g(
      { summary: "Most neck pain and whiplash improve with gentle movement and simple pain relief. NHS: urgent help for severe pain despite analgesics, tingling both sides, walking/sitting problems, electric-shock sensations, or limb weakness after neck injury. Avoid collars unless clinician advised.", emergencyIf: ["Limb weakness after neck injury", "Cannot walk or sit upright after neck trauma", "Electric-shock feeling into arms/legs", "Severe neurological deficit"], seeDoctorIf: ["Severe pain despite paracetamol/ibuprofen", "Pins and needles after injury", "Symptoms not improving after a week"], selfCare: ["Keep neck gently moving; heat/cold; avoid prolonged rest; no collar unless told"], doNot: ["Do not drive if neck movement unsafe", "Do not wear a collar by default"] },
      { summary: "La plupart des cervicalgies/coups du lapin s'améliorent. Urgence si faiblesse, trouble marche, décharges électriques, déficit neuro après trauma.", emergencyIf: ["Faiblesse des membres", "Impossible de marcher/s'asseoir", "Décharges vers bras/jambes"], seeDoctorIf: ["Douleur sévère malgré antalgiques", "Fourmillements", "Pas d'amélioration à 1 semaine"], selfCare: ["Mobiliser doucement ; chaud/froid ; pas de collier sauf avis"], doNot: ["Ne pas conduire si mobilité dangereuse"] },
      { summary: "רוב כאבי הצוואר/צליפת שוט משתפרים. חירום אם חולשת גפיים, קושי בהליכה, תחושות חשמל, חסר נוירולוגי אחרי חבלה.", emergencyIf: ["חולשת גפיים", "לא יכול ללכת/לשבת זקוף", "תחושת חשמל לידיים/רגליים"], seeDoctorIf: ["כאב חזק למרות משככי כאבים", "נימול", "אין שיפור אחרי שבוע"], selfCare: ["תנועה עדינה; חום/קור; בלי צווארון אלא אם נאמר"], doNot: ["לא לנהוג אם התנועה מסוכנת"] },
      { summary: "Большинство болей в шее/хлыстовых травм улучшаются. Неотложка при слабости конечностей, нарушении ходьбы, «электрических» ощущениях, неврологическом дефиците.", emergencyIf: ["Слабость конечностей", "Не может ходить/сидеть прямо", "Электрические ощущения в руки/ноги"], seeDoctorIf: ["Сильная боль несмотря на анальгетики", "Покалывание", "Нет улучшения через неделю"], selfCare: ["Мягко двигать; тепло/холод; без воротника без указания"], doNot: ["Не водить при опасной подвижности"] }
    ),
    sources: [S.nhsWhiplash, S.nhsNeckPain],
  }),
  entry({
    id: "seizure-first-aid",
    category: "neuro",
    urgencyDefault: "urgent",
    priority: 8,
    keywords: {
      en: ["seizure", "someone having a fit", "convulsion first aid", "epileptic fit help"],
      fr: ["crise d'épilepsie", "convulsion premiers secours", "quelqu'un qui convulse", "crise comitiale"],
      he: ["פרכוס", "התקף אפילפסיה", "עזרה ראשונה לפרכוס", "מישהו מפרכס"],
      ru: ["приступ", "эпилептический припадок", "первая помощь при судорогах", "человек бьётся в судорогах"],
    },
    titles: { en: "Seizure (fit) — first aid cues", fr: "Crise convulsive — gestes d'urgence", he: "פרכוס — עזרה ראשונה", ru: "Судорожный приступ — первая помощь" },
    guidance: g(
      { summary: "NHS: protect from injury, cushion the head, time the seizure, put in recovery position after movements stop, stay until recovered. Call emergency services if first seizure, lasts >5 minutes, repeated seizures, injury, pregnancy, diabetes, water, or breathing difficulty. Do not put anything in the mouth or restrain.", emergencyIf: ["Seizure lasting more than 5 minutes", "Repeated seizures without recovery", "First known seizure", "Difficulty breathing / injury / pregnancy / diabetes / in water"], seeDoctorIf: ["Known epilepsy with change in pattern — clinical follow-up"], selfCare: ["Cushion head; clear hazards; time the event; recovery position after jerking stops"], doNot: ["Do not put anything in the mouth", "Do not restrain movements", "Do not give food/drink until fully alert"] },
      { summary: "Protéger, caler la tête, chronométrer, PLS après les mouvements. Appeler les secours si >5 min, crises répétées, première crise, blessure, grossesse, diabète, eau, détresse.", emergencyIf: ["Crise > 5 minutes", "Crises répétées", "Première crise", "Détresse / blessure / grossesse / diabète / dans l'eau"], selfCare: ["Protéger la tête ; chronométrer ; PLS"], doNot: ["Rien dans la bouche", "Ne pas maintenir de force"] },
      { summary: "להגן מפציעה, לרפד ראש, לתזמן, מצב החלמה אחרי התנועות. לקרוא לעזרה אם מעל 5 דקות, חוזר, ראשון, פציעה, הריון, סוכרת, מים.", emergencyIf: ["פרכוס מעל 5 דקות", "פרכוסים חוזרים", "פרכוס ראשון", "קושי נשימה / פציעה / הריון / סוכרת / במים"], selfCare: ["ריפוד ראש; תזמון; מצב החלמה"], doNot: ["לא לשים דבר בפה", "לא לרסן בכוח"] },
      { summary: "Защитить от травмы, подложить голову, засечь время, положение восстановления после движений. Вызывать помощь если >5 мин, повторы, первый приступ, травма, беременность, диабет, вода.", emergencyIf: ["Приступ >5 минут", "Повторяющиеся приступы", "Первый приступ", "Одышка / травма / беременность / диабет / в воде"], selfCare: ["Подложить голову; засечь время; положение восстановления"], doNot: ["Ничего в рот", "Не удерживать силой"] }
    ),
    sources: [S.nhsSeizures],
  }),
  entry({
    id: "vertigo",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["vertigo", "room spinning", "spinning dizziness", "BPPV"],
      fr: ["vertige", "pièce qui tourne", "vertige rotatoire", "VPPB"],
      he: ["ורטיגו", "החדר מסתובב", "סחרחורת סיבובית"],
      ru: ["вертиго", "комната кружится", "вращательное головокружение"],
    },
    titles: { en: "Vertigo (spinning dizziness)", fr: "Vertige (impression que tout tourne)", he: "ורטיגו (סחרחורת סיבובית)", ru: "Вертиго (вращательное головокружение)" },
    guidance: g(
      { summary: "Vertigo is a spinning sensation. Many causes are inner-ear related; sudden vertigo with stroke red flags needs emergency care. NHS: GP if persistent or recurrent. Do not drive while symptomatic.", emergencyIf: ["Sudden vertigo with face droop, arm weakness, speech trouble, severe headache, double vision, or new weakness"], seeDoctorIf: ["Vertigo lasting days or recurring", "Hearing loss, tinnitus, or ear discharge with vertigo", "Falls due to spinning"], selfCare: ["Sit or lie still during attacks; move slowly; hydration"], doNot: ["Do not drive or operate machinery while spinning", "Do not invent vestibular suppressant regimens"] },
      { summary: "Le vertige donne l'impression que tout tourne. Avec signes d'AVC = urgence. Médecin si persistant. Ne pas conduire pendant les symptômes.", emergencyIf: ["Vertige brutal avec signes d'AVC (face, bras, parole, céphalée sévère, diplopie)"], seeDoctorIf: ["Vertige persistant ou récidivant", "Surdité/acouphènes/otorrhée associés"], selfCare: ["S'asseoir/s'allonger ; mouvements lents"], doNot: ["Ne pas conduire pendant les symptômes"] },
      { summary: "ורטיגו הוא תחושת סיבוב. עם דגלי שבץ — חירום. רופא אם נמשך/חוזר. לא לנהוג בזמן תסמינים.", emergencyIf: ["ורטיגו פתאומי עם דגלי שבץ"], seeDoctorIf: ["ורטיגו ממושך או חוזר", "ירידת שמיעה/טיניטוס/הפרשות"], selfCare: ["לשבת/לשכב; תנועות איטיות"], doNot: ["לא לנהוג בזמן סחרחורת"] },
      { summary: "Вертиго — ощущение вращения. Со красными флагами инсульта — неотложка. К врачу если длится/повторяется. Не водить при симптомах.", emergencyIf: ["Внезапное вертиго с признаками инсульта"], seeDoctorIf: ["Длительное или повторяющееся вертиго", "Снижение слуха/тиннитус/отделяемое"], selfCare: ["Сесть/лечь; медленные движения"], doNot: ["Не водить при симптомах"] }
    ),
    sources: [S.nhsVertigo],
  }),
  entry({
    id: "bells-palsy",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["bell's palsy", "bells palsy", "facial droop one side", "cannot close eye one side"],
      fr: ["paralysie de Bell", "paralysie faciale a frigore", "visage tombant d'un côté", "œil qui ne ferme pas"],
      he: ["שיתוק בל", "צניחת פנים בצד אחד", "לא סוגר עין בצד אחד"],
      ru: ["паралич Белла", "перекос лица с одной стороны", "не закрывается глаз с одной стороны"],
    },
    titles: { en: "Bell's palsy vs stroke — seek urgent advice", fr: "Paralysie de Bell vs AVC — avis urgent", he: "שיתוק בל מול שבץ — ייעוץ דחוף", ru: "Паралич Белла vs инсульт — срочный совет" },
    guidance: g(
      { summary: "Sudden facial weakness needs urgent assessment to distinguish Bell's palsy from stroke. NHS: get help urgently for facial droop. Eye care matters if the eye will not close. Steroids timing is clinician-only — no doses here.", emergencyIf: ["Sudden face/arm/leg weakness, speech difficulty, or other stroke signs — emergency pathway", "Sudden facial droop — urgent clinical assessment"], seeDoctorIf: ["Facial weakness without clear stroke features — same-day advice", "Eye not closing — protect the eye as advised by clinician"], doNot: ["Do not assume Bell's palsy without clinical assessment", "Do not invent steroid regimens"] },
      { summary: "Une faiblesse faciale brutale nécessite d'écarter un AVC. Avis urgent. Soins de l'œil si non fermeture. Pas de corticoïdes inventés.", emergencyIf: ["Faiblesse face/bras/jambe ou trouble de la parole — filière AVC", "Asymétrie faciale brutale — avis urgent"], seeDoctorIf: ["Faiblesse faciale — avis le jour même"], doNot: ["Ne pas conclure à une paralysie de Bell sans examen", "Pas de corticoïdes inventés"] },
      { summary: "חולשת פנים פתאומית דורשת הערכה דחופה לשלילת שבץ. טיפול בעין אם לא נסגרת. אין סטרואידים מומצאים.", emergencyIf: ["חולשת פנים/זרוע/רגל או דיבור — מסלול שבץ", "צניחת פנים פתאומית — הערכה דחופה"], seeDoctorIf: ["חולשת פנים — ייעוץ באותו יום"], doNot: ["לא להניח שזה שיתוק בל בלי בדיקה", "אין סטרואידים מומצאים"] },
      { summary: "Внезапная слабость лица требует срочной оценки для исключения инсульта. Уход за глазом если не закрывается. Стероиды не выдумывать.", emergencyIf: ["Слабость лица/руки/ноги или речи — путь инсульта", "Внезапный перекос лица — срочная оценка"], seeDoctorIf: ["Слабость лица — совет в тот же день"], doNot: ["Не считать параличом Белла без осмотра", "Не изобретать дозы стероидов"] }
    ),
    sources: [S.nhsBell],
  }),
  entry({
    id: "sciatica",
    category: "ortho",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["sciatica", "pain down the leg", "shooting leg pain from back", "piriformis sciatica"],
      fr: ["sciatique", "douleur qui descend dans la jambe", "élancement jambe depuis le dos"],
      he: ["סיאטיקה", "כאב שיורה לרגל", "כאב רגל מהגב"],
      ru: ["ишиас", "боль отдающая в ногу", "прострел в ногу из спины"],
    },
    titles: { en: "Sciatica (leg pain from back)", fr: "Sciatique", he: "סיאטיקה", ru: "Ишиас" },
    guidance: g(
      { summary: "Sciatica is pain radiating from the back into the leg. NHS: keep active within comfort; see GP if not improving, or urgent care for bowel/bladder loss, saddle numbness, or progressive leg weakness (cauda equina red flags).", emergencyIf: ["Loss of bowel or bladder control", "Numbness around genitals/anus (saddle anaesthesia)", "Progressive leg weakness"], seeDoctorIf: ["Pain not improving after a few weeks", "Severe pain limiting walking", "New neurological symptoms"], selfCare: ["Stay gently active; simple pain relief per label; avoid prolonged bed rest"], doNot: ["Do not ignore cauda equina red flags", "Do not invent opioid regimens"] },
      { summary: "La sciatique irradie du dos vers la jambe. Rester actif selon tolérance. Urgence si troubles sphinctériens, anesthésie en selle, déficit moteur progressif.", emergencyIf: ["Incontinence urinaire/fécale", "Anesthésie en selle", "Faiblesse progressive de jambe"], seeDoctorIf: ["Pas d'amélioration en quelques semaines", "Douleur sévère"], selfCare: ["Rester actif doucement ; antalgiques selon notice"], doNot: ["Ne pas ignorer les signes de queue de cheval"] },
      { summary: "סיאטיקה היא כאב מהגב לרגל. להישאר פעיל בעדינות. חירום אם אובדן שליטה בסוגרים, נימול באוכף, חולשת רגל מתקדמת.", emergencyIf: ["אובדן שליטה במעי/שלפוחית", "נימול באזור אוכף", "חולשת רגל מתקדמת"], seeDoctorIf: ["אין שיפור אחרי שבועות", "כאב חזק"], selfCare: ["פעילות עדינה; משכך כאב לפי התווית"], doNot: ["לא להתעלם מדגלי cauda equina"] },
      { summary: "Ишиас — боль из спины в ногу. Оставайтесь мягко активны. Неотложка при нарушении тазовых функций, седловидной анестезии, нарастающей слабости ноги.", emergencyIf: ["Нарушение контроля тазовых функций", "Онемение в седловидной зоне", "Нарастающая слабость ноги"], seeDoctorIf: ["Нет улучшения за недели", "Сильная боль"], selfCare: ["Мягкая активность; анальгетики по инструкции"], doNot: ["Не игнорировать красные флаги синдрома конского хвоста"] }
    ),
    sources: [S.nhsSciatica],
  }),
  entry({
    id: "gout-flare",
    category: "ortho",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["gout", "gout flare", "hot swollen big toe", "uric acid joint pain"],
      fr: ["goutte", "crise de goutte", "gros orteil rouge chaud", "acide urique articulaire"],
      he: ["שיגדון", "התקף גאוט", "בוהן נפוחה חמה", "חומצת שתן מפרק"],
      ru: ["подагра", "приступ подагры", "горячий отёк большого пальца ноги", "мочевая кислота сустав"],
    },
    titles: { en: "Gout flare (orientation)", fr: "Crise de goutte (orientation)", he: "התקף שיגדון (הכוונה)", ru: "Приступ подагры (ориентация)" },
    guidance: g(
      { summary: "Gout causes sudden hot, swollen, very painful joints (often big toe). NHS: rest, ice, elevate; see GP for diagnosis and treatment. Infection (cellulitis/septic joint) can look similar — urgent care if fever/systemic illness. No inventing colchicine/allopurinol doses.", emergencyIf: ["Hot swollen joint with high fever or feeling very unwell (possible septic joint)", "Unable to walk with severe systemic symptoms"], seeDoctorIf: ["First suspected gout attack", "Recurrent flares", "Unsure gout vs infection"], selfCare: ["Rest the joint; ice wrapped; elevate; fluids; follow clinician plan"], doNot: ["Do not invent colchicine, NSAID, or urate-lowering doses", "Do not ignore fever with a hot joint"] },
      { summary: "La goutte provoque une articulation chaude, gonflée, très douloureuse. Repos, glace, avis médical. Fièvre = écarter infection. Pas de colchicine inventée.", emergencyIf: ["Articulation chaude + forte fièvre / sepsis possible"], seeDoctorIf: ["Première crise suspectée", "Crises récidivantes"], selfCare: ["Repos ; glace ; surélévation ; hydratation"], doNot: ["Pas de colchicine/allopurinol inventés"] },
      { summary: "שיגדון גורם למפרק חם, נפוח וכואב מאוד. מנוחה, קרח, רופא. חום — לשלול זיהום. אין קולכיצין מומצא.", emergencyIf: ["מפרק חם + חום גבוה / חשד לספסיס"], seeDoctorIf: ["התקף ראשון חשוד", "התקפים חוזרים"], selfCare: ["מנוחה; קרח; הרמה; שתייה"], doNot: ["אין קולכיצין/אלופורינול מומצאים"] },
      { summary: "Подагра даёт горячий, отёчный, очень болезненный сустав. Покой, лёд, врач. Лихорадка — исключать инфекцию. Колхицин не выдумывать.", emergencyIf: ["Горячий сустав + высокая лихорадка / возможный сепсис"], seeDoctorIf: ["Первый подозреваемый приступ", "Повторяющиеся атаки"], selfCare: ["Покой; лёд; возвышение; жидкость"], doNot: ["Не изобретать дозы колхицина/аллопуринола"] }
    ),
    sources: [S.nhsGout],
  }),
  entry({
    id: "thrush-candidiasis",
    category: "gyn",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["thrush", "yeast infection", "candida itch", "vaginal thrush", "white discharge itch"],
      fr: ["muguet vaginal", "mycose vaginale", "candida démangeaisons", "pertes blanches qui grattent"],
      he: ["פטרייה וגינלית", "קנדידה", "גרד עם הפרשה לבנה", "קיכאון"],
      ru: ["молочница", "кандидоз", "зуд с белыми выделениями"],
    },
    titles: { en: "Thrush (candidiasis) — self-care cues", fr: "Mycose / candidose — autoprise en charge", he: "פטרייה (קנדידה) — טיפול עצמי", ru: "Молочница (кандидоз) — самопомощь" },
    guidance: g(
      { summary: "Thrush often causes itch and thick white discharge. NHS: pharmacy advice for typical uncomplicated cases; see a GP if pregnant, recurrent, unsure, severe, or with pelvic pain/fever (could be another infection). No inventing prescription antifungals.", emergencyIf: ["Severe pelvic pain with fever (not typical simple thrush)"], seeDoctorIf: ["Pregnant", "Recurrent thrush", "Unsure of diagnosis", "Symptoms after treatment not improving", "Blood in discharge or foul smell suggesting other infection"], selfCare: ["Loose cotton underwear; avoid irritants; ask pharmacist about over-the-counter options where appropriate"], doNot: ["Do not invent oral antifungal doses", "Do not assume STI treatment without testing when risk factors present"] },
      { summary: "La mycose provoque souvent démangeaisons et pertes blanches épaisses. Conseil pharmacien si typique ; médecin si grossesse, récidives, doute, douleur pelvienne/fièvre.", emergencyIf: ["Douleur pelvienne sévère avec fièvre"], seeDoctorIf: ["Grossesse", "Récidives", "Doute", "Pas d'amélioration"], selfCare: ["Sous-vêtements coton ; éviter irritants ; avis pharmacien"], doNot: ["Pas d'antifongiques oraux inventés"] },
      { summary: "פטרייה גורמת לרוב לגרד והפרשה לבנה סמיכה. ייעוץ בית מרקחת אם טיפוסי; רופא בהריון, חוזר, ספק, כאב אגן/חום.", emergencyIf: ["כאב אגן חזק עם חום"], seeDoctorIf: ["הריון", "חוזר", "ספק", "אין שיפור"], selfCare: ["כותנה; להימנע ממגרים; רוקח"], doNot: ["אין אנטי־פטרייתי פומי מומצא"] },
      { summary: "Молочница часто даёт зуд и густые белые выделения. Совет фармацевта если типично; врач при беременности, рецидивах, сомнении, тазовой боли/лихорадке.", emergencyIf: ["Сильная тазовая боль с лихорадкой"], seeDoctorIf: ["Беременность", "Рецидивы", "Сомнение", "Нет улучшения"], selfCare: ["Хлопковое бельё; избегать раздражителей; фармацевт"], doNot: ["Не изобретать дозы пероральных противогрибковых"] }
    ),
    sources: [S.nhsThrush],
  }),
];

for (const e of entries) {
  writeFileSync(join(dir, e.id + ".json"), JSON.stringify(e, null, 2) + "\n");
}
console.log("wrote", entries.length, "entries");

// Merge new sources into catalog
const catalogPath = join(root, "data/knowledge/sources.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const byId = new Map(catalog.sources.map((s) => [s.id, s]));
for (const s of Object.values(S)) {
  if (!byId.has(s.id)) {
    byId.set(s.id, {
      id: s.id,
      name: s.name,
      org: s.org,
      url: s.url,
      topics: [],
    });
  }
}
catalog.sources = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log("catalog sources", catalog.sources.length);

// Rebuild pack.meta entryFiles from disk
const metaPath = join(root, "data/knowledge/pack.meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort();
meta.entryFiles = files.map((f) => `entries/${f}`);
meta.version = "1.2.0";
meta.updatedAt = R;
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log("pack entries", meta.entryFiles.length, "v" + meta.version);

// Rebuild load.ts
function camel(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
const imports = files
  .map((f) => {
    const id = f.replace(/\.json$/, "");
    return `import ${camel(id)} from "../../../data/knowledge/entries/${id}.json";`;
  })
  .join("\n");
const list = files
  .map((f) => "  " + camel(f.replace(/\.json$/, "")))
  .join(",\n");
const loadTs = `import type { KnowledgeEntry, KnowledgePackMeta } from "./types";
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
`;
writeFileSync(join(root, "src/lib/knowledge/load.ts"), loadTs);
console.log("rewrote load.ts");

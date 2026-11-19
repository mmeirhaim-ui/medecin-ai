#!/usr/bin/env node
import { writeFileSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/knowledge/entries");
const R = "2026-11-18";
const g = (en, fr, he, ru) => ({ en, fr, he, ru });

const S = {
  nhsPoisoning: { id: "nhs-poisoning", name: "NHS — Poisoning", org: "NHS", url: "https://www.nhs.uk/conditions/poisoning/", retrievedAt: R },
  nhsAlcoholPoison: { id: "nhs-alcohol-poisoning", name: "NHS — Alcohol poisoning", org: "NHS", url: "https://www.nhs.uk/conditions/alcohol-poisoning/", retrievedAt: R },
  nhsCuts: { id: "nhs-cuts-grazes", name: "NHS — Cuts and grazes", org: "NHS", url: "https://www.nhs.uk/conditions/cuts-and-grazes/", retrievedAt: R },
  nhsSprains: { id: "nhs-sprains-strains", name: "NHS — Sprains and strains", org: "NHS", url: "https://www.nhs.uk/conditions/sprains-and-strains/", retrievedAt: R },
  nhsDislocated: { id: "nhs-dislocated-shoulder", name: "NHS — Dislocated shoulder", org: "NHS", url: "https://www.nhs.uk/conditions/dislocated-shoulder/", retrievedAt: R },
  nhsTennisElbow: { id: "nhs-tennis-elbow", name: "NHS — Tennis elbow", org: "NHS", url: "https://www.nhs.uk/conditions/tennis-elbow/", retrievedAt: R },
  nhsPlantar: { id: "nhs-plantar-fasciitis", name: "NHS — Plantar fasciitis", org: "NHS", url: "https://www.nhs.uk/conditions/plantar-fasciitis/", retrievedAt: R },
  nhsBunions: { id: "nhs-bunions", name: "NHS — Bunions", org: "NHS", url: "https://www.nhs.uk/conditions/bunions/", retrievedAt: R },
  nhsAthletesFoot: { id: "nhs-athletes-foot", name: "NHS — Athlete's foot", org: "NHS", url: "https://www.nhs.uk/conditions/athletes-foot/", retrievedAt: R },
  nhsWarts: { id: "nhs-warts-verrucas", name: "NHS — Warts and verrucas", org: "NHS", url: "https://www.nhs.uk/conditions/warts-and-verrucas/", retrievedAt: R },
  nhsAcne: { id: "nhs-acne", name: "NHS — Acne", org: "NHS", url: "https://www.nhs.uk/conditions/acne/", retrievedAt: R },
  nhsRosacea: { id: "nhs-rosacea", name: "NHS — Rosacea", org: "NHS", url: "https://www.nhs.uk/conditions/rosacea/", retrievedAt: R },
  nhsCoeliac: { id: "nhs-coeliac", name: "NHS — Coeliac disease", org: "NHS", url: "https://www.nhs.uk/conditions/coeliac-disease/", retrievedAt: R },
  nhsCrohns: { id: "nhs-crohns", name: "NHS — Crohn's disease", org: "NHS", url: "https://www.nhs.uk/conditions/crohns-disease/", retrievedAt: R },
  nhsUC: { id: "nhs-ulcerative-colitis", name: "NHS — Ulcerative colitis", org: "NHS", url: "https://www.nhs.uk/conditions/ulcerative-colitis/", retrievedAt: R },
  nhsB12: { id: "nhs-b12-folate-anaemia", name: "NHS — Vitamin B12 or folate deficiency anaemia", org: "NHS", url: "https://www.nhs.uk/conditions/vitamin-b12-or-folate-deficiency-anaemia/", retrievedAt: R },
  nhsAddisons: { id: "nhs-addisons", name: "NHS — Addison's disease", org: "NHS", url: "https://www.nhs.uk/conditions/addisons-disease/", retrievedAt: R },
  nhsEpilepsy: { id: "nhs-epilepsy", name: "NHS — Epilepsy", org: "NHS", url: "https://www.nhs.uk/conditions/epilepsy/", retrievedAt: R },
  nhsParkinsons: { id: "nhs-parkinsons", name: "NHS — Parkinson's disease", org: "NHS", url: "https://www.nhs.uk/conditions/parkinsons-disease/", retrievedAt: R },
  nhsMS: { id: "nhs-multiple-sclerosis", name: "NHS — Multiple sclerosis", org: "NHS", url: "https://www.nhs.uk/conditions/multiple-sclerosis/", retrievedAt: R },
  nhsTN: { id: "nhs-trigeminal-neuralgia", name: "NHS — Trigeminal neuralgia", org: "NHS", url: "https://www.nhs.uk/conditions/trigeminal-neuralgia/", retrievedAt: R },
};

const entries = [
  {
    id: "poisoning-overdose",
    category: "toxicology",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["poisoning", "swallowed poison", "overdose pills", "ate something toxic"],
      fr: ["intoxication", "a avalé un poison", "surdose médicaments", "a mangé quelque chose de toxique"],
      he: ["הרעלה", "בלע רעל", "מנת יתר כדורים", "אכל משהו רעיל"],
      ru: ["отравление", "проглотил яд", "передозировка таблеток", "съел что-то токсичное"],
    },
    titles: { en: "Poisoning / overdose — get help", fr: "Intoxication / surdose — agir", he: "הרעלה / מנת יתר — לפנות לעזרה", ru: "Отравление / передозировка — помощь" },
    guidance: g(
      { summary: "Suspected poisoning or overdose needs urgent medical help. NHS: call emergency services; do not make the person vomit unless clinicians tell you to; take the substance packaging if safe. This pack never invents antidote doses (including for paracetamol). Also see carbon-monoxide and alcohol-poisoning entries when relevant.", emergencyIf: ["Suspected poisoning or overdose", "Unconscious, fitting, difficulty breathing after ingestion", "Child who may have swallowed medicines/household chemicals"], seeDoctorIf: ["Any uncertain ingestion — urgent advice line / emergency pathway"], doNot: ["Do not induce vomiting unless told by clinicians", "Do not invent antidote or charcoal regimens", "Do not delay calling for help"] },
      { summary: "Toute suspicion d'intoxication/surdose = urgence. Ne pas faire vomir sauf avis. Pas d'antidotes inventés.", emergencyIf: ["Suspicion d'intoxication ou surdose", "Inconscient, convulsions, détresse après ingestion", "Enfant ayant pu avaler médicaments/produits"], seeDoctorIf: ["Toute ingestion incertaine"], doNot: ["Ne pas faire vomir sans avis", "Pas d'antidotes inventés"] },
      { summary: "חשד להרעלה/מנת יתר — חירום. לא לגרום להקאה אלא אם נאמר. אין נוגדי רעל מומצאים.", emergencyIf: ["חשד להרעלה או מנת יתר", "מחוסר הכרה, פרכוס, קושי נשימה אחרי בליעה", "ילד שעלול לבלוע תרופות/כימיקלים"], seeDoctorIf: ["כל בליעה לא ברורה"], doNot: ["לא לגרום להקאה בלי הוראה", "אין נוגדי רעל מומצאים"] },
      { summary: "Подозрение на отравление/передозировку — неотложка. Не вызывать рвоту без указания. Антидоты не выдумывать.", emergencyIf: ["Подозрение на отравление или передозировку", "Без сознания, судороги, одышка после приёма", "Ребёнок мог проглотить лекарства/химикаты"], seeDoctorIf: ["Любой неясный приём вещества"], doNot: ["Не вызывать рвоту без указания", "Не изобретать антидоты"] }
    ),
    sources: [S.nhsPoisoning],
  },
  {
    id: "alcohol-poisoning",
    category: "toxicology",
    urgencyDefault: "urgent",
    priority: 9,
    keywords: {
      en: ["alcohol poisoning", "passed out drunk", "alcohol overdose vomiting unconscious"],
      fr: ["intoxication alcoolique", "évanoui après alcool", "coma éthylique"],
      he: ["הרעלת אלכוהול", "התעלף משתייה", "מנת יתר אלכוהול"],
      ru: ["алкогольное отравление", "потерял сознание от алкоголя", "алкогольная интоксикация"],
    },
    titles: { en: "Alcohol poisoning", fr: "Intoxication alcoolique aiguë", he: "הרעלת אלכוהול", ru: "Алкогольное отравление" },
    guidance: g(
      { summary: "Alcohol poisoning can be life-threatening. NHS: emergency care if unconscious/hard to wake, seizures, slow/irregular breathing, cold/clammy/blue-tinged skin, or vomiting while not fully awake. Put in recovery position if unconscious and breathing; do not leave alone. Distinct from alcohol-withdrawal entry.", emergencyIf: ["Unconscious or hard to wake after drinking", "Seizures", "Slow or irregular breathing", "Cold, clammy, pale or blue-tinged skin", "Vomiting while not fully conscious"], selfCare: ["If conscious and advised to wait for help: keep warm, sit/lie safely, sip water if able — still seek urgent assessment when severe"], doNot: ["Do not leave the person alone", "Do not give more alcohol or coffee as a 'cure'", "Do not put them in a cold shower", "Do not invent detox drug regimens"] },
      { summary: "L'intoxication alcoolique peut tuer. Urgences si inconscient, convulsions, respiration lente, peau froide/cyanose, vomissements sans éveil complet. PLS si inconscient et respire.", emergencyIf: ["Inconscient / réveil difficile", "Convulsions", "Respiration lente/irrégulière", "Peau froide/cyanose", "Vomissements sans éveil complet"], doNot: ["Ne pas laisser seul", "Pas de café/alcool supplémentaires", "Pas de douche froide"] },
      { summary: "הרעלת אלכוהול מסוכנת. חירום אם מחוסר הכרה, פרכוסים, נשימה איטית, עור קר/כחלחל, הקאות בלי ערנות. מצב החלמה אם נושם.", emergencyIf: ["מחוסר הכרה / קשה להעיר", "פרכוסים", "נשימה איטית/לא סדירה", "עור קר/כחלחל", "הקאות בלי ערנות מלאה"], doNot: ["לא להשאיר לבד", "לא קפה/אלכוהול נוסף", "לא מקלחת קרה"] },
      { summary: "Алкогольное отравление опасно для жизни. Неотложка при бессознательном состоянии, судорогах, медленном дыхании, холодной/синюшной коже, рвоте без полного сознания. Положение восстановления если дышит.", emergencyIf: ["Без сознания / трудно разбудить", "Судороги", "Медленное/нерегулярное дыхание", "Холодная/синюшная кожа", "Рвота без полного сознания"], doNot: ["Не оставлять одного", "Не давать ещё алкоголь/кофе", "Не холодный душ"] }
    ),
    sources: [S.nhsAlcoholPoison],
  },
  {
    id: "cuts-grazes",
    category: "trauma",
    urgencyDefault: "auto_soins",
    priority: 3,
    keywords: {
      en: ["cut finger", "graze", "bleeding cut wound first aid"],
      fr: ["coupure", "écorchure", "plaie qui saigne premiers soins"],
      he: ["חתך", "שפשוף", "פצע מדמם עזרה ראשונה"],
      ru: ["порез", "ссадина", "кровоточащая рана первая помощь"],
    },
    titles: { en: "Cuts and grazes", fr: "Coupures et écorchures", he: "חתכים ושפשופים", ru: "Порезы и ссадины" },
    guidance: g(
      { summary: "Most small cuts/grazes: pressure to stop bleeding, clean with water, cover. NHS: urgent care for deep wounds, heavy bleeding that won't stop, gaping wounds needing stitches, animal bites, or signs of infection later. Tetanus status may matter — clinician decides.", emergencyIf: ["Bleeding that will not stop with pressure", "Deep wound with visible fat/muscle/bone", "Arterial spurting bleeding", "Wound with severe trauma / amputation"], seeDoctorIf: ["Wound may need stitches", "Animal/human bite", "Increasing redness, pus, fever", "Unsure about tetanus"], selfCare: ["Firm pressure; clean with water; plaster/dressing; elevate if possible"], doNot: ["Do not use hydrogen peroxide/alcohol routinely on wounds unless advised", "Do not invent antibiotic regimens"] },
      { summary: "Petites plaies : compression, nettoyer, couvrir. Urgence si saignement incontrôlable, plaie profonde. Médecin si points de suture, morsure, infection.", emergencyIf: ["Saignement qui ne s'arrête pas", "Plaie profonde", "Saignement pulsatile"], seeDoctorIf: ["Suture possible", "Morsure", "Infection"], selfCare: ["Compression ; eau ; pansement"], doNot: ["Pas d'antibiotiques inventés"] },
      { summary: "חתכים קטנים: לחץ, ניקוי, כיסוי. חירום בדימום שלא נעצר, פצע עמוק. רופא אם תפרים, נשיכה, זיהום.", emergencyIf: ["דימום שלא נעצר", "פצע עמוק", "דימום פועם"], seeDoctorIf: ["ייתכן שצריך תפרים", "נשיכה", "זיהום"], selfCare: ["לחץ; מים; חבישה"], doNot: ["אין אנטיביוטיקה מומצאת"] },
      { summary: "Небольшие раны: давление, промыть, закрыть. Неотложка при неостановимом кровотечении, глубокой ране. Врач при швах, укусе, инфекции.", emergencyIf: ["Кровотечение не останавливается", "Глубокая рана", "Пульсирующее кровотечение"], seeDoctorIf: ["Могут понадобиться швы", "Укус", "Инфекция"], selfCare: ["Давление; вода; повязка"], doNot: ["Не изобретать антибиотики"] }
    ),
    sources: [S.nhsCuts],
  },
  {
    id: "sprains-strains",
    category: "ortho",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["sprain", "strain", "twisted ankle", "pulled muscle"],
      fr: ["entorse", "foulure", "cheville tordue", "claquage musculaire"],
      he: ["נקע", "מתיחת שריר", "קרסול מפותל"],
      ru: ["растяжение", "вывих лёгкий", "подвернул лодыжку", "надрыв мышцы"],
    },
    titles: { en: "Sprains and strains", fr: "Entorses et foulures", he: "נקעים ומתיחות", ru: "Растяжения и надрывы" },
    guidance: g(
      { summary: "Sprains/strains: rest, ice wrapped, compression, elevation as tolerated; gradual return to activity. NHS: urgent care if cannot weight-bear, severe deformity, numbness, or suspected fracture/dislocation. Painkillers per label — no inventing opioid regimens.", emergencyIf: ["Bone deformity or open wound with injury", "No pulse / cold pale limb after injury", "Cannot move limb with severe trauma"], seeDoctorIf: ["Cannot put weight on the limb", "Severe swelling/bruising", "Not improving after a few days of self-care", "Numbness or weakness"], selfCare: ["PRICE principles: protect, rest, ice wrapped, compression, elevation; gentle movement as pain allows"], doNot: ["Do not apply ice directly to skin", "Do not invent opioid pain regimens"] },
      { summary: "Entorse/foulure : repos, glace enveloppée, compression, surélévation. Urgence si déformation, impossibilité d'appuyer. Pas d'opioïdes inventés.", emergencyIf: ["Déformation / plaie ouverte", "Membre froid sans pouls"], seeDoctorIf: ["Impossible d'appuyer", "Gonflement sévère", "Pas d'amélioration"], selfCare: ["Repos ; glace enveloppée ; compression ; surélévation"], doNot: ["Pas de glace directement sur la peau"] },
      { summary: "נקע/מתיחה: מנוחה, קרח עטוף, לחץ, הרמה. חירום בעיוות או אי יכולת לדרוך. אין אופיואידים מומצאים.", emergencyIf: ["עיוות / פצע פתוח", "גפה קרה ללא דופק"], seeDoctorIf: ["לא יכול לדרוך", "נפיחות קשה", "אין שיפור"], selfCare: ["מנוחה; קרח עטוף; לחץ; הרמה"], doNot: ["לא קרח ישירות על העור"] },
      { summary: "Растяжение: покой, лёд в ткани, компрессия, возвышение. Неотложка при деформации, невозможности наступать. Опиоиды не выдумывать.", emergencyIf: ["Деформация / открытая рана", "Холодная конечность без пульса"], seeDoctorIf: ["Нельзя наступать", "Сильный отёк", "Нет улучшения"], selfCare: ["Покой; лёд в ткани; компрессия; возвышение"], doNot: ["Не лёд прямо на кожу"] }
    ),
    sources: [S.nhsSprains],
  },
  {
    id: "dislocated-shoulder",
    category: "ortho",
    urgencyDefault: "urgent",
    priority: 7,
    keywords: {
      en: ["dislocated shoulder", "shoulder out of joint", "shoulder popped out"],
      fr: ["épaule luxée", "épaule déboîtée", "luxation d'épaule"],
      he: ["כתף מפורקת", "כתף יצאה מהמקום"],
      ru: ["вывих плеча", "плечо выскочило"],
    },
    titles: { en: "Dislocated shoulder", fr: "Luxation d'épaule", he: "פריקת כתף", ru: "Вывих плеча" },
    guidance: g(
      { summary: "A dislocated shoulder is painful and needs urgent clinical reduction — do not try to force it back yourself. NHS: support the arm, seek emergency care. Numbness, cool hand, or open injury raises urgency further.", emergencyIf: ["Suspected dislocated shoulder", "Shoulder deformity with severe pain after trauma", "Numbness or cold hand after shoulder injury"], selfCare: ["Support the arm in the most comfortable position while arranging emergency care"], doNot: ["Do not try to shove the shoulder back in yourself", "Do not invent sedation/reduction drug regimens"] },
      { summary: "Une épaule luxée nécessite une réduction médicale urgente — ne pas forcer soi-même. Soutenir le bras ; urgences.", emergencyIf: ["Suspicion de luxation", "Déformation + douleur sévère", "Engourdissement / main froide"], selfCare: ["Soutenir le bras en attendant les secours"], doNot: ["Ne pas remettre soi-même"] },
      { summary: "פריקת כתף דורשת החזרה רפואית דחופה — לא להחזיר לבד. לתמוך בזרוע; חירום.", emergencyIf: ["חשד לפריקה", "עיוות + כאב חזק", "נימול / יד קרה"], selfCare: ["לתמוך בזרוע עד לעזרה"], doNot: ["לא להחזיר לבד"] },
      { summary: "Вывих плеча требует срочного вправления врачом — не вправлять самостоятельно. Поддержать руку; неотложка.", emergencyIf: ["Подозрение на вывих", "Деформация + сильная боль", "Онемение / холодная кисть"], selfCare: ["Поддержать руку до помощи"], doNot: ["Не вправлять самостоятельно"] }
    ),
    sources: [S.nhsDislocated],
  },
  {
    id: "tennis-elbow",
    category: "msk",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["tennis elbow", "lateral elbow pain", "pain outside elbow gripping"],
      fr: ["tennis elbow", "épicondylite", "douleur extérieur du coude"],
      he: ["מרפק טניס", "כאב בצד החיצוני של המרפק"],
      ru: ["локоть теннисиста", "эпикондилит", "боль снаружи локтя"],
    },
    titles: { en: "Tennis elbow", fr: "Épicondylite (tennis elbow)", he: "מרפק טניס", ru: "Локоть теннисиста" },
    guidance: g(
      { summary: "Tennis elbow causes pain on the outer elbow, worse with gripping. NHS: activity modification, pharmacy pain relief, physiotherapy pathways. See GP if not improving. Steroid injections/surgery are clinician decisions — no invented injection doses.", seeDoctorIf: ["Pain lasting weeks despite rest/modification", "Weakness or inability to use the arm", "Sudden severe elbow trauma (different pathway)"], selfCare: ["Reduce aggravating activities; ice wrapped; simple pain relief per label; ergonomic adjustments"], doNot: ["Do not invent steroid injection regimens"] },
      { summary: "L'épicondylite fait mal à l'extérieur du coude. Adapter les activités ; kiné/médecin si persistant. Pas d'injections inventées.", seeDoctorIf: ["Douleur prolongée", "Faiblesse"], selfCare: ["Réduire les gestes aggravants ; glace ; antalgiques selon notice"], doNot: ["Pas d'injections de corticoïdes inventées"] },
      { summary: "מרפק טניס: כאב בצד החיצוני, מחמיר באחיזה. שינוי פעילות; רופא אם נמשך. אין זריקות מומצאות.", seeDoctorIf: ["כאב ממושך", "חולשה"], selfCare: ["להפחית מאמצים; קרח; משכך כאב לפי התווית"], doNot: ["אין זריקות סטרואידים מומצאות"] },
      { summary: "Эпикондилит: боль снаружи локтя, хуже при хвате. Изменить нагрузку; врач если длится. Инъекции не выдумывать.", seeDoctorIf: ["Длительная боль", "Слабость"], selfCare: ["Снизить провоцирующие нагрузки; лёд; анальгетики по инструкции"], doNot: ["Не изобретать инъекции стероидов"] }
    ),
    sources: [S.nhsTennisElbow],
  },
  {
    id: "plantar-fasciitis",
    category: "msk",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["plantar fasciitis", "heel pain first steps", "pain bottom of foot morning"],
      fr: ["aponévrosite plantaire", "douleur talon premiers pas", "talalgie matinale"],
      he: ["דלקת פאשיה של כף הרגל", "כאב עקב בצעדים ראשונים"],
      ru: ["плантарный фасциит", "боль в пятке первые шаги"],
    },
    titles: { en: "Plantar fasciitis", fr: "Aponévrosite plantaire", he: "פלנטר פשיאיטיס", ru: "Плантарный фасциит" },
    guidance: g(
      { summary: "Plantar fasciitis causes heel/arch pain, often worse with first steps. NHS: rest from aggravating activity, supportive shoes, stretching, pharmacy advice; GP/physio if persistent. No inventing steroid injection doses.", seeDoctorIf: ["Heel pain lasting weeks", "Inability to walk", "Sudden severe heel pain after a pop (possible rupture — urgent review)"], selfCare: ["Reduce impact; supportive footwear; calf/plantar stretches; ice wrapped after activity"], doNot: ["Do not invent steroid injection regimens", "Do not ignore sudden 'pop' with severe pain"] },
      { summary: "L'aponévrosite plantaire fait mal au talon, surtout aux premiers pas. Chaussures adaptées, étirements ; médecin si persistant. Pas d'injections inventées.", seeDoctorIf: ["Douleur prolongée", "Impossible de marcher", "Douleur brutale après un 'clac'"], selfCare: ["Réduire les impacts ; chaussures de soutien ; étirements"], doNot: ["Pas d'injections inventées"] },
      { summary: "פלנטר פשיאיטיס: כאב עקב/קשת, לרוב בצעדים ראשונים. נעליים תומכות, מתיחות; רופא אם נמשך. אין זריקות מומצאות.", seeDoctorIf: ["כאב ממושך", "לא יכול ללכת", "כאב פתאומי אחרי 'קליק'"], selfCare: ["להפחית עומס; נעליים תומכות; מתיחות"], doNot: ["אין זריקות מומצאות"] },
      { summary: "Плантарный фасциит: боль в пятке/своде, хуже с первых шагов. Обувь с поддержкой, растяжки; врач если длится. Инъекции не выдумывать.", seeDoctorIf: ["Длительная боль", "Нельзя ходить", "Внезапная боль после «щелчка»"], selfCare: ["Снизить ударную нагрузку; поддерживающая обувь; растяжки"], doNot: ["Не изобретать инъекции"] }
    ),
    sources: [S.nhsPlantar],
  },
  {
    id: "bunions",
    category: "msk",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["bunion", "hallux valgus", "painful bump big toe joint"],
      fr: ["oignon du pied", "hallux valgus", "bosse douloureuse gros orteil"],
      he: ["הלוקס ולגוס", "בליטה כואבת בבוהן"],
      ru: ["вальгусная деформация", "шишка у большого пальца ноги"],
    },
    titles: { en: "Bunions", fr: "Oignon (hallux valgus)", he: "בוניון / הלוקס ולגוס", ru: "Вальгусная деформация (bunion)" },
    guidance: g(
      { summary: "Bunions are bony bumps at the big-toe joint that can hurt in tight shoes. NHS: wider shoes, pads, pain relief; GP if severe. Surgery is a specialist decision — not diagnosed/prescribed here.", seeDoctorIf: ["Pain limiting walking", "Worsening deformity", "Skin breakdown over the bunion"], selfCare: ["Wide comfortable shoes; bunion pads; avoid high heels; simple pain relief per label"], doNot: ["Do not invent surgical plans or antibiotic regimens for skin breakdown without assessment"] },
      { summary: "L'oignon fait mal dans chaussures serrées. Chaussures larges ; médecin si gênant. Chirurgie = spécialiste.", seeDoctorIf: ["Douleur limitant la marche", "Aggravation", "Lésion cutanée"], selfCare: ["Chaussures larges ; protections ; antalgiques selon notice"], doNot: ["Pas de plans chirurgicaux inventés"] },
      { summary: "בוניון: בליטה במפרק הבוהן. נעליים רחבות; רופא אם מפריע. ניתוח — מומחה.", seeDoctorIf: ["כאב שמגביל הליכה", "החמרה", "פצע בעור"], selfCare: ["נעליים רחבות; ריפוד; משכך כאב לפי התווית"], doNot: ["אין תוכניות ניתוח מומצאות"] },
      { summary: "Bunion: костный выступ у большого пальца. Широкая обувь; врач если мешает. Операция — у специалиста.", seeDoctorIf: ["Боль ограничивает ходьбу", "Ухудшение", "Повреждение кожи"], selfCare: ["Широкая обувь; прокладки; анальгетики по инструкции"], doNot: ["Не изобретать планы операций"] }
    ),
    sources: [S.nhsBunions],
  },
  {
    id: "athletes-foot",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 2,
    keywords: {
      en: ["athlete's foot", "athletes foot", "itchy peeling toes fungus"],
      fr: ["pied d'athlète", "mycose des pieds", "doigts de pied qui pèlent"],
      he: ["רגל ספורטאים", "פטרייה בין האצבעות"],
      ru: ["грибок стопы", "микоз между пальцами ног"],
    },
    titles: { en: "Athlete's foot", fr: "Pied d'athlète (mycose)", he: "רגל ספורטאים", ru: "Грибок стопы" },
    guidance: g(
      { summary: "Athlete's foot is a common fungal infection between toes. NHS: pharmacy antifungal cream/spray; keep feet dry. See GP if not improving, diabetes, or spreading. No inventing oral antifungal doses.", seeDoctorIf: ["Not improving after pharmacy treatment", "Diabetes with foot infection signs", "Spreading redness, pain, fever"], selfCare: ["Antifungal from pharmacy as directed; dry between toes; change socks; avoid sharing towels"], doNot: ["Do not invent oral antifungal regimens", "Do not ignore infected diabetic feet"] },
      { summary: "Le pied d'athlète est une mycose. Antifongique pharmacie ; pieds secs. Médecin si échec ou diabète. Pas de comprimés inventés.", seeDoctorIf: ["Échec pharmacie", "Diabète avec signes d'infection", "Rougeur/fièvre"], selfCare: ["Antifongique pharmacie ; sécher entre les orteils"], doNot: ["Pas d'antifongiques oraux inventés"] },
      { summary: "רגל ספורטאים: פטרת בין האצבעות. תכשיר בית מרקחת; לייבש. רופא בכישלון או סוכרת. אין כדורים מומצאים.", seeDoctorIf: ["אין שיפור", "סוכרת עם סימני זיהום", "אודם/חום"], selfCare: ["אנטי־פטרייתי מבית מרקחת; לייבש בין האצבעות"], doNot: ["אין אנטי־פטרייתי פומי מומצא"] },
      { summary: "Грибок стопы между пальцами. Аптечное средство; сушить ноги. Врач при неудаче или диабете. Таблетки не выдумывать.", seeDoctorIf: ["Нет улучшения", "Диабет с признаками инфекции", "Краснота/лихорадка"], selfCare: ["Противогрибковое из аптеки; сушить между пальцами"], doNot: ["Не изобретать пероральные противогрибковые"] }
    ),
    sources: [S.nhsAthletesFoot],
  },
  {
    id: "warts-verrucas",
    category: "derm",
    urgencyDefault: "auto_soins",
    priority: 1,
    keywords: {
      en: ["wart", "verruca", "plantar wart foot"],
      fr: ["verrue", "verrue plantaire", "verrue pied"],
      he: ["יבלת", "ורוקה", "יבלת בכף הרגל"],
      ru: ["бородавка", "подошвенная бородавка"],
    },
    titles: { en: "Warts and verrucas", fr: "Verrues", he: "יבלות / ורוקות", ru: "Бородавки" },
    guidance: g(
      { summary: "Warts/verrucas are viral and often clear eventually. NHS: pharmacy treatments; avoid sharing towels/socks; see GP if painful, facial/genital, or not improving. No inventing destructive procedures.", seeDoctorIf: ["Painful or spreading", "On face/genitals", "Immunocompromised", "Not improving with pharmacy care"], selfCare: ["Pharmacy wart treatments as labeled; cover verrucas in pools if advised; do not pick"], doNot: ["Do not cut warts out yourself", "Do not invent prescription regimens"] },
      { summary: "Les verrues sont virales. Traitements pharmacie ; médecin si douloureuses, visage/génital, échec. Ne pas couper soi-même.", seeDoctorIf: ["Douloureuses / étendues", "Visage / génital", "Échec"], selfCare: ["Traitements pharmacie ; ne pas gratter"], doNot: ["Ne pas exciser soi-même"] },
      { summary: "יבלות ויראליות. טיפול בית מרקחת; רופא אם כואבות, בפנים/איברי מין, או אין שיפור. לא לחתוך לבד.", seeDoctorIf: ["כואבות / מתפשטות", "בפנים / איברי מין", "אין שיפור"], selfCare: ["טיפול בית מרקחת; לא לחטט"], doNot: ["לא לחתוך לבד"] },
      { summary: "Бородавки вирусные. Аптечные средства; врач если болезненные, на лице/гениталиях, нет улучшения. Не вырезать самостоятельно.", seeDoctorIf: ["Болезненные / распространяются", "Лицо / гениталии", "Нет улучшения"], selfCare: ["Аптечные средства; не ковырять"], doNot: ["Не вырезать самостоятельно"] }
    ),
    sources: [S.nhsWarts],
  },
  {
    id: "acne",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["acne", "pimples blackheads", "spots on face teenager"],
      fr: ["acné", "boutons points noirs", "acné visage ado"],
      he: ["אקנה", "פצעונים", "שחורים בפנים"],
      ru: ["акне", "прыщи угри", "чёрные точки на лице"],
    },
    titles: { en: "Acne", fr: "Acné", he: "אקנה", ru: "Акне" },
    guidance: g(
      { summary: "Acne is common. NHS: gentle cleansing; pharmacy gels; GP for moderate/severe or scarring risk. Oral isotretinoin and antibiotics are specialist/GP-prescribed only — never invent doses. Avoid picking.", seeDoctorIf: ["Moderate/severe acne", "Scarring or pigmentation", "Not improving with pharmacy care", "Sudden adult acne with other hormonal symptoms"], selfCare: ["Gentle cleanse; non-comedogenic moisturiser; pharmacy topical treatments as labeled; do not squeeze aggressively"], doNot: ["Do not invent isotretinoin or oral antibiotic regimens", "Do not use someone else's prescription creams"] },
      { summary: "L'acné est fréquente. Soins doux ; pharmacie ; médecin si modérée/sévère. Isotrétinoïne/antibiotiques = prescription. Pas de doses inventées.", seeDoctorIf: ["Acné modérée/sévère", "Cicatrices", "Échec pharmacie"], selfCare: ["Nettoyage doux ; traitements pharmacie"], doNot: ["Pas d'isotrétinoïne inventée"] },
      { summary: "אקנה נפוצה. ניקוי עדין; בית מרקחת; רופא בבינוני/חמור. איזוטרטינואין/אנטיביוטיקה — מרשם בלבד.", seeDoctorIf: ["אקנה בינונית/חמורה", "צלקות", "אין שיפור"], selfCare: ["ניקוי עדין; טיפולי בית מרקחת"], doNot: ["אין איזוטרטינואין מומצא"] },
      { summary: "Акне часто. Мягкое очищение; аптека; врач при средней/тяжёлой. Изотретиноин/антибиотики — по рецепту. Дозы не выдумывать.", seeDoctorIf: ["Среднее/тяжёлое акне", "Рубцы", "Нет улучшения"], selfCare: ["Мягкое очищение; аптечные средства"], doNot: ["Не изобретать изотретиноин"] }
    ),
    sources: [S.nhsAcne],
  },
  {
    id: "rosacea",
    category: "derm",
    urgencyDefault: "voir_medecin",
    priority: 2,
    keywords: {
      en: ["rosacea", "facial redness flushing bumps", "red face adult persistent"],
      fr: ["rosacée", "rougeurs visage bouffées", "couperose"],
      he: ["רוזציאה", "אדמומיות בפנים הסתמקות"],
      ru: ["розацеа", "покраснение лица приливы"],
    },
    titles: { en: "Rosacea", fr: "Rosacée", he: "רוזציאה", ru: "Розацеа" },
    guidance: g(
      { summary: "Rosacea causes facial redness, flushing, and sometimes bumps. NHS: see a GP for diagnosis/treatment; avoid known triggers (spicy food, alcohol, extreme temperatures for some). Eye symptoms need prompt review. Prescription topicals/orals are clinician-only.", seeDoctorIf: ["Persistent facial redness/bumps", "Eye irritation with facial rosacea", "Not sure if acne vs rosacea"], selfCare: ["Gentle skincare; identify triggers; sun protection"], doNot: ["Do not invent antibiotic gel/tablet regimens", "Do not use strong steroid creams on the face without advice"] },
      { summary: "La rosacée rouge le visage et provoque des bouffées. Médecin pour traitement. Éviter déclencheurs. Pas de schémas inventés.", seeDoctorIf: ["Rougeurs persistantes", "Yeux irrités", "Doute diagnostique"], selfCare: ["Soins doux ; protection solaire ; éviter déclencheurs"], doNot: ["Pas d'antibiotiques inventés", "Pas de dermocorticoïdes faciaux sans avis"] },
      { summary: "רוזציאה: אדמומיות והסתמקות בפנים. רופא לטיפול. להימנע מטריגרים. אין מינונים מומצאים.", seeDoctorIf: ["אדמומיות מתמשכת", "גירוי בעיניים", "ספק באבחנה"], selfCare: ["טיפוח עדין; הגנה מהשמש; להימנע מטריגרים"], doNot: ["אין אנטיביוטיקה מומצאת", "אין סטרואידים לפנים בלי ייעוץ"] },
      { summary: "Розацеа: покраснение и приливы лица. К врачу. Избегать триггеров. Схемы не выдумывать.", seeDoctorIf: ["Стойкое покраснение", "Раздражение глаз", "Сомнение в диагнозе"], selfCare: ["Мягкий уход; защита от солнца; избегать триггеров"], doNot: ["Не изобретать антибиотики", "Не сильные стероиды на лицо без совета"] }
    ),
    sources: [S.nhsRosacea],
  },
  {
    id: "coeliac-disease",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["coeliac", "celiac", "gluten intolerance diarrhoea bloating"],
      fr: ["maladie cœliaque", "intolérance au gluten diarrhée ballonnements"],
      he: ["צליאק", "רגישות לגלוטן שלשול נפיחות"],
      ru: ["целиакия", "непереносимость глютена понос вздутие"],
    },
    titles: { en: "Coeliac disease (orientation)", fr: "Maladie cœliaque (orientation)", he: "צליאק (הכוונה)", ru: "Целиакия (ориентация)" },
    guidance: g(
      { summary: "Coeliac disease is an immune reaction to gluten. NHS: see a GP for testing before starting a gluten-free diet (testing needs gluten exposure). Do not self-diagnose; dietitian support after diagnosis. Emergency only for unrelated red flags (severe dehydration, bleeding).", seeDoctorIf: ["Chronic diarrhoea, bloating, weight loss, anaemia symptoms suggesting coeliac", "Family history with suggestive symptoms"], doNot: ["Do not start strict gluten-free diet before testing without clinical advice", "Do not invent supplement megadoses"] },
      { summary: "La maladie cœliaque réagit au gluten. Faire des tests avant régime sans gluten. Pas d'autodiagnostic.", seeDoctorIf: ["Diarrhée chronique, ballonnements, amaigrissement, anémie"], doNot: ["Ne pas débuter un régime strict avant bilans sans avis"] },
      { summary: "צליאק: תגובה לגלוטן. בדיקות לפני דיאטה ללא גלוטן. לא לאבחן לבד.", seeDoctorIf: ["שלשול כרוני, נפיחות, ירידה במשקל, אנמיה"], doNot: ["לא להתחיל דיאטה קפדנית לפני בדיקות בלי ייעוץ"] },
      { summary: "Целиакия — реакция на глютен. Анализы до безглютеновой диеты. Не ставить диагноз себе.", seeDoctorIf: ["Хроническая диарея, вздутие, похудение, анемия"], doNot: ["Не начинать строгую диету до анализов без совета"] }
    ),
    sources: [S.nhsCoeliac],
  },
  {
    id: "crohns-disease",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["Crohn's", "Crohns disease", "inflammatory bowel diarrhoea blood"],
      fr: ["Crohn", "maladie de Crohn", "MICI diarrhée sang"],
      he: ["קרוהן", "מחלת מעי דלקתית שלשול דם"],
      ru: ["болезнь Крона", "ВЗК понос кровь"],
    },
    titles: { en: "Crohn's disease (orientation)", fr: "Maladie de Crohn (orientation)", he: "מחלת קרוהן (הכוונה)", ru: "Болезнь Крона (ориентация)" },
    guidance: g(
      { summary: "Crohn's is an inflammatory bowel disease causing diarrhoea, abdominal pain, weight loss, sometimes blood/mucus. NHS: GP/gastroenterology for diagnosis. Flare with severe pain, high fever, persistent vomiting, or heavy bleeding needs urgent care. Immunosuppressants/biologics are specialist-prescribed only.", emergencyIf: ["Severe abdominal pain with fever/vomiting", "Heavy rectal bleeding", "Signs of obstruction (severe bloating, no stool/gas, vomiting)"], seeDoctorIf: ["Persistent diarrhoea, pain, weight loss, blood in stool"], doNot: ["Do not invent steroid/biologic regimens", "Do not stop prescribed IBD medicines without advice"] },
      { summary: "La maladie de Crohn est une MICI. Médecin/gastro. Urgence si douleur sévère, fièvre, vomissements, saignement abondant. Pas de biothérapies inventées.", emergencyIf: ["Douleur sévère + fièvre/vomissements", "Saignement abondant", "Signes d'occlusion"], seeDoctorIf: ["Diarrhée/douleur/amaigrissement/sang persistants"], doNot: ["Pas de corticoïdes/biologiques inventés"] },
      { summary: "קרוהן היא מחלת מעי דלקתית. רופא/גסטרו. חירום בכאב חזק, חום, הקאות, דימום כבד. אין ביולוגיים מומצאים.", emergencyIf: ["כאב חזק + חום/הקאות", "דימום כבד", "סימני חסימה"], seeDoctorIf: ["שלשול/כאב/ירידה במשקל/דם מתמשכים"], doNot: ["אין סטרואידים/ביולוגיים מומצאים"] },
      { summary: "Болезнь Крона — ВЗК. К врачу/гастро. Неотложка при сильной боли, лихорадке, рвоте, обильном кровотечении. Биопрепараты не выдумывать.", emergencyIf: ["Сильная боль + лихорадка/рвота", "Обильное кровотечение", "Признаки непроходимости"], seeDoctorIf: ["Стойкие диарея/боль/похудение/кровь"], doNot: ["Не изобретать стероиды/биопрепараты"] }
    ),
    sources: [S.nhsCrohns],
  },
  {
    id: "ulcerative-colitis",
    category: "gi",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["ulcerative colitis", "UC bloody diarrhoea", "inflammatory bowel colitis"],
      fr: ["rectocolite hémorragique", "RCH diarrhée sanglante", "colite ulcéreuse"],
      he: ["קוליטיס כיבית", "שלשול דמי", "דלקת מעי גס כיבית"],
      ru: ["язвенный колит", "кровавая диарея", "ЯК"],
    },
    titles: { en: "Ulcerative colitis (orientation)", fr: "Rectocolite hémorragique (orientation)", he: "קוליטיס כיבית (הכוונה)", ru: "Язвенный колит (ориентация)" },
    guidance: g(
      { summary: "Ulcerative colitis causes bloody diarrhoea, urgency, and abdominal pain. NHS: specialist care. Severe flare (many bloody stools, fever, severe pain, dehydration) needs urgent/emergency assessment. Medicines are specialist-prescribed — no invented mesalazine/steroid doses.", emergencyIf: ["Severe bloody diarrhoea with fever, severe pain, or dehydration", "Dizziness/fainting with heavy bleeding"], seeDoctorIf: ["Bloody diarrhoea lasting days", "Known UC flare not responding to plan"], doNot: ["Do not invent UC drug regimens", "Do not stop maintenance therapy without advice"] },
      { summary: "La RCH provoque diarrhée sanglante et urgences défécatoires. Poussée sévère = urgence. Pas de posologies inventées.", emergencyIf: ["Diarrhée sanglante sévère + fièvre/douleur/déshydratation", "Malaise avec saignement"], seeDoctorIf: ["Diarrhée sanglante prolongée", "Poussée non contrôlée"], doNot: ["Pas de schémas inventés"] },
      { summary: "קוליטיס כיבית: שלשול דמי ודחיפות. התלקחות חמורה — חירום. אין מינונים מומצאים.", emergencyIf: ["שלשול דמי חמור + חום/כאב/התייבשות", "סחרחורת עם דימום"], seeDoctorIf: ["שלשול דמי ממושך", "התלקחות לא נשלטת"], doNot: ["אין מינונים מומצאים"] },
      { summary: "Язвенный колит: кровавая диарея и императивные позывы. Тяжёлое обострение — неотложка. Дозы не выдумывать.", emergencyIf: ["Тяжёлая кровавая диарея + лихорадка/боль/обезвоживание", "Головокружение с кровотечением"], seeDoctorIf: ["Длительная кровавая диарея", "Неконтролируемое обострение"], doNot: ["Не изобретать схемы препаратов"] }
    ),
    sources: [S.nhsUC],
  },
  {
    id: "b12-folate-anaemia",
    category: "general",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["B12 deficiency", "folate deficiency", "pernicious anaemia", "vitamin B12 anaemia"],
      fr: ["carence B12", "carence en folates", "anémie de Biermer"],
      he: ["חסר B12", "חסר חומצה פולית", "אנמיה מזיקה"],
      ru: ["дефицит B12", "дефицит фолатов", "пернициозная анемия"],
    },
    titles: { en: "B12 / folate deficiency anaemia", fr: "Anémie par carence B12 / folates", he: "אנמיה מחסר B12 / פולאט", ru: "Анемия при дефиците B12 / фолатов" },
    guidance: g(
      { summary: "B12/folate deficiency can cause tiredness, breathlessness, pale skin, pins and needles, glossitis. NHS: blood tests via GP; treatment is clinician-guided (diet, tablets, or injections). Never invent B12 injection schedules here.", seeDoctorIf: ["Symptoms of anaemia or neuropathy", "Known risk (diet, absorption disorders, metformin long-term — discuss testing)"], doNot: ["Do not invent B12 injection regimens", "Do not self-megadose without advice"] },
      { summary: "Carence B12/folates : fatigue, dyspnée, paresthésies. Bilans chez le médecin. Pas de schémas d'injections inventés.", seeDoctorIf: ["Signes d'anémie ou de neuropathie"], doNot: ["Pas d'injections de B12 inventées"] },
      { summary: "חסר B12/פולאט: עייפות, קוצר נשימה, נימול. בדיקות אצל רופא. אין לוח זריקות מומצא.", seeDoctorIf: ["סימני אנמיה או נוירופתיה"], doNot: ["אין זריקות B12 מומצאות"] },
      { summary: "Дефицит B12/фолатов: усталость, одышка, парестезии. Анализы у врача. Схемы инъекций не выдумывать.", seeDoctorIf: ["Признаки анемии или нейропатии"], doNot: ["Не изобретать схемы инъекций B12"] }
    ),
    sources: [S.nhsB12],
  },
  {
    id: "addisons-disease",
    category: "endocrine",
    urgencyDefault: "voir_medecin",
    priority: 6,
    keywords: {
      en: ["Addison's", "Addisons disease", "adrenal insufficiency crisis", "steroid dependent adrenal"],
      fr: ["Addison", "insuffisance surrénale", "crise surrénalienne"],
      he: ["אדיסון", "אי ספיקת אדרנל", "משבר אדרנלי"],
      ru: ["болезнь Аддисона", "надпочечниковая недостаточность", "адреналовый криз"],
    },
    titles: { en: "Addison's / adrenal insufficiency cues", fr: "Addison / insuffisance surrénale", he: "אדיסון / אי־ספיקת אדרנל", ru: "Аддисон / недостаточность надпочечников" },
    guidance: g(
      { summary: "Addison's disease is adrenal hormone deficiency. Crisis (severe vomiting, dehydration, shock, collapse) is an emergency — people on replacement steroids often have a sick-day / injection plan from their team. This pack never invents hydrocortisone doses; follow the person's prescribed emergency plan and call services.", emergencyIf: ["Known Addison's with vomiting, severe weakness, collapse, confusion — emergency + follow prescribed crisis plan", "Suspected adrenal crisis: severe dehydration, low blood pressure symptoms, collapse"], seeDoctorIf: ["Unexplained fatigue, weight loss, dizziness, salt craving, darkening skin — GP assessment"], doNot: ["Do not invent steroid replacement doses", "Do not stop prescribed steroids abruptly"] },
      { summary: "L'insuffisance surrénale peut mener à une crise = urgence. Suivre le plan prescrit ; pas de doses inventées.", emergencyIf: ["Addison connu + vomissements/collapsus — urgence + plan de crise", "Suspicion de crise surrénalienne"], seeDoctorIf: ["Fatigue, amaigrissement, vertiges, envie de sel, pigmentation"], doNot: ["Pas de doses d'hydrocortisone inventées", "Ne pas arrêter les corticoïdes brusquement"] },
      { summary: "אי־ספיקת אדרנל עלולה לגרום למשבר — חירום. לפי תוכנית אישית שנרשמה; אין מינונים מומצאים.", emergencyIf: ["אדיסון ידוע + הקאות/התמוטטות — חירום + תוכנית משבר", "חשד למשבר אדרנלי"], seeDoctorIf: ["עייפות, ירידה במשקל, סחרחורת, תשוקה למלח, פיגמנטציה"], doNot: ["אין מינון הידרוקורטיזון מומצא", "לא להפסיק סטרואידים בבת אחת"] },
      { summary: "Недостаточность надпочечников может дать криз — неотложка. Следовать личному плану; дозы не выдумывать.", emergencyIf: ["Известный Аддисон + рвота/коллапс — неотложка + кризисный план", "Подозрение на адреналовый криз"], seeDoctorIf: ["Усталость, похудение, головокружение, тяга к соли, пигментация"], doNot: ["Не изобретать дозы гидрокортизона", "Не резко отменять стероиды"] }
    ),
    sources: [S.nhsAddisons],
  },
  {
    id: "epilepsy-orientation",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 5,
    keywords: {
      en: ["epilepsy", "epileptic seizures ongoing", "known epilepsy medication"],
      fr: ["épilepsie", "crises d'épilepsie connues", "traitement antiépileptique"],
      he: ["אפילפסיה", "פרכוסים ידועים", "תרופות לאפילפסיה"],
      ru: ["эпилепсия", "известные приступы", "противоэпилептические препараты"],
    },
    titles: { en: "Epilepsy (living with — orientation)", fr: "Épilepsie (orientation)", he: "אפילפסיה (הכוונה)", ru: "Эпилепсия (ориентация)" },
    guidance: g(
      { summary: "Epilepsy is a tendency to recurrent seizures. For a seizure in progress use the seizure-first-aid entry. NHS: neurology follow-up; never invent anti-epileptic doses or stop medicines abruptly. Emergency if prolonged/repeated seizures (status cues).", emergencyIf: ["Seizure lasting >5 minutes or repeated without recovery — emergency", "First seizure — emergency assessment"], seeDoctorIf: ["Change in seizure pattern", "Medication side effects", "Pregnancy with epilepsy — specialist advice"], doNot: ["Do not invent anti-epileptic regimens", "Do not stop AEDs suddenly without specialist advice"] },
      { summary: "L'épilepsie = crises récurrentes. Gestes d'urgence : fiche crise. Neurologue ; pas d'antiépileptiques inventés. Urgence si crise >5 min.", emergencyIf: ["Crise > 5 min ou répétées", "Première crise"], seeDoctorIf: ["Changement de profil", "Effets indésirables", "Grossesse"], doNot: ["Pas d'antiépileptiques inventés", "Ne pas arrêter brusquement"] },
      { summary: "אפילפסיה: נטייה לפרכוסים חוזרים. עזרה ראשונה — ערך פרכוס. נוירולוג; אין תרופות מומצאות. חירום אם מעל 5 דקות.", emergencyIf: ["פרכוס מעל 5 דקות או חוזר", "פרכוס ראשון"], seeDoctorIf: ["שינוי בדפוס", "תופעות לוואי", "הריון"], doNot: ["אין נוגדי פרכוס מומצאים", "לא להפסיק בבת אחת"] },
      { summary: "Эпилепсия — склонность к повторным приступам. Первая помощь — карточка приступа. Невролог; препараты не выдумывать. Неотложка если >5 мин.", emergencyIf: ["Приступ >5 мин или повторы", "Первый приступ"], seeDoctorIf: ["Изменение характера", "Побочные эффекты", "Беременность"], doNot: ["Не изобретать ПЭП", "Не отменять резко"] }
    ),
    sources: [S.nhsEpilepsy],
  },
  {
    id: "parkinsons-disease",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["Parkinson's", "Parkinson tremor stiffness", "shuffling gait slow movement"],
      fr: ["Parkinson", "tremblement rigidité Parkinson", "marche à petits pas"],
      he: ["פרקינסון", "רעד ונוקשות פרקינסון", "הליכה בצעדים קטנים"],
      ru: ["болезнь Паркинсона", "тремор скованность Паркинсон", "шаркающая походка"],
    },
    titles: { en: "Parkinson's disease (orientation)", fr: "Maladie de Parkinson (orientation)", he: "מחלת פרקינסון (הכוונה)", ru: "Болезнь Паркинсона (ориентация)" },
    guidance: g(
      { summary: "Parkinson's can cause tremor, stiffness, slowness, and gait changes. NHS: GP/neurology for diagnosis and treatment. Medicines timing matters — never invent levodopa regimens. Falls and swallowing problems need clinical review; emergency for injury after falls or choking.", emergencyIf: ["Choking / unable to breathe", "Serious injury after a fall"], seeDoctorIf: ["New tremor, stiffness, or slowed movement", "Known Parkinson's with falls, swallowing difficulty, or medication wearing-off"], doNot: ["Do not invent levodopa/agonist regimens", "Do not stop Parkinson's medicines abruptly"] },
      { summary: "Parkinson : tremblement, rigidité, akinésie. Neurologue. Pas de lévodopa inventée. Urgence si fausse route/chute grave.", emergencyIf: ["Étouffement", "Blessure grave après chute"], seeDoctorIf: ["Nouveau tremblement/rigidité", "Chutes / dysphagie / échappement thérapeutique"], doNot: ["Pas de lévodopa inventée"] },
      { summary: "פרקינסון: רעד, נוקשות, איטיות. נוירולוג. אין לבודופה מומצאת. חירום בחנק/פציעה מנפילה.", emergencyIf: ["חנק", "פציעה קשה מנפילה"], seeDoctorIf: ["רעד/נוקשות חדשים", "נפילות / קושי בליעה"], doNot: ["אין לבודופה מומצאת"] },
      { summary: "Паркинсон: тремор, скованность, замедленность. Невролог. Леводопу не выдумывать. Неотложка при удушье/тяжёлой травме от падения.", emergencyIf: ["Удушье", "Тяжёлая травма после падения"], seeDoctorIf: ["Новый тремор/скованность", "Падения / дисфагия"], doNot: ["Не изобретать леводопу"] }
    ),
    sources: [S.nhsParkinsons],
  },
  {
    id: "multiple-sclerosis",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 3,
    keywords: {
      en: ["multiple sclerosis", "MS relapse numbness vision", "optic neuritis MS"],
      fr: ["sclérose en plaques", "poussée SEP engourdissement vision", "névrite optique"],
      he: ["טרשת נפוצה", "התקף MS נימול ראייה", "דלקת עצב הראייה"],
      ru: ["рассеянный склероз", "обострение РС онемение зрение", "неврит зрительного нерва"],
    },
    titles: { en: "Multiple sclerosis (orientation)", fr: "Sclérose en plaques (orientation)", he: "טרשת נפוצה (הכוונה)", ru: "Рассеянный склероз (ориентация)" },
    guidance: g(
      { summary: "MS can cause episodic neurological symptoms (numbness, weakness, vision changes, balance problems). NHS: neurology pathways. New/worsening symptoms need prompt clinical contact; sudden severe deficits use stroke/emergency pathways when appropriate. DMTs/steroids for relapses are specialist-prescribed only.", emergencyIf: ["Sudden face/arm/speech stroke signs", "Sudden severe vision loss", "Inability to walk suddenly with other red flags"], seeDoctorIf: ["New neurological symptoms lasting days", "Known MS relapse symptoms"], doNot: ["Do not invent MS drug or relapse steroid regimens"] },
      { summary: "La SEP provoque des symptômes neurologiques épisodiques. Neurologue. Urgence si signes d'AVC/perte visuelle brutale. Pas de traitements inventés.", emergencyIf: ["Signes d'AVC", "Perte visuelle brutale", "Impotence motrice brutale avec alarmes"], seeDoctorIf: ["Nouveaux symptômes neurologiques", "Poussée connue"], doNot: ["Pas de schémas de poussée inventés"] },
      { summary: "טרשת נפוצה: תסמינים נוירולוגיים התקפיים. נוירולוג. חירום בדגלי שבץ/אובדן ראייה פתאומי. אין מינונים מומצאים.", emergencyIf: ["דגלי שבץ", "אובדן ראייה פתאומי", "אי יכולת ללכת פתאומית עם אזעקות"], seeDoctorIf: ["תסמינים נוירולוגיים חדשים", "התקף ידוע"], doNot: ["אין מינון להתקף מומצא"] },
      { summary: "РС даёт эпизодические неврологические симптомы. Невролог. Неотложка при признаках инсульта/внезапной потере зрения. Схемы не выдумывать.", emergencyIf: ["Признаки инсульта", "Внезапная потеря зрения", "Внезапная невозможность ходить с красными флагами"], seeDoctorIf: ["Новые неврологические симптомы", "Известное обострение"], doNot: ["Не изобретать схемы при обострении"] }
    ),
    sources: [S.nhsMS],
  },
  {
    id: "trigeminal-neuralgia",
    category: "neuro",
    urgencyDefault: "voir_medecin",
    priority: 4,
    keywords: {
      en: ["trigeminal neuralgia", "electric shock face pain", "stabbing facial pain trigger"],
      fr: ["névralgie du trijumeau", "douleur électrique visage", "éclair douloureux face"],
      he: ["נוירלגיה של העצב המשולש", "כאב חשמלי בפנים"],
      ru: ["невралгия тройничного нерва", "электрическая боль в лице"],
    },
    titles: { en: "Trigeminal neuralgia", fr: "Névralgie du trijumeau", he: "נוירלגיה טריגמינלית", ru: "Невралгия тройничного нерва" },
    guidance: g(
      { summary: "Trigeminal neuralgia causes brief electric-shock facial pain triggered by touch/chewing. NHS: see a GP for assessment; medicines are clinician-prescribed (e.g. certain anticonvulsants) — never invent carbamazepine doses. Sudden different 'worst headache' or stroke signs need emergency pathways.", emergencyIf: ["Sudden worst headache of life", "Facial weakness, speech difficulty, or other stroke signs with facial pain"], seeDoctorIf: ["Recurrent electric-shock facial pain", "Pain preventing eating/drinking"], doNot: ["Do not invent carbamazepine or other neuralgia drug regimens"] },
      { summary: "La névralgie du trijumeau provoque des éclairs douloureux. Médecin ; pas de carbamazépine inventée. Urgence si céphalée maximale/signes d'AVC.", emergencyIf: ["Céphalée maximale brutale", "Signes d'AVC"], seeDoctorIf: ["Douleurs électriques récurrentes", "Impossibilité de manger/boire"], doNot: ["Pas de carbamazépine inventée"] },
      { summary: "נוירלגיה טריגמינלית: כאב חשמלי קצר בפנים. רופא; אין קרבמזפין מומצא. חירום בכאב ראש מקסימלי/שבץ.", emergencyIf: ["כאב ראש מקסימלי פתאומי", "דגלי שבץ"], seeDoctorIf: ["כאבים חשמליים חוזרים", "לא יכול לאכול/לשתות"], doNot: ["אין קרבמזפין מומצא"] },
      { summary: "Невралгия тройничного нерва: короткие электрические боли в лице. Врач; карбамазепин не выдумывать. Неотложка при максимальной головной боли/инсульте.", emergencyIf: ["Внезапная максимальная головная боль", "Признаки инсульта"], seeDoctorIf: ["Повторяющиеся электрические боли", "Нельзя есть/пить"], doNot: ["Не изобретать карбамазепин"] }
    ),
    sources: [S.nhsTN],
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
meta.version = "1.7.0";
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

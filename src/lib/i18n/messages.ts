import type { Locale } from "./locales";
import type { UrgencyLevel } from "@/lib/types";

export type Messages = {
  brand: string;
  brandTagline: string;
  metaTitle: string;
  metaDescription: string;
  nav: { home: string; consult: string; history: string; main: string };
  language: string;
  home: {
    headline: string;
    support: string;
    ctaConsult: string;
    ctaHistory: string;
    panelTitle: string;
    panelBody: string;
    howTitle: string;
    howBody: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    emergencies: string;
  };
  consult: {
    describeTitle: string;
    describeBody: string;
    symptomsLabel: string;
    symptomsPlaceholder: string;
    getOrientation: string;
    analyzing: string;
    consultationTitle: string;
    consultationHint: string;
    newSession: string;
    you: string;
    assistant: string;
    followUpLabel: string;
    followUpPlaceholder: string;
    send: string;
    sending: string;
    resultPlaceholder: string;
    needSymptoms: string;
    mockBanner: string;
    thinking: string;
  };
  images: {
    label: string;
    hint: string;
    add: string;
    remove: string;
    tooLarge: string;
  };
  history: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    start: string;
    open: string;
    erase: string;
    consultation: string;
    emergencyFlag: string;
    urgencyUrgent: string;
    urgencySelfCare: string;
    urgencySeeDoctor: string;
  };
  assessment: {
    aria: string;
    summary: string;
    causes: string;
    confidence: string;
    questions: string;
    nextSteps: string;
    exams: string;
    sources: string;
    mockNote: string;
    groundedNote: string;
    geminiNote: string;
  };
  urgency: Record<
    UrgencyLevel,
    { title: string; hint: string }
  >;
  confidence: {
    faible: string;
    moyenne: string;
    élevée: string;
  };
  disclaimer: {
    medicalLabel: string;
    importantLabel: string;
    privacyLabel: string;
    short: string;
    long: string;
    privacy: string;
  };
  emergency: {
    title: string;
    body: string;
    france: string;
    israel: string;
  };
  footer: {
    copyright: string;
  };
  errors: {
    unexpected: string;
    analysisFailed: string;
    ticketFailed: string;
    unreadable: string;
  };
};

const en: Messages = {
  brand: "Doctor IA",
  brandTagline: "Assisted medical orientation",
  metaTitle: "Doctor IA — Assisted medical orientation",
  metaDescription:
    "Describe your symptoms, add photos if needed, and receive careful orientation (not a diagnosis).",
  nav: {
    home: "Home",
    consult: "Consult",
    history: "History",
    main: "Main navigation",
  },
  language: "Language",
  home: {
    headline: "Clear orientation when symptoms worry you.",
    support:
      "Describe what you feel, attach a photo if helpful, and receive careful leads — never a definitive diagnosis.",
    ctaConsult: "Start a consultation",
    ctaHistory: "View history",
    panelTitle: "Listen.\nTriage.\nOrient.",
    panelBody: "Built for clinical clarity — not to replace a doctor.",
    howTitle: "How it works",
    howBody: "A simple, mobile-first path with emergency guardrails.",
    step1Title: "Describe",
    step1Body:
      "Explain your symptoms with useful context (duration, intensity).",
    step2Title: "Illustrate",
    step2Body: "Optionally add photos of skin, rash, or injury.",
    step3Title: "Orient",
    step3Body:
      "Receive ranked possible causes, an urgency level, and next steps.",
    emergencies:
      "Emergencies France: 15 / 112 — Israel: 101 (MDA), 100 (police), 102 (fire).",
  },
  consult: {
    describeTitle: "Describe your symptoms",
    describeBody:
      "Free text. Add photos if helpful (skin, rash, injury…). Replies match your selected language.",
    symptomsLabel: "Symptoms",
    symptomsPlaceholder:
      "e.g. Since last night, fever 38.5 °C, sore throat and fatigue. No breathing difficulty…",
    getOrientation: "Get orientation",
    analyzing: "Analyzing",
    consultationTitle: "Consultation",
    consultationHint: "Refine your description in the conversation thread.",
    newSession: "New",
    you: "You",
    assistant: "Doctor IA",
    followUpLabel: "Follow-up message",
    followUpPlaceholder: "Clarify: duration, intensity, triggers…",
    send: "Send",
    sending: "Sending",
    resultPlaceholder: "Structured orientation will appear here.",
    needSymptoms: "Describe your symptoms to begin.",
    mockBanner:
      "Demo mode — analysis service unavailable; replies shown are simulated.",
    thinking: "Doctor IA is thinking",
  },
  images: {
    label: "Photos (optional)",
    hint: "Skin, rash, injury… up to {max} images. Do not photograph ID documents.",
    add: "Add photos",
    remove: "Remove",
    tooLarge: "« {name} » exceeds ~0.65 MB.",
  },
  history: {
    title: "History",
    subtitle: "Consultations saved locally in this browser (device).",
    emptyTitle: "No consultations saved",
    emptyBody: "Sessions from this browser will appear here.",
    start: "Start",
    open: "Open",
    erase: "Delete",
    consultation: "Consultation",
    emergencyFlag: "emergency alert",
    urgencyUrgent: "Urgent",
    urgencySelfCare: "Self-care",
    urgencySeeDoctor: "See a doctor",
  },
  assessment: {
    aria: "Orientation result",
    summary: "Summary",
    causes: "Possible causes (ranked)",
    confidence: "confidence",
    questions: "Clarifying questions",
    nextSteps: "What to do next",
    exams: "Exams / imaging / labs",
    sources: "Public sources",
    mockNote: "Demo mode (no API key) — sample replies.",
    groundedNote: "Generated with Google Gemini and Google Search when available.",
    geminiNote: "Generated with Google Gemini.",
  },
  urgency: {
    urgent: {
      title: "Urgent",
      hint: "Contact emergency services without delay",
    },
    voir_medecin: {
      title: "See a doctor soon",
      hint: "Book promptly or visit urgent care",
    },
    auto_soins: {
      title: "Self-care possible",
      hint: "Home monitoring with caution — see a doctor if it worsens",
    },
  },
  confidence: {
    faible: "low",
    moyenne: "medium",
    élevée: "high",
  },
  disclaimer: {
    medicalLabel: "Medical disclaimer. ",
    importantLabel: "Important: ",
    privacyLabel: "Privacy & processing. ",
    short:
      "Doctor IA is not a doctor and does not replace a consultation. In an emergency, call 15 / 112 (France) or 101 (Israel — Magen David Adom).",
    long:
      "Information from Doctor IA is educational orientation only. It is not a diagnosis, prescription, or personalized medical advice. See a qualified clinician for medical decisions. For severe symptoms or emergencies, contact emergency services immediately.",
    privacy:
      "By submitting, your description (and any photos) is sent to Google Gemini to generate orientation. Do not enter identity data (name, social security number, etc.). Without a server API key, a local demo mode is used.",
  },
  emergency: {
    title: "Possible emergency — call for help",
    body: "If you have chest pain, stroke signs, severe breathing difficulty, heavy bleeding, anaphylaxis, or suicidal thoughts, do not wait.",
    france: "France",
    israel: "Israel",
  },
  footer: {
    copyright: "© 2026 Doctor IA — assisted medical orientation",
  },
  errors: {
    unexpected: "Unexpected error",
    analysisFailed: "Analysis failed",
    ticketFailed: "Could not start analysis ({status}). Please retry.",
    unreadable: "Server error ({status}). Please retry in a moment.",
  },
};

const fr: Messages = {
  brand: "Doctor IA",
  brandTagline: "Orientation médicale assistée",
  metaTitle: "Doctor IA — Orientation médicale assistée",
  metaDescription:
    "Décrivez vos symptômes, ajoutez des photos si besoin, et recevez une orientation prudente (pas un diagnostic).",
  nav: {
    home: "Accueil",
    consult: "Consulter",
    history: "Historique",
    main: "Navigation principale",
  },
  language: "Langue",
  home: {
    headline: "Une orientation claire quand les symptômes inquiètent.",
    support:
      "Décrivez ce que vous ressentez, joignez une photo si besoin, et recevez des pistes prudentes — jamais un diagnostic définitif.",
    ctaConsult: "Commencer une consultation",
    ctaHistory: "Voir l’historique",
    panelTitle: "Écoute.\nTriage.\nOrientation.",
    panelBody: "Conçu pour la clarté clinique — pas pour remplacer un médecin.",
    howTitle: "Comment ça marche",
    howBody: "Un parcours simple, pensé pour le mobile, avec des garde-fous d’urgence.",
    step1Title: "Décrire",
    step1Body:
      "Expliquez vos symptômes avec le contexte utile (durée, intensité).",
    step2Title: "Illustrer",
    step2Body: "Ajoutez éventuellement des photos de peau, d’éruption ou de blessure.",
    step3Title: "S’orienter",
    step3Body:
      "Recevez des causes possibles classées, un niveau d’urgence, et la suite à donner.",
    emergencies:
      "Urgences France : 15 / 112 — Israël : 101 (MDA), 100 (police), 102 (pompiers).",
  },
  consult: {
    describeTitle: "Décrivez vos symptômes",
    describeBody:
      "Texte libre. Ajoutez des photos si cela aide (peau, éruption, blessure…). Les réponses suivent la langue choisie.",
    symptomsLabel: "Symptômes",
    symptomsPlaceholder:
      "Ex. : Depuis hier soir, fièvre à 38,5 °C, mal de gorge et fatigue. Pas de difficulté à respirer…",
    getOrientation: "Obtenir une orientation",
    analyzing: "Analyse en cours",
    consultationTitle: "Consultation",
    consultationHint: "Affinez votre description dans le fil de discussion.",
    newSession: "Nouvelle",
    you: "Vous",
    assistant: "Doctor IA",
    followUpLabel: "Message de suivi",
    followUpPlaceholder: "Précisez : durée, intensité, facteurs déclenchants…",
    send: "Envoyer",
    sending: "Envoi",
    resultPlaceholder: "L’orientation structurée apparaîtra ici.",
    needSymptoms: "Décrivez vos symptômes pour commencer.",
    mockBanner:
      "Mode démonstration — le service d’analyse n’est pas disponible ; les réponses affichées sont simulées.",
    thinking: "Doctor IA réfléchit",
  },
  images: {
    label: "Photos (optionnel)",
    hint: "Peau, éruption, blessure… jusqu’à {max} images. Ne photographiez pas de documents d’identité.",
    add: "Ajouter des photos",
    remove: "Retirer",
    tooLarge: "« {name} » dépasse ~0,65 Mo.",
  },
  history: {
    title: "Historique",
    subtitle: "Consultations enregistrées localement dans ce navigateur (appareil).",
    emptyTitle: "Aucune consultation enregistrée",
    emptyBody: "Les sessions de ce navigateur apparaîtront ici.",
    start: "Démarrer",
    open: "Ouvrir",
    erase: "Effacer",
    consultation: "Consultation",
    emergencyFlag: "alerte urgence",
    urgencyUrgent: "Urgent",
    urgencySelfCare: "Auto-soins",
    urgencySeeDoctor: "Voir un médecin",
  },
  assessment: {
    aria: "Résultat d’orientation",
    summary: "Synthèse",
    causes: "Causes possibles (classées)",
    confidence: "confiance",
    questions: "Questions pour préciser",
    nextSteps: "Que faire ensuite",
    exams: "Examens / imagerie / laboratoire",
    sources: "Sources publiques",
    mockNote: "Mode démonstration (aucune clé API) — réponses d’exemple.",
    groundedNote:
      "Réponse générée via Google Gemini avec recherche Google lorsque disponible.",
    geminiNote: "Réponse générée via Google Gemini.",
  },
  urgency: {
    urgent: {
      title: "Urgent",
      hint: "Contactez les secours ou les urgences sans délai",
    },
    voir_medecin: {
      title: "Voir un médecin bientôt",
      hint: "Prenez rendez-vous rapidement ou consultez une permanence",
    },
    auto_soins: {
      title: "Auto-soins possibles",
      hint: "Surveillance à domicile avec prudence — consultez si aggravation",
    },
  },
  confidence: {
    faible: "faible",
    moyenne: "moyenne",
    élevée: "élevée",
  },
  disclaimer: {
    medicalLabel: "Avertissement médical. ",
    importantLabel: "Important : ",
    privacyLabel: "Confidentialité & traitement. ",
    short:
      "Doctor IA n'est pas un médecin et ne remplace pas une consultation. En cas d'urgence, appelez le 15 / 112 (France) ou le 101 (Israël — Magen David Adom).",
    long:
      "Les informations fournies par Doctor IA sont à titre éducatif et d'orientation uniquement. Elles ne constituent pas un diagnostic, une prescription ni un avis médical personnalisé. Consultez un professionnel de santé qualifié pour toute décision médicale. En cas de symptômes graves ou d'urgence, contactez immédiatement les services d'urgence.",
    privacy:
      "En envoyant, votre description (et photos éventuelles) est transmise à Google Gemini pour générer une orientation. Ne saisissez pas de données d’identité (nom, n° de sécurité sociale, etc.). Sans clé API côté serveur, un mode démonstration local est utilisé.",
  },
  emergency: {
    title: "Urgence possible — appelez les secours",
    body: "Si vous présentez une douleur thoracique, des signes d’AVC, une difficulté respiratoire sévère, un saignement abondant, une anaphylaxie ou des idées suicidaires, n’attendez pas.",
    france: "France",
    israel: "Israël",
  },
  footer: {
    copyright: "© 2026 Doctor IA — orientation médicale assistée",
  },
  errors: {
    unexpected: "Erreur inattendue",
    analysisFailed: "Échec de l’analyse",
    ticketFailed: "Impossible de démarrer l’analyse ({status}). Réessayez.",
    unreadable: "Erreur serveur ({status}). Réessayez dans un instant.",
  },
};

const he: Messages = {
  brand: "Doctor IA",
  brandTagline: "הכוונה רפואית בסיוע בינה מלאכותית",
  metaTitle: "Doctor IA — הכוונה רפואית",
  metaDescription:
    "תארו את התסמינים, הוסיפו תמונות במידת הצורך, וקבלו הכוונה זהירה (לא אבחנה).",
  nav: {
    home: "בית",
    consult: "ייעוץ",
    history: "היסטוריה",
    main: "ניווט ראשי",
  },
  language: "שפה",
  home: {
    headline: "הכוונה ברורה כשהתסמינים מדאיגים.",
    support:
      "תארו מה אתם מרגישים, צרפו תמונה אם זה עוזר, וקבלו כיוונים זהירים — לעולם לא אבחנה סופית.",
    ctaConsult: "התחלת ייעוץ",
    ctaHistory: "צפייה בהיסטוריה",
    panelTitle: "הקשבה.\nמיון.\nהכוונה.",
    panelBody: "נבנה לבהירות קלינית — לא כדי להחליף רופא.",
    howTitle: "איך זה עובד",
    howBody: "מסלול פשוט לנייד, עם הגנות למקרי חירום.",
    step1Title: "תיאור",
    step1Body: "הסבירו את התסמינים עם הקשר שימושי (משך, עוצמה).",
    step2Title: "המחשה",
    step2Body: "אפשר להוסיף תמונות של עור, פריחה או פציעה.",
    step3Title: "הכוונה",
    step3Body: "קבלו סיבות אפשריות מדורגות, רמת דחיפות וצעדים הבאים.",
    emergencies:
      "חירום צרפת: 15 / 112 — ישראל: 101 (מד״א), 100 (משטרה), 102 (כיבוי).",
  },
  consult: {
    describeTitle: "תארו את התסמינים",
    describeBody:
      "טקסט חופשי. הוסיפו תמונות אם זה עוזר. התשובות יתאימו לשפה שנבחרה.",
    symptomsLabel: "תסמינים",
    symptomsPlaceholder:
      "לדוגמה: מאז אמש חום 38.5°, כאב גרון ועייפות. אין קושי בנשימה…",
    getOrientation: "קבלת הכוונה",
    analyzing: "מנתח",
    consultationTitle: "ייעוץ",
    consultationHint: "דייקו את התיאור בשרשור השיחה.",
    newSession: "חדש",
    you: "אתם",
    assistant: "Doctor IA",
    followUpLabel: "הודעת המשך",
    followUpPlaceholder: "דיוק: משך, עוצמה, גורמים מעוררים…",
    send: "שליחה",
    sending: "שולח",
    resultPlaceholder: "ההכוונה המובנית תופיע כאן.",
    needSymptoms: "תארו את התסמינים כדי להתחיל.",
    mockBanner:
      "מצב הדגמה — שירות הניתוח אינו זמין; התשובות המוצגות מדומות.",
    thinking: "Doctor IA חושב",
  },
  images: {
    label: "תמונות (אופציונלי)",
    hint: "עור, פריחה, פציעה… עד {max} תמונות. אל תצלמו מסמכי זהות.",
    add: "הוספת תמונות",
    remove: "הסרה",
    tooLarge: "« {name} » גדול מ־כ־0.65 מ״ב.",
  },
  history: {
    title: "היסטוריה",
    subtitle: "ייעוצים שנשמרו מקומית בדפדפן זה (מכשיר).",
    emptyTitle: "אין ייעוצים שמורים",
    emptyBody: "הפעלות מהדפדפן הזה יופיעו כאן.",
    start: "התחלה",
    open: "פתיחה",
    erase: "מחיקה",
    consultation: "ייעוץ",
    emergencyFlag: "התראת חירום",
    urgencyUrgent: "דחוף",
    urgencySelfCare: "טיפול עצמי",
    urgencySeeDoctor: "לראות רופא",
  },
  assessment: {
    aria: "תוצאת הכוונה",
    summary: "סיכום",
    causes: "סיבות אפשריות (מדורגות)",
    confidence: "ביטחון",
    questions: "שאלות להבהרה",
    nextSteps: "מה לעשות הלאה",
    exams: "בדיקות / הדמיה / מעבדה",
    sources: "מקורות ציבוריים",
    mockNote: "מצב הדגמה (אין מפתח API) — תשובות לדוגמה.",
    groundedNote: "נוצר עם Google Gemini וחיפוש Google כשזמין.",
    geminiNote: "נוצר עם Google Gemini.",
  },
  urgency: {
    urgent: {
      title: "דחוף",
      hint: "פנו לשירותי חירום ללא דיחוי",
    },
    voir_medecin: {
      title: "לראות רופא בקרוב",
      hint: "קבעו תור במהירות או פנו למיון/רפואה דחופה",
    },
    auto_soins: {
      title: "טיפול עצמי אפשרי",
      hint: "מעקב בבית בזהירות — פנו לרופא אם יש החמרה",
    },
  },
  confidence: {
    faible: "נמוך",
    moyenne: "בינוני",
    élevée: "גבוה",
  },
  disclaimer: {
    medicalLabel: "הצהרה רפואית. ",
    importantLabel: "חשוב: ",
    privacyLabel: "פרטיות ועיבוד. ",
    short:
      "Doctor IA אינו רופא ואינו מחליף ייעוץ רפואי. בחירום התקשרו ל־15 / 112 (צרפת) או ל־101 (ישראל — מגן דוד אדום).",
    long:
      "המידע מ־Doctor IA הוא להכוונה חינוכית בלבד. אינו אבחנה, מרשם או ייעוץ רפואי אישי. פנו לאיש מקצוע מוסמך להחלטות רפואיות. בתסמינים חמורים או חירום — פנו מיד לשירותי חירום.",
    privacy:
      "בשליחה, התיאור (ותמונות אם יש) נשלח ל־Google Gemini ליצירת הכוונה. אל תזינו פרטי זהות. ללא מפתח API בשרת נעשה שימוש במצב הדגמה מקומי.",
  },
  emergency: {
    title: "חירום אפשרי — התקשרו לעזרה",
    body: "אם יש כאב בחזה, סימני שבץ, קושי נשימה חמור, דימום כבד, אנפילקסיס או מחשבות אובדניות — אל תחכו.",
    france: "צרפת",
    israel: "ישראל",
  },
  footer: {
    copyright: "© 2026 Doctor IA — הכוונה רפואית בסיוע",
  },
  errors: {
    unexpected: "שגיאה בלתי צפויה",
    analysisFailed: "הניתוח נכשל",
    ticketFailed: "לא ניתן להתחיל ניתוח ({status}). נסו שוב.",
    unreadable: "שגיאת שרת ({status}). נסו שוב בעוד רגע.",
  },
};

const ru: Messages = {
  brand: "Doctor IA",
  brandTagline: "Помощь в медицинской ориентации",
  metaTitle: "Doctor IA — Медицинская ориентация",
  metaDescription:
    "Опишите симптомы, при необходимости добавьте фото и получите осторожную ориентацию (не диагноз).",
  nav: {
    home: "Главная",
    consult: "Консультация",
    history: "История",
    main: "Основная навигация",
  },
  language: "Язык",
  home: {
    headline: "Понятная ориентация, когда симптомы тревожат.",
    support:
      "Опишите ощущения, приложите фото при необходимости и получите осторожные гипотезы — никогда не окончательный диагноз.",
    ctaConsult: "Начать консультацию",
    ctaHistory: "Смотреть историю",
    panelTitle: "Слушать.\nСортировать.\nОриентировать.",
    panelBody: "Для клинической ясности — не вместо врача.",
    howTitle: "Как это работает",
    howBody: "Простой мобильный путь с защитой при неотложных случаях.",
    step1Title: "Описать",
    step1Body: "Объясните симптомы с полезным контекстом (длительность, сила).",
    step2Title: "Показать",
    step2Body: "При желании добавьте фото кожи, сыпи или травмы.",
    step3Title: "Ориентироваться",
    step3Body:
      "Получите ранжированные возможные причины, уровень срочности и следующие шаги.",
    emergencies:
      "Экстренные службы Франция: 15 / 112 — Израиль: 101 (MDA), 100 (полиция), 102 (пожарные).",
  },
  consult: {
    describeTitle: "Опишите симптомы",
    describeBody:
      "Свободный текст. Добавьте фото, если это помогает. Ответы будут на выбранном языке.",
    symptomsLabel: "Симптомы",
    symptomsPlaceholder:
      "Напр.: С вчерашнего вечера температура 38,5 °C, боль в горле и усталость. Нет затруднения дыхания…",
    getOrientation: "Получить ориентацию",
    analyzing: "Анализ",
    consultationTitle: "Консультация",
    consultationHint: "Уточните описание в переписке.",
    newSession: "Новая",
    you: "Вы",
    assistant: "Doctor IA",
    followUpLabel: "Сообщение уточнения",
    followUpPlaceholder: "Уточните: длительность, интенсивность, триггеры…",
    send: "Отправить",
    sending: "Отправка",
    resultPlaceholder: "Структурированная ориентация появится здесь.",
    needSymptoms: "Опишите симптомы, чтобы начать.",
    mockBanner:
      "Демо-режим — сервис анализа недоступен; показанные ответы смоделированы.",
    thinking: "Doctor IA думает",
  },
  images: {
    label: "Фото (необязательно)",
    hint: "Кожа, сыпь, травма… до {max} изображений. Не фотографируйте документы.",
    add: "Добавить фото",
    remove: "Убрать",
    tooLarge: "« {name} » превышает ~0,65 МБ.",
  },
  history: {
    title: "История",
    subtitle: "Консультации, сохранённые локально в этом браузере (устройство).",
    emptyTitle: "Нет сохранённых консультаций",
    emptyBody: "Сессии этого браузера появятся здесь.",
    start: "Начать",
    open: "Открыть",
    erase: "Удалить",
    consultation: "Консультация",
    emergencyFlag: "тревога неотложности",
    urgencyUrgent: "Срочно",
    urgencySelfCare: "Самопомощь",
    urgencySeeDoctor: "К врачу",
  },
  assessment: {
    aria: "Результат ориентации",
    summary: "Кратко",
    causes: "Возможные причины (по рангу)",
    confidence: "уверенность",
    questions: "Уточняющие вопросы",
    nextSteps: "Что делать дальше",
    exams: "Обследования / визуализация / анализы",
    sources: "Публичные источники",
    mockNote: "Демо-режим (нет API-ключа) — примеры ответов.",
    groundedNote:
      "Сгенерировано через Google Gemini с поиском Google, если доступно.",
    geminiNote: "Сгенерировано через Google Gemini.",
  },
  urgency: {
    urgent: {
      title: "Срочно",
      hint: "Немедленно обратитесь в службу экстренной помощи",
    },
    voir_medecin: {
      title: "Скоро к врачу",
      hint: "Запишитесь быстро или обратитесь в неотложную помощь",
    },
    auto_soins: {
      title: "Возможна самопомощь",
      hint: "Наблюдение дома с осторожностью — к врачу при ухудшении",
    },
  },
  confidence: {
    faible: "низкая",
    moyenne: "средняя",
    élevée: "высокая",
  },
  disclaimer: {
    medicalLabel: "Медицинское предупреждение. ",
    importantLabel: "Важно: ",
    privacyLabel: "Конфиденциальность и обработка. ",
    short:
      "Doctor IA не является врачом и не заменяет консультацию. В экстренной ситуации звоните 15 / 112 (Франция) или 101 (Израиль — Маген Давид Адом).",
    long:
      "Информация Doctor IA носит образовательный и ориентирующий характер. Это не диагноз, не рецепт и не персональная медицинская рекомендация. Обращайтесь к квалифицированному специалисту. При тяжёлых симптомах или неотложном состоянии немедленно вызывайте экстренные службы.",
    privacy:
      "При отправке описание (и фото, если есть) передаётся в Google Gemini для ориентации. Не вводите данные удостоверения личности. Без серверного API-ключа используется локальный демо-режим.",
  },
  emergency: {
    title: "Возможна неотложность — вызовите помощь",
    body: "При боли в груди, признаках инсульта, тяжёлой одышке, сильном кровотечении, анафилаксии или суицидальных мыслях не ждите.",
    france: "Франция",
    israel: "Израиль",
  },
  footer: {
    copyright: "© 2026 Doctor IA — медицинская ориентация с ИИ",
  },
  errors: {
    unexpected: "Неожиданная ошибка",
    analysisFailed: "Сбой анализа",
    ticketFailed: "Не удалось начать анализ ({status}). Повторите.",
    unreadable: "Ошибка сервера ({status}). Повторите через мгновение.",
  },
};

export const MESSAGES: Record<Locale, Messages> = { en, fr, he, ru };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES.en;
}

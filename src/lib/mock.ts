import type { Assessment, ConsultRequest } from "./types";
import { disclaimerShort } from "./prompts";
import { detectEmergency } from "./emergency";
import { isLocale, type Locale } from "./i18n/locales";

function localeOf(req: ConsultRequest): Locale {
  return isLocale(req.locale) ? req.locale : "en";
}

type Pack = {
  respiratory: Assessment;
  skin: Assessment;
  headache: Assessment;
  generic: Assessment;
  emergencySummary: string;
  emergencyNext: string[];
  emergencyLabs: string[];
  emergencyReply: string;
};

function packFor(locale: Locale): Pack {
  const disclaimer = disclaimerShort(locale);

  if (locale === "fr") {
    return {
      respiratory: {
        summary:
          "D’après votre description, un syndrome infectieux des voies respiratoires hautes (type rhume ou grippe saisonnière) est plausible. Sans examen, d’autres causes restent possibles.",
        likelyCauses: [
          {
            title: "Infection virale des voies respiratoires (rhume / grippe)",
            rank: 1,
            rationale:
              "Association fréquente de fièvre, toux ou mal de gorge d’apparition progressive.",
            confidence: "moyenne",
          },
          {
            title: "Angine / pharyngite",
            rank: 2,
            rationale: "Douleur de gorge isolée ou dominante.",
            confidence: "faible",
          },
          {
            title: "Sinusite virale",
            rank: 3,
            rationale: "Congestion et pression faciale parfois associées.",
            confidence: "faible",
          },
        ],
        urgency: "auto_soins",
        clarifyingQuestions: [
          "Depuis combien de jours les symptômes ont-ils commencé ?",
          "Avez-vous une température mesurée ?",
          "Y a-t-il un essoufflement ou une douleur thoracique ?",
        ],
        nextSteps: [
          "Repos, hydratation et surveillance de la température.",
          "Voir un médecin si fièvre > 3 jours ou aggravation.",
        ],
        needsExamOrLabs: [
          "Examen clinique ORL si douleur de gorge intense.",
        ],
        disclaimer,
        mock: true,
      },
      skin: {
        summary:
          "Votre description évoque une irritation ou éruption cutanée. La photo seule ne confirme pas une cause précise.",
        likelyCauses: [
          {
            title: "Dermatite de contact / irritation",
            rank: 1,
            rationale: "Réaction locale après contact irritant ou allergène.",
            confidence: "moyenne",
          },
          {
            title: "Eczéma",
            rank: 2,
            rationale: "Plaques sèches prurigineuses.",
            confidence: "faible",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: [
          "La zone démange-t-elle ou est-elle douloureuse ?",
          "Nouveau produit cosmétique ou médicament ?",
        ],
        nextSteps: [
          "Éviter le grattage et les produits irritants.",
          "Consulter si extension, douleur ou fièvre.",
        ],
        needsExamOrLabs: ["Examen dermatologique en présentiel."],
        disclaimer,
        mock: true,
      },
      headache: {
        summary:
          "Des céphalées isolées sont souvent bénignes, mais certains signes imposent une évaluation urgente.",
        likelyCauses: [
          {
            title: "Céphalée de tension",
            rank: 1,
            rationale: "Douleur en bandeau, stress, fatigue.",
            confidence: "moyenne",
          },
          {
            title: "Migraine",
            rank: 2,
            rationale: "Douleur pulsatile, photophobie possible.",
            confidence: "faible",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: [
          "Douleur brutale « coup de tonnerre » ?",
          "Raideur de nuque ou déficit neurologique ?",
        ],
        nextSteps: [
          "Repos, hydratation.",
          "Appeler les secours si signes d’alarme neurologiques.",
        ],
        needsExamOrLabs: ["Examen neurologique clinique."],
        disclaimer,
        mock: true,
      },
      generic: {
        summary:
          "Plusieurs causes restent possibles ; une confirmation clinique peut être nécessaire.",
        likelyCauses: [
          {
            title: "Cause fonctionnelle / bénigne fréquente",
            rank: 1,
            rationale: "Symptômes non spécifiques courants.",
            confidence: "faible",
          },
          {
            title: "Processus inflammatoire localisé",
            rank: 2,
            rationale: "À évoquer si douleur, rougeur ou fièvre.",
            confidence: "faible",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: [
          "Depuis quand exactement ?",
          "Autres symptômes (fièvre, nausées, essoufflement) ?",
        ],
        nextSteps: [
          "Noter l’évolution pour votre médecin.",
          "Consulter si aggravation.",
        ],
        needsExamOrLabs: ["Examen clinique en présentiel."],
        disclaimer,
        mock: true,
      },
      emergencySummary:
        "Certains éléments évoquent une situation potentiellement urgente. Contactez immédiatement les secours.",
      emergencyNext: [
        "Appelez le 15 / 112 (France) ou le 101 (Israël).",
        "Ne conduisez pas vous-même en détresse.",
      ],
      emergencyLabs: ["Prise en charge médicale d’urgence."],
      emergencyReply:
        "⚠️ Situation potentiellement urgente.\n\nAppelez le 15 / 112 (France) ou le 101 (Israël).",
    };
  }

  if (locale === "he") {
    return {
      respiratory: {
        summary:
          "לפי התיאור, תסמונת זיהומית של דרכי הנשימה העליונות (הצטננות / שפעת) אפשרית. בלי בדיקה נשארות סיבות נוספות.",
        likelyCauses: [
          {
            title: "זיהום ויראלי בדרכי נשימה עליונות",
            rank: 1,
            rationale: "חום, שיעול או כאב גרון בהופעה הדרגתית.",
            confidence: "moyenne",
          },
          {
            title: "דלקת גרון",
            rank: 2,
            rationale: "כאב גרון דומיננטי.",
            confidence: "faible",
          },
        ],
        urgency: "auto_soins",
        clarifyingQuestions: ["כמה ימים?", "נמדד חום?", "קוצר נשימה?"],
        nextSteps: ["מנוחה והידרציה.", "רופא אם חום מעל 3 ימים או החמרה."],
        needsExamOrLabs: ["בדיקה קלינית אם כאב גרון חזק."],
        disclaimer,
        mock: true,
      },
      skin: {
        summary: "התיאור מציע גירוי או פריחה בעור. תמונה לבדה אינה מאשרת סיבה.",
        likelyCauses: [
          {
            title: "דלקת מגע / גירוי",
            rank: 1,
            rationale: "תגובה מקומית לאחר מגע.",
            confidence: "moyenne",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: ["גרד או כאב?", "מוצר חדש?"],
        nextSteps: ["הימנעו מגירוד.", "פנו לרופא בהרחבה או חום."],
        needsExamOrLabs: ["בדיקת עור פנים אל פנים."],
        disclaimer,
        mock: true,
      },
      headache: {
        summary: "כאבי ראש מבודדים לרוב שפירים, אך יש סימני אזהרה.",
        likelyCauses: [
          {
            title: "כאב ראש מתחי",
            rank: 1,
            rationale: "לחץ, עייפות.",
            confidence: "moyenne",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: ["הופעה פתאומית חזקה?", "נוקשות עורף?"],
        nextSteps: ["מנוחה.", "חירום בסימנים נוירולוגיים."],
        needsExamOrLabs: ["בדיקה נוירולוגית."],
        disclaimer,
        mock: true,
      },
      generic: {
        summary: "מספר סיבות אפשריות; ייתכן שתידרש אימות קליני.",
        likelyCauses: [
          {
            title: "סיבה שכיחה / תפקודית",
            rank: 1,
            rationale: "תסמינים לא ספציפיים.",
            confidence: "faible",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: ["מתי התחיל?", "תסמינים נוספים?"],
        nextSteps: ["עקבו אחרי השינוי.", "פנו לרופא בהחמרה."],
        needsExamOrLabs: ["בדיקה קלינית."],
        disclaimer,
        mock: true,
      },
      emergencySummary: "יש סימנים לדחיפות אפשרית. פנו מיד לשירותי חירום.",
      emergencyNext: ["התקשרו ל־15 / 112 או ל־101 בישראל."],
      emergencyLabs: ["טיפול רפואי דחוף."],
      emergencyReply: "⚠️ מצב שעלול להיות דחוף.\n\nהתקשרו ל־15 / 112 או ל־101.",
    };
  }

  if (locale === "ru") {
    return {
      respiratory: {
        summary:
          "По описанию вероятна инфекция верхних дыхательных путей (простуда / сезонный грипп). Без осмотра возможны другие причины.",
        likelyCauses: [
          {
            title: "Вирусная инфекция дыхательных путей",
            rank: 1,
            rationale: "Часто сочетание температуры, кашля или боли в горле.",
            confidence: "moyenne",
          },
          {
            title: "Фарингит / ангина",
            rank: 2,
            rationale: "Преобладающая боль в горле.",
            confidence: "faible",
          },
        ],
        urgency: "auto_soins",
        clarifyingQuestions: [
          "Сколько дней длятся симптомы?",
          "Измеряли температуру?",
          "Есть одышка или боль в груди?",
        ],
        nextSteps: [
          "Отдых, жидкость, контроль температуры.",
          "К врачу при лихорадке > 3 дней или ухудшении.",
        ],
        needsExamOrLabs: ["Осмотр ЛОР при сильной боли в горле."],
        disclaimer,
        mock: true,
      },
      skin: {
        summary:
          "Описание указывает на раздражение или сыпь. Фото недостаточно для точной причины.",
        likelyCauses: [
          {
            title: "Контактный дерматит",
            rank: 1,
            rationale: "Местная реакция после контакта.",
            confidence: "moyenne",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: ["Зуд или боль?", "Новый косметический продукт?"],
        nextSteps: ["Избегать расчёсывания.", "К врачу при распространении."],
        needsExamOrLabs: ["Очный осмотр дерматолога."],
        disclaimer,
        mock: true,
      },
      headache: {
        summary:
          "Изолированная головная боль часто доброкачественна, но есть тревожные признаки.",
        likelyCauses: [
          {
            title: "Головная боль напряжения",
            rank: 1,
            rationale: "Стресс, усталость.",
            confidence: "moyenne",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: [
          "Внезапная «громоподобная» боль?",
          "Ригидность шеи?",
        ],
        nextSteps: [
          "Отдых, гидратация.",
          "Скорая при неврологических тревожных признаках.",
        ],
        needsExamOrLabs: ["Клинический неврологический осмотр."],
        disclaimer,
        mock: true,
      },
      generic: {
        summary:
          "Возможны несколько причин; может потребоваться клиническое подтверждение.",
        likelyCauses: [
          {
            title: "Частая доброкачественная причина",
            rank: 1,
            rationale: "Неспецифические симптомы.",
            confidence: "faible",
          },
        ],
        urgency: "voir_medecin",
        clarifyingQuestions: [
          "С какого момента?",
          "Другие симптомы (температура, одышка)?",
        ],
        nextSteps: [
          "Отмечать динамику для врача.",
          "Обратиться при ухудшении.",
        ],
        needsExamOrLabs: ["Очный клинический осмотр."],
        disclaimer,
        mock: true,
      },
      emergencySummary:
        "Есть признаки возможной неотложности. Немедленно вызовите помощь.",
      emergencyNext: ["Звоните 15 / 112 (Франция) или 101 (Израиль)."],
      emergencyLabs: ["Неотложная медицинская помощь."],
      emergencyReply:
        "⚠️ Возможно неотложное состояние.\n\nЗвоните 15 / 112 или 101.",
    };
  }

  // English (default)
  return {
    respiratory: {
      summary:
        "Based on your description, an upper respiratory viral illness (cold / seasonal flu) is plausible. Without an exam, other causes remain possible.",
      likelyCauses: [
        {
          title: "Viral upper respiratory infection (cold / flu)",
          rank: 1,
          rationale: "Common cluster of fever, cough, or sore throat.",
          confidence: "moyenne",
        },
        {
          title: "Pharyngitis / tonsillitis",
          rank: 2,
          rationale: "Throat pain dominant.",
          confidence: "faible",
        },
        {
          title: "Viral sinusitis",
          rank: 3,
          rationale: "Congestion and facial pressure sometimes associated.",
          confidence: "faible",
        },
      ],
      urgency: "auto_soins",
      clarifyingQuestions: [
        "How many days have symptoms lasted?",
        "Have you measured a temperature?",
        "Any shortness of breath or chest pain?",
      ],
      nextSteps: [
        "Rest, fluids, and temperature monitoring.",
        "See a doctor if fever lasts > 3 days or worsens.",
      ],
      needsExamOrLabs: ["Clinical ENT exam if severe throat pain persists."],
      disclaimer,
      mock: true,
    },
    skin: {
      summary:
        "Your description suggests skin irritation or rash. Photos alone cannot confirm a precise cause.",
      likelyCauses: [
        {
          title: "Contact dermatitis / irritation",
          rank: 1,
          rationale: "Local reaction after irritant or allergen contact.",
          confidence: "moyenne",
        },
        {
          title: "Eczema",
          rank: 2,
          rationale: "Dry, itchy patches.",
          confidence: "faible",
        },
      ],
      urgency: "voir_medecin",
      clarifyingQuestions: [
        "Does the area itch or hurt?",
        "Any new cosmetic product or medicine?",
      ],
      nextSteps: [
        "Avoid scratching and irritants.",
        "See a clinician if spreading, painful, or feverish.",
      ],
      needsExamOrLabs: ["In-person dermatology exam."],
      disclaimer,
      mock: true,
    },
    headache: {
      summary:
        "Isolated headaches are often benign, but some warning signs need urgent evaluation.",
      likelyCauses: [
        {
          title: "Tension-type headache",
          rank: 1,
          rationale: "Band-like pain, stress, fatigue.",
          confidence: "moyenne",
        },
        {
          title: "Migraine",
          rank: 2,
          rationale: "Pulsating pain, light sensitivity possible.",
          confidence: "faible",
        },
      ],
      urgency: "voir_medecin",
      clarifyingQuestions: [
        "Thunderclap sudden onset?",
        "Neck stiffness or neurological deficit?",
      ],
      nextSteps: [
        "Rest and hydration.",
        "Call emergency services for neurological red flags.",
      ],
      needsExamOrLabs: ["Clinical neurological exam."],
      disclaimer,
      mock: true,
    },
    generic: {
      summary:
        "Several causes remain possible; clinical confirmation may be needed.",
      likelyCauses: [
        {
          title: "Common benign / functional cause",
          rank: 1,
          rationale: "Non-specific symptoms are frequent.",
          confidence: "faible",
        },
        {
          title: "Localized inflammatory process",
          rank: 2,
          rationale: "Consider if pain, redness, or fever.",
          confidence: "faible",
        },
      ],
      urgency: "voir_medecin",
      clarifyingQuestions: [
        "When exactly did this start?",
        "Other symptoms (fever, nausea, shortness of breath)?",
      ],
      nextSteps: [
        "Track changes for your clinician.",
        "Seek care if worsening.",
      ],
      needsExamOrLabs: ["In-person clinical exam."],
      disclaimer,
      mock: true,
    },
    emergencySummary:
      "Some elements suggest a potentially urgent situation. Contact emergency services immediately.",
    emergencyNext: [
      "Call 15 / 112 (France) or 101 (Israel) now.",
      "Do not drive yourself if in distress.",
    ],
    emergencyLabs: ["Emergency medical care on site / ER."],
    emergencyReply:
      "⚠️ Potentially urgent situation.\n\nCall 15 / 112 (France) or 101 (Israel).",
  };
}

function pickMockAssessment(
  text: string,
  hasImages: boolean,
  locale: Locale,
): Assessment {
  const pack = packFor(locale);
  const lower = text.toLowerCase();

  if (
    /fièvre|fievre|toux|gorge|rhume|grippe|cold|fever|cough|חום|שיעול|температур|кашел|горл/.test(
      lower,
    )
  ) {
    return pack.respiratory;
  }

  if (
    /peau|éruption|eruption|boutons|démange|demange|rash|eczéma|eczema|עור|פריחה|кож|сып/.test(
      lower,
    ) ||
    hasImages
  ) {
    return pack.skin;
  }

  if (/mal\s+de\s+tête|migraine|céphal|cephal|headache|ראש|головн/.test(lower)) {
    return pack.headache;
  }

  return pack.generic;
}

export function buildMockResponse(req: ConsultRequest): {
  assessment: Assessment;
  reply: string;
  emergencyDetected: boolean;
} {
  const locale = localeOf(req);
  const pack = packFor(locale);
  const text = [
    req.symptoms,
    req.message,
    ...(req.history?.map((h) => h.content) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const emergency = detectEmergency(text);
  const hasImages = Boolean(req.images?.length);
  let assessment = pickMockAssessment(
    req.message || req.symptoms,
    hasImages,
    locale,
  );

  if (emergency.detected) {
    assessment = {
      ...assessment,
      urgency: "urgent",
      summary: pack.emergencySummary,
      nextSteps: pack.emergencyNext,
      needsExamOrLabs: pack.emergencyLabs,
      clarifyingQuestions: [],
      mock: true,
    };
  }

  const reply =
    req.message && req.history?.length
      ? `${assessment.summary}\n\n${assessment.clarifyingQuestions.slice(0, 2).join(" ")}`
      : `${assessment.summary}\n\n${assessment.likelyCauses
          .map((c) => `${c.rank}. ${c.title}`)
          .join(" ; ")}.\n\n${assessment.nextSteps[0] ?? ""}`;

  return {
    assessment: {
      ...assessment,
      disclaimer: disclaimerShort(locale),
    },
    reply: emergency.detected
      ? `${pack.emergencyReply}\n\n${assessment.summary}`
      : reply,
    emergencyDetected: emergency.detected,
  };
}

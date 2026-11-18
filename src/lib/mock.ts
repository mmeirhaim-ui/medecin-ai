import type { Assessment, ConsultRequest } from "./types";
import { DISCLAIMER_SHORT } from "./prompts";
import { detectEmergency } from "./emergency";

function pickMockAssessment(text: string, hasImages: boolean): Assessment {
  const lower = text.toLowerCase();

  if (/fièvre|fievre|toux|gorge|rhume|grippe|cold|fever|cough/.test(lower)) {
    return {
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
        "Avez-vous une température mesurée ? Si oui, laquelle ?",
        "Y a-t-il un essoufflement, une douleur thoracique ou une raideur de nuque ?",
        "Êtes-vous immunodéprimé, enceinte, ou âgé de plus de 65 ans ?",
      ],
      nextSteps: [
        "Repos, hydratation et surveillance de la température.",
        "Consultation en pharmacie pour des mesures symptomatiques adaptées (sans ordonnance).",
        "Voir un médecin si fièvre > 3 jours, aggravation, ou difficultés respiratoires.",
      ],
      needsExamOrLabs: [
        "Examen clinique ORL si douleur de gorge intense ou persistance.",
        "Test grippal / COVID selon le contexte épidémique et les facteurs de risque.",
      ],
      disclaimer: DISCLAIMER_SHORT,
      mock: true,
    };
  }

  if (
    /peau|éruption|eruption|boutons|démange|demange|rash|eczéma|eczema/.test(
      lower,
    ) ||
    hasImages
  ) {
    return {
      summary:
        "Votre description" +
        (hasImages ? " et la/les photo(s)" : "") +
        " évoquent une irritation ou éruption cutanée. L’aspect photo ne suffit pas à confirmer une cause précise.",
      likelyCauses: [
        {
          title: "Dermatite de contact / irritation",
          rank: 1,
          rationale:
            "Réaction locale après contact avec un irritant ou un allergène.",
          confidence: "moyenne",
        },
        {
          title: "Eczéma / dermatite atopique",
          rank: 2,
          rationale: "Plaques sèches prurigineuses, souvent récidivantes.",
          confidence: "faible",
        },
        {
          title: "Infection cutanée locale",
          rank: 3,
          rationale: "Rougeur chaude, croûtes ou extension progressive.",
          confidence: "faible",
        },
      ],
      urgency: "voir_medecin",
      clarifyingQuestions: [
        "La zone démange-t-elle, brûle-t-elle, ou est-elle douloureuse ?",
        "Y a-t-il eu un nouveau produit cosmétique, lessive ou médicament ?",
        "Observez-vous de la fièvre, des bulles, ou une extension rapide ?",
      ],
      nextSteps: [
        "Éviter le grattage et les produits irritants.",
        "Nettoyage doux à l’eau tiède, sans antiseptique agressif.",
        "Consulter un médecin ou dermatologue si extension, douleur, ou fièvre.",
      ],
      needsExamOrLabs: [
        "Examen dermatologique en présentiel (la photo est insuffisante).",
        "Prélèvement cutané si suspicion d’infection.",
      ],
      disclaimer: DISCLAIMER_SHORT,
      mock: true,
    };
  }

  if (/mal\s+de\s+tête|migraine|céphal|cephal|headache/.test(lower)) {
    return {
      summary:
        "Des céphalées isolées sont souvent bénignes (tension, migraine), mais certains signes imposent une évaluation urgente.",
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
          rationale:
            "Douleur pulsatile, sensibilité à la lumière ou aux bruits.",
          confidence: "faible",
        },
        {
          title: "Cause secondaire à explorer",
          rank: 3,
          rationale:
            "Si céphalée brutale, inhabituelle ou avec signes neurologiques.",
          confidence: "faible",
        },
      ],
      urgency: "voir_medecin",
      clarifyingQuestions: [
        "La douleur est-elle la pire de votre vie ou d’apparition brutale (« coup de tonnerre ») ?",
        "Y a-t-il une raideur de nuque, une vision double, une faiblesse d’un côté ?",
        "Prenez-vous des traitements au long cours ?",
      ],
      nextSteps: [
        "Repos dans un endroit calme, hydratation.",
        "Consulter rapidement si céphalée inhabituelle ou signes associés.",
        "Appeler les secours si faiblesse unilatérale, trouble de la parole ou perte de vision soudaine.",
      ],
      needsExamOrLabs: [
        "Examen neurologique clinique.",
        "Imagerie cérébrale si signes d’alarme (sur indication médicale).",
      ],
      disclaimer: DISCLAIMER_SHORT,
      mock: true,
    };
  }

  return {
    summary:
      "Merci pour ces précisions. Sur la base des éléments fournis, plusieurs causes restent possibles ; une confirmation clinique peut être nécessaire.",
    likelyCauses: [
      {
        title: "Cause fonctionnelle / bénigne fréquente",
        rank: 1,
        rationale:
          "Symptômes non spécifiques courants, souvent spontanément favorables.",
        confidence: "faible",
      },
      {
        title: "Processus inflammatoire ou infectieux localisé",
        rank: 2,
        rationale: "À évoquer si douleur, rougeur, fièvre ou progression.",
        confidence: "faible",
      },
      {
        title: "Autre cause à préciser en consultation",
        rank: 3,
        rationale: "L’historique et l’examen permettent d’affiner.",
        confidence: "faible",
      },
    ],
    urgency: "voir_medecin",
    clarifyingQuestions: [
      "Depuis quand exactement ces symptômes ont-ils commencé ?",
      "Y a-t-il des facteurs qui aggravent ou améliorent les symptômes ?",
      "Avez-vous d’autres symptômes (fièvre, nausées, essoufflement) ?",
      "Avez-vous des antécédents médicaux ou prenez-vous des traitements ?",
    ],
    nextSteps: [
      "Noter l’évolution (horaire, intensité) pour votre médecin.",
      "Consulter un professionnel de santé si aggravation ou persistance.",
      "En cas de signes d’alarme (douleur thoracique, essoufflement sévère, saignement abondant), appelez les secours.",
    ],
    needsExamOrLabs: [
      "Examen clinique en présentiel recommandé pour affiner l’orientation.",
      "Imagerie ou analyses uniquement sur indication médicale.",
    ],
    disclaimer: DISCLAIMER_SHORT,
    mock: true,
  };
}

export function buildMockResponse(req: ConsultRequest): {
  assessment: Assessment;
  reply: string;
  emergencyDetected: boolean;
} {
  const text = [
    req.symptoms,
    req.message,
    ...(req.history?.map((h) => h.content) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const emergency = detectEmergency(text);
  const hasImages = Boolean(req.images?.length);
  let assessment = pickMockAssessment(req.message || req.symptoms, hasImages);

  if (emergency.detected) {
    assessment = {
      ...assessment,
      urgency: "urgent",
      summary:
        "Certains éléments de votre message évoquent une situation potentiellement urgente. N’attendez pas une réponse numérique : contactez immédiatement les secours.",
      nextSteps: [
        "Appelez immédiatement le 15 ou le 112 (France), ou le 101 Magen David Adom (Israël).",
        "Ne conduisez pas vous-même si vous êtes en détresse ; faites-vous accompagner.",
        "Si idéation suicidaire : contactez aussi les secours ou une ligne d’écoute d’urgence locale.",
      ],
      needsExamOrLabs: [
        "Prise en charge médicale d’urgence sur place / aux urgences.",
      ],
      clarifyingQuestions: [],
      mock: true,
    };
  }

  const reply =
    req.message && req.history?.length
      ? `${assessment.summary}\n\nPour préciser : ${assessment.clarifyingQuestions.slice(0, 2).join(" ")}`
      : `${assessment.summary}\n\nHypothèses principales : ${assessment.likelyCauses
          .map((c) => `${c.rank}. ${c.title}`)
          .join(" ; ")}.\n\nProchaines étapes : ${assessment.nextSteps[0] ?? ""}`;

  return {
    assessment: { ...assessment, disclaimer: DISCLAIMER_SHORT },
    reply: emergency.detected
      ? `⚠️ Situation potentiellement urgente.\n\n${assessment.summary}\n\nAppelez le 15 / 112 (France) ou le 101 (Israël).`
      : reply,
    emergencyDetected: emergency.detected,
  };
}

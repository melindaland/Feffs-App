import { Survey } from "@/types";

/**
 * Données de test pour les enquêtes FEFFS 2026
 */
export const SURVEYS: Survey[] = [
  {
    id: "survey-1",
    title: "Satisfaction Festival",
    description: "Donnez-nous votre avis sur votre expérience au FEFFS",
    qrCode: "survey-1",
    createdAt: new Date("2026-02-01"),
    expiresAt: new Date("2026-02-28"),
    questions: [
      {
        id: "q1",
        question: "Comment évaluez-vous l'organisation du festival ?",
        type: "rating",
        required: true,
        min: 1,
        max: 5,
      },
      {
        id: "q2",
        question: "Quel film avez-vous préféré ?",
        type: "text",
        required: true,
      },
      {
        id: "q3",
        question: "Recommanderiez-vous le festival à vos amis ?",
        type: "yes-no",
        required: true,
      },
      {
        id: "q4",
        question: "Qu'avez-vous le plus apprécié ?",
        type: "multiple-choice",
        required: false,
        options: [
          "La sélection de films",
          "L'ambiance",
          "Les salles de cinéma",
          "Les animations",
        ],
      },
    ],
  },
  {
    id: "survey-2",
    title: "Évaluation de Film",
    description:
      "Dites-nous ce que vous avez pensé du film que vous venez de voir",
    qrCode: "survey-2",
    createdAt: new Date("2026-02-05"),
    expiresAt: new Date("2026-02-15"),
    questions: [
      {
        id: "q1",
        question: "Quelle note donnez-vous à ce film ?",
        type: "rating",
        required: true,
        min: 0,
        max: 10,
      },
      {
        id: "q2",
        question: "Qu'avez-vous pensé de la réalisation ?",
        type: "multiple-choice",
        required: true,
        options: ["Excellente", "Bonne", "Moyenne", "Décevante"],
      },
      {
        id: "q3",
        question: "Avez-vous apprécié le scénario ?",
        type: "yes-no",
        required: true,
      },
      {
        id: "q4",
        question: "Commentaires supplémentaires (optionnel)",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "survey-3",
    title: "Amélioration Continue",
    description: "Aidez-nous à améliorer votre expérience",
    qrCode: "survey-3",
    createdAt: new Date("2026-02-10"),
    expiresAt: new Date("2026-02-28"),
    questions: [
      {
        id: "q1",
        question: "Les horaires des projections vous conviennent-ils ?",
        type: "yes-no",
        required: true,
      },
      {
        id: "q2",
        question: "Comment évaluez-vous la qualité de l'application mobile ?",
        type: "rating",
        required: true,
        min: 1,
        max: 5,
      },
      {
        id: "q3",
        question: "Quelles fonctionnalités aimeriez-vous voir ajoutées ?",
        type: "text",
        required: false,
      },
    ],
  },
];

/**
 * Récupère une enquête par son ID (ou QR code)
 */
export const getSurveyById = (id: string): Survey | undefined => {
  return SURVEYS.find((s) => s.id === id || s.qrCode === id);
};

/**
 * Récupère toutes les enquêtes actives
 */
export const getActiveSurveys = (): Survey[] => {
  const now = new Date();
  return SURVEYS.filter(
    (s) => s.createdAt <= now && (!s.expiresAt || s.expiresAt >= now),
  );
};

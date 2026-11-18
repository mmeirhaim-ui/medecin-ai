export type UrgencyLevel = "urgent" | "voir_medecin" | "auto_soins";

export type UploadedImage = {
  id: string;
  name: string;
  mimeType: string;
  /** Base64 without data-URL prefix */
  data: string;
  previewUrl: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  images?: { name: string; mimeType: string; previewUrl?: string }[];
};

export type LikelyCause = {
  title: string;
  rank: number;
  rationale: string;
  confidence: "faible" | "moyenne" | "élevée";
};

export type Assessment = {
  summary: string;
  likelyCauses: LikelyCause[];
  urgency: UrgencyLevel;
  clarifyingQuestions: string[];
  nextSteps: string[];
  needsExamOrLabs: string[];
  disclaimer: string;
  grounded?: boolean;
  mock?: boolean;
};

export type Consultation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  symptoms: string;
  messages: ChatMessage[];
  assessment: Assessment | null;
  emergencyDetected: boolean;
};

export type ConsultLocale = "en" | "fr" | "he" | "ru";

export type ConsultRequest = {
  consultationId?: string;
  symptoms: string;
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  images?: { mimeType: string; data: string; name?: string }[];
  /** UI locale — AI replies should match. */
  locale?: ConsultLocale;
};

export type ConsultResponse = {
  consultationId: string;
  assessment: Assessment;
  reply: string;
  emergencyDetected: boolean;
  mock: boolean;
};

export type KnowledgeLang = "en" | "fr" | "he" | "ru";

export type UrgencyHint = "urgent" | "voir_medecin" | "auto_soins";

export type KnowledgeSourceRef = {
  id?: string;
  name: string;
  org?: string;
  url: string;
  retrievedAt?: string;
};

export type LocalizedGuidance = {
  summary: string;
  selfCare?: string[];
  seeDoctorIf?: string[];
  emergencyIf?: string[];
  doNot?: string[];
};

export type KnowledgeEntry = {
  id: string;
  category: string;
  urgencyDefault: UrgencyHint;
  keywords: Record<KnowledgeLang, string[]>;
  titles: Record<KnowledgeLang, string>;
  guidance: Record<KnowledgeLang, LocalizedGuidance>;
  sources: KnowledgeSourceRef[];
  /** Optional weight boost for matcher (default 1). */
  priority?: number;
};

export type KnowledgePackMeta = {
  id: string;
  version: string;
  updatedAt: string;
  purpose: string;
  languages: KnowledgeLang[];
  licenseNotes: string[];
  trustedDomains: string[];
  entryFiles: string[];
};

export type MatchedKnowledge = {
  entry: KnowledgeEntry;
  score: number;
  matchedKeywords: string[];
};

export type AssessmentSource = {
  title: string;
  url: string;
  publisher?: string;
};

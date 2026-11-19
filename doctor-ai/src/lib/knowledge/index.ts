export type {
  AssessmentSource,
  KnowledgeEntry,
  KnowledgeLang,
  KnowledgePackMeta,
  KnowledgeSourceRef,
  LocalizedGuidance,
  MatchedKnowledge,
  UrgencyHint,
} from "./types";

export {
  getPackMeta,
  getTrustedDomains,
  loadKnowledgeEntries,
  resetKnowledgeCache,
} from "./load";

export {
  collectSourcesFromMatches,
  formatKnowledgeForPrompt,
  getEntryById,
  matchKnowledge,
  pickGuidanceLang,
  resetKnowledgeMatchIndex,
} from "./match";

export {
  TRIAGE_KNOWLEDGE_BLOCK,
  citationPolicyBlock,
  groundingPolicyBlock,
  withMedicalKnowledge,
} from "./prompt-blocks";

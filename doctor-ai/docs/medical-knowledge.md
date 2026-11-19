# Medical knowledge pack

See [`../data/knowledge/README.md`](../data/knowledge/README.md) for the curated public triage pack (EN/FR/HE/RU).

- Validate: `npm run validate:knowledge`
- Grounding: `GEMINI_GROUNDING=prefer|fallback|off`
- Runtime: `src/lib/knowledge/` + system prompt blocks in `src/lib/prompts.ts`

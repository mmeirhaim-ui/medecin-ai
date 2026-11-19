# Doctor AI — public medical knowledge pack

Curated **symptom → guidance** maps used to accelerate non-diagnostic triage replies.

## Rules

- Paraphrase only; always keep `sources[].url` attribution.
- Prefer WHO, CDC, NHS, HAS, Ameli, MedlinePlus, Israeli MoH.
- Never invent clinical thresholds; copy thresholds only from cited public pages.
- Not a medical device. Never prescribe or invent drug doses.
- Languages: `en`, `fr`, `he`, `ru` on every entry.

## Layout

| Path | Role |
|------|------|
| `pack.meta.json` | Version, trusted domains, entry file list |
| `sources.json` | Master source catalog |
| `entries/*.json` | Syndrome / red-flag entries |

## Adding an entry

1. Create `entries/<id>.json` with multilingual keywords, titles, guidance, sources.
2. Append the path to `pack.meta.json` → `entryFiles`.
3. Import it in `src/lib/knowledge/load.ts`.
4. Add a catalog row in `sources.json` when introducing a new URL.
5. Run `npm run validate:knowledge`.

## Runtime

`src/lib/knowledge/` matches keywords, injects attributed snippets into Gemini prompts, and merges URLs into `assessment.sources`. Google Search grounding is controlled by `GEMINI_GROUNDING` (`prefer` \| `fallback` \| `off`).

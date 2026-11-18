# Doctor IA

Assisted **medical orientation** in English, French, Hebrew, and Russian: describe symptoms, optionally attach photos, and receive ranked hypotheses, an urgency level, and next steps.

> **Not a doctor.** No definitive diagnosis, no prescription. Emergencies: France **15 / 112** — Israel **101** (MDA), **100**, **102**.

## Run locally

```bash
cd doctor-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Language

The UI defaults to the browser language when it is `he`, `en`, `fr`, or `ru`; otherwise **English**. Use the language picker in the header; the choice is stored in `localStorage` (`doctor-ia-locale`). Hebrew uses RTL. AI replies follow the selected locale.

### Gemini API key (optional)

Without a key, the app runs in **demo mode** with realistic simulated replies.

```bash
# .env.local
GEMINI_API_KEY=your_google_ai_key
# or
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
# or
GOOGLE_API_KEY=your_google_ai_key

# optional (default: gemini-3.5-flash-lite — faster; falls back to flash)
# GEMINI_MODEL=gemini-3.5-flash-lite

# optional: enable Google Search grounding (slower; off by default)
# GEMINI_ENABLE_GROUNDING=1
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

For a Cursor-published app, bind `GEMINI_API_KEY` via platform Secrets — never commit it.

Consult tickets are signed with `CONSULT_TOKEN_SECRET` when set, otherwise a stable derivation of `DATABASE_URL` (multi-instance safe).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · `@google/generative-ai`

# Medecin AI

Assistant d’**orientation médicale** en français : décrivez vos symptômes, joignez éventuellement des photos, et recevez des hypothèses classées, un niveau d’urgence et des pistes de suite à donner.

> **Ce n’est pas un médecin.** Pas de diagnostic définitif, pas de prescription. En urgence : France **15 / 112** — Israël **101** (MDA), **100**, **102**.

## Lancer en local

```bash
cd medcin-ai
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Clé API Gemini (optionnelle)

Sans clé, l’app tourne en **mode démonstration** avec des réponses réalistes simulées.

```bash
# .env.local
GEMINI_API_KEY=votre_cle_google_ai
# ou
GOOGLE_API_KEY=votre_cle_google_ai

# optionnel
GEMINI_MODEL=gemini-2.0-flash
```

Obtenez une clé sur [Google AI Studio](https://aistudio.google.com/apikey).

Pour une app publiée sur Cursor, liez le secret `GEMINI_API_KEY` via les Secrets de la plateforme — ne le mettez jamais dans le code.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · `@google/generative-ai`

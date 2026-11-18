import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-pulse-soft absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#9fc4bc]/45 blur-3xl" />
          <div className="absolute right-0 top-0 h-[28rem] w-[28rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-[#b7c9d6]/50 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#e4d5c3]/40 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-10">
          <div>
            <p className="animate-rise font-display text-5xl leading-[0.95] tracking-tight text-[var(--brand-deep)] sm:text-6xl md:text-7xl">
              Medcin <span className="italic text-[var(--brand)]">AI</span>
            </p>
            <h1 className="animate-rise-delay mt-6 max-w-xl font-display text-2xl font-medium leading-snug text-[var(--ink)] sm:text-3xl">
              Une orientation claire quand les symptômes inquiètent.
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              Décrivez ce que vous ressentez, joignez une photo si besoin, et
              recevez des pistes prudentes — jamais un diagnostic définitif.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/consulter"
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-base font-medium text-white transition hover:bg-[var(--brand-deep)]"
              >
                Commencer une consultation
              </Link>
              <Link
                href="/historique"
                className="rounded-full border border-[var(--line)] bg-white/50 px-5 py-3 text-base text-[var(--ink-muted)] transition hover:bg-white/80 hover:text-[var(--ink)]"
              >
                Voir l’historique
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block"
          >
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-[#0d5c63] via-[#1a6f78] to-[#3d8a7a] opacity-90 shadow-[0_30px_80px_rgba(8,70,76,0.25)]" />
            <div className="absolute inset-0 flex items-end justify-center p-10">
              <div className="w-full rounded-[1.5rem] bg-white/15 p-6 text-white backdrop-blur-md">
                <p className="font-display text-3xl leading-tight">
                  Écoute.
                  <br />
                  Triage.
                  <br />
                  Orientation.
                </p>
                <p className="mt-4 text-sm text-white/80">
                  Conçu pour la clarté clinique — pas pour remplacer un médecin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-[var(--brand-deep)]">
            Comment ça marche
          </h2>
          <p className="mt-3 text-[var(--ink-muted)]">
            Un parcours simple, pensé pour le mobile, avec des garde-fous
            d’urgence.
          </p>
        </div>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Décrire",
              d: "Expliquez vos symptômes en français, avec le contexte utile (durée, intensité).",
            },
            {
              n: "02",
              t: "Illustrer",
              d: "Ajoutez éventuellement des photos de peau, d’éruption ou de blessure.",
            },
            {
              n: "03",
              t: "S’orienter",
              d: "Recevez des causes possibles classées, un niveau d’urgence, et la suite à donner.",
            },
          ].map((step) => (
            <li key={step.n} className="border-t border-[var(--line)] pt-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand)]">
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-2xl text-[var(--brand-deep)]">
                {step.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                {step.d}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Disclaimer variant="banner" />
        <p className="mt-4 text-sm text-[var(--ink-muted)]">
          Urgences France : <strong>15</strong> / <strong>112</strong> — Israël :{" "}
          <strong>101</strong> (Magen David Adom), <strong>100</strong>{" "}
          (police), <strong>102</strong> (pompiers).
        </p>
      </section>
    </div>
  );
}

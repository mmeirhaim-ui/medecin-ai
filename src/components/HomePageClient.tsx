"use client";

import Link from "next/link";
import { Disclaimer } from "./Disclaimer";
import { useLocale } from "./LocaleProvider";

export function HomePageClient() {
  const { t } = useLocale();
  const panelLines = t.home.panelTitle.split("\n");

  const steps = [
    { n: "01", t: t.home.step1Title, d: t.home.step1Body },
    { n: "02", t: t.home.step2Title, d: t.home.step2Body },
    { n: "03", t: t.home.step3Title, d: t.home.step3Body },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-pulse-soft absolute -start-20 top-10 h-72 w-72 rounded-full bg-[#9fc4bc]/45 blur-3xl" />
          <div className="absolute end-0 top-0 h-[28rem] w-[28rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-[#b7c9d6]/50 blur-3xl rtl:-translate-x-1/4" />
          <div className="absolute bottom-0 start-1/3 h-64 w-64 rounded-full bg-[#e4d5c3]/40 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-10">
          <div>
            <p className="animate-rise font-display text-5xl leading-[0.95] tracking-tight text-[var(--brand-deep)] sm:text-6xl md:text-7xl">
              Doctor <span className="italic text-[var(--brand)]">IA</span>
            </p>
            <h1 className="animate-rise-delay mt-6 max-w-xl font-display text-2xl font-medium leading-snug text-[var(--ink)] sm:text-3xl">
              {t.home.headline}
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              {t.home.support}
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/consulter"
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-base font-medium text-white transition hover:bg-[var(--brand-deep)]"
              >
                {t.home.ctaConsult}
              </Link>
              <Link
                href="/historique"
                className="rounded-full border border-[var(--line)] bg-white/50 px-5 py-3 text-base text-[var(--ink-muted)] transition hover:bg-white/80 hover:text-[var(--ink)]"
              >
                {t.home.ctaHistory}
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
                  {panelLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm text-white/80">{t.home.panelBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-[var(--brand-deep)]">
            {t.home.howTitle}
          </h2>
          <p className="mt-3 text-[var(--ink-muted)]">{t.home.howBody}</p>
        </div>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
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
        <p className="mt-4 text-sm text-[var(--ink-muted)]">{t.home.emergencies}</p>
      </section>
    </div>
  );
}

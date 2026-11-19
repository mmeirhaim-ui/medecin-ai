"use client";

import { HistoryClient } from "./HistoryClient";
import { useLocale } from "./LocaleProvider";

export function HistoriquePageClient() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-4xl text-[var(--brand-deep)]">
        {t.history.title}
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">{t.history.subtitle}</p>
      <div className="mt-8">
        <HistoryClient />
      </div>
    </div>
  );
}

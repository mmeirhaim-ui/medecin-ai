"use client";

import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/locales";
import { useLocale } from "./LocaleProvider";

export function LanguagePicker() {
  const { locale, setLocale, t } = useLocale();

  return (
    <label className="flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
      <span className="sr-only">{t.language}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        aria-label={t.language}
        className="rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none ring-[var(--brand)] focus:ring-2"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

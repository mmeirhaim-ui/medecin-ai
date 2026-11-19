"use client";

import { useLocale } from "./LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--line)] bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-display text-lg text-[var(--brand-deep)]">{t.brand}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">
          {t.disclaimer.short}
        </p>
        <p className="mt-4 text-xs text-[var(--ink-muted)]">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}

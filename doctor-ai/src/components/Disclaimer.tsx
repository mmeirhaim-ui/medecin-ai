"use client";

import { useLocale } from "./LocaleProvider";

type Props = {
  variant?: "banner" | "inline" | "privacy";
};

export function Disclaimer({ variant = "inline" }: Props) {
  const { t } = useLocale();

  if (variant === "privacy") {
    return (
      <div
        className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--brand-soft)]/40 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]"
        role="note"
      >
        <strong>{t.disclaimer.privacyLabel}</strong>
        {t.disclaimer.privacy}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        <strong className="text-[var(--ink)]">{t.disclaimer.medicalLabel}</strong>
        {t.disclaimer.long}
      </div>
    );
  }

  return (
    <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
      <strong className="text-[var(--ink)]">{t.disclaimer.importantLabel}</strong>
      {t.disclaimer.long}
    </p>
  );
}

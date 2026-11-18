"use client";

import type { UrgencyLevel } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

const STYLES: Record<UrgencyLevel, string> = {
  urgent: "bg-[var(--urgent-bg)] text-[var(--urgent)] border-red-200",
  voir_medecin: "bg-[var(--warn-bg)] text-[var(--warn)] border-amber-200",
  auto_soins: "bg-[var(--ok-bg)] text-[var(--ok)] border-emerald-200",
};

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const { t } = useLocale();
  const meta = t.urgency[level];

  return (
    <div className={`rounded-[var(--radius)] border px-4 py-3 ${STYLES[level]}`}>
      <p className="font-display text-lg">{meta.title}</p>
      <p className="mt-1 text-sm opacity-90">{meta.hint}</p>
    </div>
  );
}

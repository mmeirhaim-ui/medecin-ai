"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteConsultation, loadConsultations } from "@/lib/storage";
import type { Consultation } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

export function HistoryClient() {
  const { t, locale } = useLocale();
  const [items, setItems] = useState<Consultation[]>([]);

  useEffect(() => {
    setItems(loadConsultations());
  }, []);

  function remove(id: string) {
    setItems(deleteConsultation(id));
  }

  function urgencyLabel(c: Consultation) {
    const u = c.assessment?.urgency;
    if (u === "urgent") return t.history.urgencyUrgent;
    if (u === "auto_soins") return t.history.urgencySelfCare;
    if (u === "voir_medecin") return t.history.urgencySeeDoctor;
    return "—";
  }

  const dateLocale =
    locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : locale === "fr" ? "fr-FR" : "en-US";

  if (items.length === 0) {
    return (
      <div className="glass rounded-[calc(var(--radius)+4px)] p-8 text-center">
        <p className="font-display text-2xl text-[var(--brand-deep)]">
          {t.history.emptyTitle}
        </p>
        <p className="mt-2 text-[var(--ink-muted)]">{t.history.emptyBody}</p>
        <Link
          href="/consulter"
          className="mt-6 inline-flex rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white"
        >
          {t.history.start}
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((c) => (
        <li
          key={c.id}
          className="glass flex flex-col gap-3 rounded-[var(--radius)] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--ink)]">
              {c.symptoms.slice(0, 120) || t.history.consultation}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {new Date(c.updatedAt).toLocaleString(dateLocale)} ·{" "}
              {urgencyLabel(c)}
              {c.emergencyDetected ? ` · ${t.history.emergencyFlag}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/consulter?id=${c.id}`}
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm text-white"
            >
              {t.history.open}
            </Link>
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--ink-muted)]"
            >
              {t.history.erase}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteConsultation, loadConsultations } from "@/lib/storage";
import type { Consultation } from "@/lib/types";

function urgencyLabel(c: Consultation) {
  const u = c.assessment?.urgency;
  if (u === "urgent") return "Urgent";
  if (u === "auto_soins") return "Auto-soins";
  if (u === "voir_medecin") return "Voir un médecin";
  return "—";
}

export function HistoryClient() {
  const [items, setItems] = useState<Consultation[]>([]);

  useEffect(() => {
    setItems(loadConsultations());
  }, []);

  function remove(id: string) {
    setItems(deleteConsultation(id));
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-[calc(var(--radius)+4px)] p-8 text-center">
        <p className="font-display text-2xl text-[var(--brand-deep)]">
          Aucune consultation enregistrée
        </p>
        <p className="mt-2 text-[var(--ink-muted)]">
          Les sessions de ce navigateur apparaîtront ici.
        </p>
        <Link
          href="/consulter"
          className="mt-6 inline-flex rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white"
        >
          Démarrer
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
              {c.symptoms.slice(0, 120) || "Consultation"}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {new Date(c.updatedAt).toLocaleString("fr-FR")} ·{" "}
              {urgencyLabel(c)}
              {c.emergencyDetected ? " · alerte urgence" : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/consulter?id=${c.id}`}
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm text-white"
            >
              Ouvrir
            </Link>
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--ink-muted)]"
            >
              Effacer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

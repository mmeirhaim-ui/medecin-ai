import type { UrgencyLevel } from "@/lib/types";

const LABELS: Record<
  UrgencyLevel,
  { title: string; hint: string; className: string }
> = {
  urgent: {
    title: "Urgent",
    hint: "Contactez les secours ou les urgences sans délai",
    className: "bg-[var(--urgent-bg)] text-[var(--urgent)] border-red-200",
  },
  voir_medecin: {
    title: "Voir un médecin bientôt",
    hint: "Prenez rendez-vous rapidement ou consultez une permanence",
    className: "bg-[var(--warn-bg)] text-[var(--warn)] border-amber-200",
  },
  auto_soins: {
    title: "Auto-soins possibles",
    hint: "Surveillance à domicile avec prudence — consultez si aggravation",
    className: "bg-[var(--ok-bg)] text-[var(--ok)] border-emerald-200",
  },
};

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const meta = LABELS[level];
  return (
    <div
      className={`rounded-[var(--radius)] border px-4 py-3 ${meta.className}`}
    >
      <p className="font-display text-lg">{meta.title}</p>
      <p className="mt-1 text-sm opacity-90">{meta.hint}</p>
    </div>
  );
}

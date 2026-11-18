import { HistoryClient } from "@/components/HistoryClient";

export default function HistoriquePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-4xl text-[var(--brand-deep)]">
        Historique
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Consultations enregistrées localement dans ce navigateur (session /
        appareil).
      </p>
      <div className="mt-8">
        <HistoryClient />
      </div>
    </div>
  );
}

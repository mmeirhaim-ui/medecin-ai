import { EMERGENCY_NUMBERS } from "@/lib/emergency";

type Props = {
  compact?: boolean;
};

export function EmergencyBanner({ compact }: Props) {
  return (
    <aside
      role="alert"
      aria-live="assertive"
      className="animate-fade-slide rounded-[var(--radius)] border border-red-200 bg-[var(--urgent-bg)] px-4 py-4 text-[var(--urgent)] sm:px-5"
    >
      <p className="font-display text-xl text-[var(--urgent)]">
        Urgence possible — appelez les secours
      </p>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--urgent)]/90">
          Si vous présentez une douleur thoracique, des signes d’AVC, une
          difficulté respiratoire sévère, un saignement abondant, une
          anaphylaxie ou des idées suicidaires, n’attendez pas.
        </p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            France
          </p>
          <ul className="mt-1 space-y-1 text-sm">
            {EMERGENCY_NUMBERS.france.map((n) => (
              <li key={n.number}>
                <a
                  className="font-semibold underline-offset-2 hover:underline"
                  href={`tel:${n.number}`}
                >
                  {n.number}
                </a>{" "}
                — {n.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            Israël
          </p>
          <ul className="mt-1 space-y-1 text-sm">
            {EMERGENCY_NUMBERS.israel.map((n) => (
              <li key={n.number}>
                <a
                  className="font-semibold underline-offset-2 hover:underline"
                  href={`tel:${n.number}`}
                >
                  {n.number}
                </a>{" "}
                — {n.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

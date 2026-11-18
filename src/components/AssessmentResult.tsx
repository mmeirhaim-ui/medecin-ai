import type { Assessment } from "@/lib/types";
import { UrgencyBadge } from "./UrgencyBadge";
import { Disclaimer } from "./Disclaimer";

export function AssessmentResult({ assessment }: { assessment: Assessment }) {
  return (
    <section className="animate-fade-slide space-y-5" aria-label="Résultat d’orientation">
      <UrgencyBadge level={assessment.urgency} />

      <div>
        <h2 className="font-display text-2xl text-[var(--brand-deep)]">
          Synthèse
        </h2>
        <p className="mt-2 leading-relaxed text-[var(--ink)]">
          {assessment.summary}
        </p>
      </div>

      <div>
        <h3 className="font-display text-xl text-[var(--brand-deep)]">
          Causes possibles (classées)
        </h3>
        <ol className="mt-3 space-y-3">
          {assessment.likelyCauses.map((cause) => (
            <li
              key={`${cause.rank}-${cause.title}`}
              className="border-l-2 border-[var(--brand)] pl-4"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                  #{cause.rank}
                </span>
                <span className="font-medium">{cause.title}</span>
                <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-xs text-[var(--brand-deep)]">
                  confiance {cause.confidence}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                {cause.rationale}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {assessment.clarifyingQuestions.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[var(--brand-deep)]">
            Questions pour préciser
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]">
            {assessment.clarifyingQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-display text-xl text-[var(--brand-deep)]">
          Que faire ensuite
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]">
          {assessment.nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {assessment.needsExamOrLabs.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[var(--brand-deep)]">
            Examens / imagerie / laboratoire
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]">
            {assessment.needsExamOrLabs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white/60 px-4 py-3">
        <Disclaimer />
        {(assessment.mock || assessment.grounded !== undefined) && (
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            {assessment.mock
              ? "Mode démonstration (aucune clé API) — réponses d’exemple."
              : assessment.grounded
                ? "Réponse générée via Google Gemini avec recherche Google lorsque disponible."
                : "Réponse générée via Google Gemini."}
          </p>
        )}
      </div>
    </section>
  );
}

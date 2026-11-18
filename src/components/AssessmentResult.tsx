"use client";

import type { Assessment } from "@/lib/types";
import { UrgencyBadge } from "./UrgencyBadge";
import { Disclaimer } from "./Disclaimer";
import { useLocale } from "./LocaleProvider";

export function AssessmentResult({ assessment }: { assessment: Assessment }) {
  const { t } = useLocale();

  return (
    <section className="animate-fade-slide space-y-5" aria-label={t.assessment.aria}>
      <UrgencyBadge level={assessment.urgency} />

      <div>
        <h2 className="font-display text-2xl text-[var(--brand-deep)]">
          {t.assessment.summary}
        </h2>
        <p className="mt-2 leading-relaxed text-[var(--ink)]">{assessment.summary}</p>
      </div>

      <div>
        <h3 className="font-display text-xl text-[var(--brand-deep)]">
          {t.assessment.causes}
        </h3>
        <ol className="mt-3 space-y-3">
          {assessment.likelyCauses.map((cause) => (
            <li
              key={`${cause.rank}-${cause.title}`}
              className="border-l-2 border-[var(--brand)] ps-4"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                  #{cause.rank}
                </span>
                <span className="font-medium">{cause.title}</span>
                <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-xs text-[var(--brand-deep)]">
                  {t.assessment.confidence} {t.confidence[cause.confidence]}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">{cause.rationale}</p>
            </li>
          ))}
        </ol>
      </div>

      {assessment.clarifyingQuestions.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[var(--brand-deep)]">
            {t.assessment.questions}
          </h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-[var(--ink)]">
            {assessment.clarifyingQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-display text-xl text-[var(--brand-deep)]">
          {t.assessment.nextSteps}
        </h3>
        <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-[var(--ink)]">
          {assessment.nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {assessment.needsExamOrLabs.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[var(--brand-deep)]">
            {t.assessment.exams}
          </h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-[var(--ink)]">
            {assessment.needsExamOrLabs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {assessment.sources && assessment.sources.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[var(--brand-deep)]">
            {t.assessment.sources}
          </h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-[var(--ink)]">
            {assessment.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-deep)] underline decoration-[var(--brand)]/40 underline-offset-2 hover:decoration-[var(--brand)]"
                >
                  {s.title}
                </a>
                {s.publisher ? (
                  <span className="text-[var(--ink-muted)]"> — {s.publisher}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white/60 px-4 py-3">
        <Disclaimer />
        {(assessment.mock || assessment.grounded !== undefined) && (
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            {assessment.mock
              ? t.assessment.mockNote
              : assessment.grounded
                ? t.assessment.groundedNote
                : t.assessment.geminiNote}
            {assessment.knowledgeHits && assessment.knowledgeHits.length > 0
              ? ` [${assessment.knowledgeHits.join(", ")}]`
              : ""}
          </p>
        )}
      </div>
    </section>
  );
}

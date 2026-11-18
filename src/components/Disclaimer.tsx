import { DISCLAIMER_LONG, PRIVACY_GEMINI_NOTICE } from "@/lib/prompts";

type Props = {
  variant?: "banner" | "inline" | "privacy";
};

export function Disclaimer({ variant = "inline" }: Props) {
  if (variant === "privacy") {
    return (
      <div
        className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--brand-soft)]/40 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]"
        role="note"
      >
        <strong>Confidentialité &amp; traitement. </strong>
        {PRIVACY_GEMINI_NOTICE}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        <strong className="text-[var(--ink)]">Avertissement médical. </strong>
        {DISCLAIMER_LONG}
      </div>
    );
  }

  return (
    <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
      <strong className="text-[var(--ink)]">Important : </strong>
      {DISCLAIMER_LONG}
    </p>
  );
}

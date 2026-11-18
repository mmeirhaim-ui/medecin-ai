import { DISCLAIMER_LONG } from "@/lib/prompts";

type Props = {
  variant?: "banner" | "inline";
};

export function Disclaimer({ variant = "inline" }: Props) {
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

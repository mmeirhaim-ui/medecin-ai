"use client";

type Props = {
  label: string;
  className?: string;
};

/** Classic “AI thinking” indicator: three dots appearing one after another. */
export function ThinkingDots({ label, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="thinking-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="text-sm text-[var(--ink-muted)]">{label}</span>
    </span>
  );
}

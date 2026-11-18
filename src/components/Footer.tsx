import { DISCLAIMER_SHORT } from "@/lib/prompts";

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--line)] bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-display text-lg text-[var(--brand-deep)]">Medecin AI</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">
          {DISCLAIMER_SHORT}
        </p>
        <p className="mt-4 text-xs text-[var(--ink-muted)]">
          © 2026 Medecin AI — orientation médicale assistée
        </p>
      </div>
    </footer>
  );
}

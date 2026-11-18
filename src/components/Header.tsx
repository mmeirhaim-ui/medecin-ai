"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguagePicker } from "./LanguagePicker";
import { useLocale } from "./LocaleProvider";

export function Header() {
  const pathname = usePathname();
  const { t } = useLocale();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/consulter", label: t.nav.consult },
    { href: "/historique", label: t.nav.history },
  ];

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-[var(--brand-deep)] sm:text-[1.75rem]">
            Doctor{" "}
            <span className="italic text-[var(--brand)] transition-colors group-hover:text-[var(--brand-deep)]">
              IA
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            aria-label={t.nav.main}
            className="flex items-center gap-1 text-sm sm:gap-2"
          >
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    active
                      ? "bg-[var(--brand)] text-white"
                      : "text-[var(--ink-muted)] hover:bg-white/60 hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <LanguagePicker />
        </div>
      </div>
    </header>
  );
}

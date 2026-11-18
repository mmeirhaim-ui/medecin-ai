"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/consulter", label: "Consulter" },
  { href: "/historique", label: "Historique" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-[var(--brand-deep)] sm:text-[1.75rem]">
            Medcin{" "}
            <span className="italic text-[var(--brand)] transition-colors group-hover:text-[var(--brand-deep)]">
              AI
            </span>
          </span>
        </Link>
        <nav
          aria-label="Navigation principale"
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
      </div>
    </header>
  );
}

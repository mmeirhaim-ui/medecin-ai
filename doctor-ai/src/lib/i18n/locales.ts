export const LOCALES = ["en", "fr", "he", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "doctor-ai-locale";
/** Previous brand key — still read for continuity. */
export const LOCALE_STORAGE_KEY_LEGACY = "doctor-ia-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  he: "עברית",
  ru: "Русский",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return locale === "he";
}

/** Map BCP-47 / navigator language to supported locale. */
export function matchBrowserLocale(raw: string | undefined | null): Locale | null {
  if (!raw) return null;
  const base = raw.trim().toLowerCase().split("-")[0];
  if (isLocale(base)) return base;
  return null;
}

export function detectDeviceLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ];
  for (const c of candidates) {
    const matched = matchBrowserLocale(c);
    if (matched) return matched;
  }
  return DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(LOCALE_STORAGE_KEY) ||
      localStorage.getItem(LOCALE_STORAGE_KEY_LEGACY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
}

export function resolveInitialLocale(): Locale {
  return readStoredLocale() ?? detectDeviceLocale();
}

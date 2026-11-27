// Locale helpers for the translated blog: English lives at /blog and /<slug> (no prefix),
// German at /de/blog and /de/<slug>, Spanish at /es/blog and /es/<slug>.

export type Locale = "en" | "de" | "es";
export const LOCALES: Locale[] = ["en", "de", "es"];

export const LOCALE_INFO: Record<Locale, { hreflang: string; ogLocale: string; dateLocale: string; label: string }> = {
  en: { hreflang: "en", ogLocale: "en_US", dateLocale: "en-US", label: "English" },
  de: { hreflang: "de", ogLocale: "de_DE", dateLocale: "de-DE", label: "Deutsch" },
  es: { hreflang: "es", ogLocale: "es_ES", dateLocale: "es-ES", label: "Español" },
};

/** "/de/blog" -> { locale: "de", rest: "/blog" }; unprefixed paths are English. */
export function parseLocale(path: string): { locale: Locale; rest: string } {
  const m = path.match(/^\/(de|es)(\/.*)?$/);
  if (!m) return { locale: "en", rest: path || "/" };
  return { locale: m[1] as Locale, rest: m[2] && m[2] !== "/" ? m[2] : "/" };
}

/** "/blog" + "de" -> "/de/blog"; English stays unprefixed. */
export function localizePath(path: string, locale: Locale): string {
  const { rest } = parseLocale(path);
  if (locale === "en") return rest;
  return rest === "/" ? `/${locale}` : `/${locale}${rest}`;
}

export function fmtDateLocale(isoDate: string, locale: Locale): string {
  return new Date(isoDate).toLocaleDateString(LOCALE_INFO[locale].dateLocale, { year: "numeric", month: "long", day: "numeric" });
}

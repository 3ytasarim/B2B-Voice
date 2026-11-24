/**
 * Cookie / consent logic (pure - no browser access, so it can be unit-tested).
 *
 * Nothing but strictly necessary storage runs without a decision. Categories:
 *   - "statistics": Google Analytics 4 (gtag.js, ID from /api/tracking) and the Umami page counter
 *   - "replay":     Umami session recording (recorder.js: clicks, scrolling, mouse movement)
 *   - "marketing":  Google Tag Manager container (currently only the Meta/Facebook pixel) and a Google Ads ID, if one is configured
 * "Necessary" (language, this choice itself, forms, security) needs no consent and is not listed here.
 *
 * KEY and VERSION are duplicated in index.html (the inline loader runs before React): keep both in sync.
 */

export const CONSENT_KEY = "b2bv-consent";
/** Bump whenever the categories change in substance: older choices then no longer count. */
export const CONSENT_VERSION = 1;

export type ConsentCategory = "statistics" | "replay" | "marketing";

export interface ConsentChoice {
  statistics: boolean;
  replay: boolean;
  marketing: boolean;
}

export interface Consent extends ConsentChoice {
  v: number;
  /** ISO timestamp of the decision (proof of consent). */
  at: string;
}

export const ACCEPT_ALL: ConsentChoice = { statistics: true, replay: true, marketing: true };
export const REJECT_ALL: ConsentChoice = { statistics: false, replay: false, marketing: false };

export function makeConsent(choice: ConsentChoice, now: Date = new Date()): Consent {
  return {
    v: CONSENT_VERSION,
    statistics: choice.statistics === true,
    replay: choice.replay === true,
    marketing: choice.marketing === true,
    at: now.toISOString(),
  };
}

/** Parses a stored value. Anything that does not match exactly (broken, other version) counts as "not decided yet". */
export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent> | null;
    if (!value || typeof value !== "object") return null;
    if (value.v !== CONSENT_VERSION) return null;
    if (typeof value.statistics !== "boolean" || typeof value.replay !== "boolean" || typeof value.marketing !== "boolean") return null;
    if (typeof value.at !== "string") return null;
    return { v: value.v, statistics: value.statistics, replay: value.replay, marketing: value.marketing, at: value.at };
  } catch {
    return null;
  }
}

/** The categories that may run at this state. Without a decision: none. */
export function allowedCategories(consent: Consent | null): ConsentCategory[] {
  if (!consent) return [];
  const out: ConsentCategory[] = [];
  if (consent.statistics) out.push("statistics");
  if (consent.replay) out.push("replay");
  if (consent.marketing) out.push("marketing");
  return out;
}

/** A loaded third-party script cannot be unloaded: when something is withdrawn the page has to reload. */
export function needsReload(previous: Consent | null, next: ConsentChoice): boolean {
  if (!previous) return false;
  return (previous.statistics && !next.statistics) || (previous.replay && !next.replay) || (previous.marketing && !next.marketing);
}

const NO_BANNER_PREFIXES = ["/admin"];

/** The popup belongs on the public website, not in the admin area. */
export function showsBannerOn(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return !NO_BANNER_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

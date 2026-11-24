import { useSyncExternalStore } from "react";
import { CONSENT_KEY, makeConsent, needsReload, parseConsent, type Consent, type ConsentChoice } from "./consent";

/** Browser side of the consent: store it, announce changes, start/stop what is allowed. */

export const OPEN_SETTINGS_EVENT = "b2bv-cookie-settings";
export const CONSENT_CHANGED_EVENT = "b2bv-consent-changed";

let current: Consent | null | undefined; // undefined = not read yet
const listeners = new Set<() => void>();

function readStored(): Consent | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return null; // e.g. private mode: the choice then only lasts for this session
  }
}

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  if (current === undefined) current = readStored();
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveConsent(choice: ConsentChoice): Consent {
  const previous = getConsent();
  const next = makeConsent(choice);
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    // not storable: applies to this session only
  }
  current = next;
  listeners.forEach((l) => l());
  // Withdrawing cannot unload a script that is already running: reload instead.
  if (needsReload(previous, next)) {
    window.location.reload();
    return next;
  }
  // The inline loader in index.html starts Umami / recorder / GTM; the Google tag listens for the event.
  (window as unknown as { __b2bvConsentChanged?: () => void }).__b2bvConsentChanged?.();
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
  return next;
}

export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

/** Opens the popup with the settings (e.g. from the footer link) so the choice can be changed at any time. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export const COOKIE_SETTINGS_LABEL: Record<string, string> = {
  en: "Cookie Settings",
  de: "Cookie-Einstellungen",
  es: "Configuración de Cookies",
};

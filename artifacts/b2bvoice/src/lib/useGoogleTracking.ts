import { useEffect } from "react";
import { CONSENT_CHANGED_EVENT, getConsent } from "./consentStore";

type TrackingConfig = { searchConsoleCode: string; analyticsId: string; adsId: string; adsConversionLabel: string };
type Win = Window & {
  __b2bvAfterInteraction?: (fn: () => void) => void;
  __b2bvGtagSettled?: () => void;
  gtag?: (...args: unknown[]) => void;
};

let configPromise: Promise<TrackingConfig | null> | null = null;
const configured = new Set<string>();

function loadConfig(): Promise<TrackingConfig | null> {
  if (!configPromise) {
    configPromise = fetch("/api/tracking")
      .then((r) => r.json() as Promise<TrackingConfig>)
      .catch(() => null);
  }
  return configPromise;
}

/**
 * Loads gtag.js (Google Analytics 4 / Ads) - only for the categories the visitor agreed to:
 *   statistics -> analyticsId, marketing -> adsId.
 * It is the only GA4 loader (the GTM container holds just the Meta pixel). It starts on the
 * visitor's first interaction or 4 s after load (never competing with the first render); GTM is
 * started by the inline loader in index.html only once gtag.js has loaded (or is known not to).
 */
async function applyGoogleTag() {
  const win = window as Win;
  const settled = () => win.__b2bvGtagSettled?.();
  const cfg = await loadConfig();
  const consent = getConsent();
  const ids: string[] = [];
  if (cfg?.analyticsId && consent?.statistics) ids.push(cfg.analyticsId);
  if (cfg?.adsId && consent?.marketing) ids.push(cfg.adsId);
  if (!ids.length) {
    // Only once a decision exists: before that, a later "accept" may still start gtag.js and GTM must wait for it.
    if (consent) settled();
    return;
  }

  // gtag.js already running (consent widened later): just configure the newly allowed IDs.
  if (document.getElementById("gtag-script")) {
    for (const id of ids) {
      if (!configured.has(id)) {
        win.gtag?.("config", id);
        configured.add(id);
      }
    }
    return;
  }

  const start = () => {
    if (document.getElementById("gtag-script")) return;
    const s = document.createElement("script");
    s.id = "gtag-script";
    s.async = true;
    s.onload = s.onerror = settled;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;
    document.head.appendChild(s);
    const init = document.createElement("script");
    init.id = "gtag-init";
    let code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`;
    for (const id of ids) {
      code += `gtag('config','${id}');`;
      configured.add(id);
    }
    init.textContent = code;
    document.head.appendChild(init);
  };
  if (win.__b2bvAfterInteraction) win.__b2bvAfterInteraction(start);
  else start();
}

export function useGoogleTracking() {
  useEffect(() => {
    // Search Console verification is a plain <meta> tag: no tracking, no consent needed.
    void loadConfig().then((d) => {
      if (!d?.searchConsoleCode) return;
      let el = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
      if (!el) {
        el = document.createElement("meta");
        el.name = "google-site-verification";
        document.head.appendChild(el);
      }
      el.content = d.searchConsoleCode;
    });
    void applyGoogleTag();
    window.addEventListener(CONSENT_CHANGED_EVENT, applyGoogleTag);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, applyGoogleTag);
  }, []);
}

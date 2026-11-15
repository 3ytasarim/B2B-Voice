import { useEffect } from "react";

export function useGoogleTracking() {
  useEffect(() => {
    fetch("/api/tracking")
      .then(r => r.json())
      .then((d: { searchConsoleCode: string; analyticsId: string; adsId: string; adsConversionLabel: string }) => {
        if (d.searchConsoleCode) {
          let el = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
          if (!el) { el = document.createElement("meta"); el.name = "google-site-verification"; document.head.appendChild(el); }
          el.content = d.searchConsoleCode;
        }
        const gtagId = d.analyticsId || d.adsId;
        // gtag.js (GA4) is the only GA4 loader: the GTM container only holds the
        // Meta pixel (verified against the published container), so there is no
        // double page_view. It starts on the visitor's first interaction or 4 s
        // after load (never competing with first render); GTM is started by the
        // shell script only once gtag.js has loaded (see index.html).
        const settled = () => (window as unknown as { __b2bvGtagSettled?: () => void }).__b2bvGtagSettled?.();
        const start = () => {
          if (!gtagId || document.getElementById("gtag-script")) { settled(); return; }
          const s = document.createElement("script");
          s.id = "gtag-script"; s.async = true;
          s.onload = s.onerror = settled;
          s.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
          document.head.appendChild(s);
          const init = document.createElement("script");
          init.id = "gtag-init";
          let code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`;
          if (d.analyticsId) code += `gtag('config','${d.analyticsId}');`;
          if (d.adsId) code += `gtag('config','${d.adsId}');`;
          init.textContent = code;
          document.head.appendChild(init);
        };
        const defer = (window as unknown as { __b2bvAfterInteraction?: (fn: () => void) => void }).__b2bvAfterInteraction;
        if (defer) defer(start);
        else start();
      })
      .catch(() => (window as unknown as { __b2bvGtagSettled?: () => void }).__b2bvGtagSettled?.());
  }, []);
}

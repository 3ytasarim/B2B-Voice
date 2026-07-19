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
        if (gtagId && !document.getElementById("gtag-script")) {
          const s = document.createElement("script");
          s.id = "gtag-script"; s.async = true;
          s.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
          document.head.appendChild(s);
          const init = document.createElement("script");
          init.id = "gtag-init";
          let code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`;
          if (d.analyticsId) code += `gtag('config','${d.analyticsId}');`;
          if (d.adsId) code += `gtag('config','${d.adsId}');`;
          init.textContent = code;
          document.head.appendChild(init);
        }
      })
      .catch(() => {});
  }, []);
}

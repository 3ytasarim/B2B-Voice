import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Cookie, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/LanguageContext";
import { ACCEPT_ALL, REJECT_ALL, showsBannerOn, type ConsentChoice } from "@/lib/consent";
import { OPEN_SETTINGS_EVENT, saveConsent, useConsent } from "@/lib/consentStore";

type Row = [title: string, text: string];
type Copy = {
  title: string;
  intro: string;
  policy: string;
  acceptAll: string;
  onlyNecessary: string;
  settings: string;
  save: string;
  close: string;
  alwaysOn: string;
  necessary: Row;
  statistics: Row;
  replay: Row;
  marketing: Row;
};

const COPY: Record<"en" | "de" | "es", Copy> = {
  en: {
    title: "Your privacy choices",
    intro: "We use strictly necessary cookies. If you agree, we also analyze how you use our website and record your browsing session.",
    policy: "Cookie Policy",
    acceptAll: "Accept all",
    onlyNecessary: "Necessary only",
    settings: "Settings",
    save: "Save choice",
    close: "Close",
    alwaysOn: "Always on",
    necessary: ["Necessary", "Language, your cookie choice, forms and security."],
    statistics: ["Statistics", "Google Analytics and a page counter show which pages are used."],
    replay: ["Session recording", "Records clicks, scrolling and mouse movement so we can improve usability."],
    marketing: ["Marketing", "Meta (Facebook) pixel, loaded through Google Tag Manager, to measure our ads."],
  },
  de: {
    title: "Ihre Datenschutz-Auswahl",
    intro: "Wir verwenden nur unbedingt erforderliche Cookies. Wenn Sie zustimmen, analysieren wir außerdem, wie Sie unsere Website nutzen, und zeichnen Ihre Sitzung auf.",
    policy: "Cookie-Richtlinie",
    acceptAll: "Alle akzeptieren",
    onlyNecessary: "Nur notwendige",
    settings: "Einstellungen",
    save: "Auswahl speichern",
    close: "Schließen",
    alwaysOn: "Immer aktiv",
    necessary: ["Notwendig", "Sprache, Ihre Cookie-Auswahl, Formulare und Sicherheit."],
    statistics: ["Statistik", "Google Analytics und ein Seitenzähler zeigen, welche Seiten genutzt werden."],
    replay: ["Sitzungsaufzeichnung", "Zeichnet Klicks, Scrollen und Mausbewegungen auf, damit wir die Bedienung verbessern können."],
    marketing: ["Marketing", "Meta-(Facebook-)Pixel über den Google Tag Manager, um unsere Werbung zu messen."],
  },
  es: {
    title: "Sus opciones de privacidad",
    intro: "Usamos solo cookies estrictamente necesarias. Si acepta, también analizamos cómo usa nuestro sitio web y grabamos su sesión de navegación.",
    policy: "Política de Cookies",
    acceptAll: "Aceptar todo",
    onlyNecessary: "Solo necesarias",
    settings: "Ajustes",
    save: "Guardar elección",
    close: "Cerrar",
    alwaysOn: "Siempre activo",
    necessary: ["Necesarias", "Idioma, su elección de cookies, formularios y seguridad."],
    statistics: ["Estadísticas", "Google Analytics y un contador de páginas muestran qué páginas se usan."],
    replay: ["Grabación de sesiones", "Registra clics, desplazamiento y movimientos del ratón para mejorar la usabilidad."],
    marketing: ["Marketing", "Píxel de Meta (Facebook), cargado mediante Google Tag Manager, para medir nuestros anuncios."],
  },
};

/**
 * Cookie popup, bottom left. Without a decision no tracking script loads. "Necessary only" and
 * "Accept all" are equally big and equally easy to reach; settings let each category be chosen.
 * The choice can be changed or withdrawn any time via the "Cookie Settings" link in the footer.
 * Renders nothing on the server, so it never ends up in the prerendered HTML.
 */
export default function CookieBanner() {
  const { lang } = useLanguage();
  const copy = COPY[lang] ?? COPY.en;
  const consent = useConsent();
  const [location] = useLocation();

  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);
  const [details, setDetails] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>(REJECT_ALL);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Appear shortly after load: does not compete with the first paint or the load-time measurements.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const draftFrom = (c: typeof consent): ConsentChoice =>
    c ? { statistics: c.statistics, replay: c.replay, marketing: c.marketing } : REJECT_ALL;

  // "Cookie Settings" in the footer opens the popup with the current state.
  useEffect(() => {
    const open = () => {
      setDraft(draftFrom(consent));
      setDetails(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, [consent]);

  const visible = reopened || (ready && consent === null && showsBannerOn(location));

  // Keyboard / screen reader users who open the settings land on the popup.
  useEffect(() => {
    if (reopened) titleRef.current?.focus();
  }, [reopened]);

  if (!visible) return null;

  const decide = (choice: ConsentChoice) => {
    saveConsent(choice);
    setReopened(false);
    setDetails(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-intro"
      data-testid="cookie-banner"
      // Above the voice-widget trigger (z-index 2147483000) so it never sits behind it on phones.
      style={{ zIndex: 2147483001 }}
      className="fixed bottom-2.5 left-2.5 right-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none sm:bottom-4 sm:left-4 sm:right-auto sm:w-[340px]"
    >
      <div className="border border-gray-200 border-t-[3px] border-t-primary bg-white p-4 text-gray-900 shadow-[0_24px_60px_-18px_rgba(0,53,122,0.35)]">
        <div className="flex items-start gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center bg-primary/10 text-primary" aria-hidden="true">
            <Cookie className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-title" ref={titleRef} tabIndex={-1} className="text-base font-bold leading-tight text-gray-900 outline-none">
              {copy.title}
            </h2>
            <p id="cookie-intro" className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
              {copy.intro}{" "}
              <Link href="/cookie-policy" className="font-semibold text-primary underline-offset-2 hover:underline">
                {copy.policy}
              </Link>
            </p>
          </div>
          {reopened && (
            <button
              type="button"
              onClick={() => { setReopened(false); setDetails(false); }}
              aria-label={copy.close}
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Settings: the height eases open (grid-rows), no layout jump */}
        <div className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${details ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden" aria-hidden={!details}>
            <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 bg-gray-50">
              <SettingRow row={copy.necessary} locked lockedLabel={copy.alwaysOn} tabbable={details} />
              <SettingRow row={copy.statistics} checked={draft.statistics} onChange={(v) => setDraft((d) => ({ ...d, statistics: v }))} tabbable={details} />
              <SettingRow row={copy.replay} checked={draft.replay} onChange={(v) => setDraft((d) => ({ ...d, replay: v }))} tabbable={details} />
              <SettingRow row={copy.marketing} checked={draft.marketing} onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))} tabbable={details} />
            </ul>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => decide(REJECT_ALL)}
            className="h-9 border border-primary/40 px-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {copy.onlyNecessary}
          </button>
          <button
            type="button"
            onClick={() => decide(ACCEPT_ALL)}
            className="h-9 bg-primary px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {copy.acceptAll}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (!details) setDraft(draftFrom(consent));
              setDetails((d) => !d);
            }}
            aria-expanded={details}
            className="inline-flex h-8 items-center gap-1 px-1 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {copy.settings}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${details ? "rotate-180" : ""}`} />
          </button>
          {details && (
            <button
              type="button"
              onClick={() => decide(draft)}
              className="h-8 px-2 text-[12.5px] font-bold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {copy.save}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  row, checked = true, onChange, locked, lockedLabel, tabbable,
}: {
  row: Row; checked?: boolean; onChange?: (value: boolean) => void; locked?: boolean; lockedLabel?: string; tabbable: boolean;
}) {
  const [title, text] = row;
  const id = `cookie-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <li className="flex items-start gap-3 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[12.5px] font-bold text-gray-900">{title}</label>
        <p className="mt-0.5 text-[11.5px] leading-snug text-gray-600">{text}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
        <Switch id={id} checked={checked} disabled={locked} tabIndex={tabbable ? 0 : -1} onCheckedChange={onChange} />
        {locked && <span className="text-[11px] text-gray-500">{lockedLabel}</span>}
      </div>
    </li>
  );
}

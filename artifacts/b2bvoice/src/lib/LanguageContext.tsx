import React, { createContext, useContext, useEffect, useState } from "react";
import { T, type Lang, type Translations } from "./translations";

function detectBrowserLang(): Lang {
  const supported: Lang[] = ["en", "de", "es"];
  const browserLangs = navigator.languages ?? [navigator.language];
  for (const bl of browserLangs) {
    const code = bl.toLowerCase().split("-")[0] as Lang;
    if (supported.includes(code)) return code;
  }
  return "en";
}

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: T.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start in English so the server-rendered HTML and the first client
  // render match (hydration); the visitor's language is applied right after.
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    setLang(detectBrowserLang());
  }, []);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Pins the language for a subtree (the blog pages take theirs from the URL: /de/..., /es/...).
 * `onSwitch` replaces the language dropdown's behaviour, e.g. to navigate to the translated URL.
 */
export function LanguageScope({ lang, onSwitch, children }: { lang: Lang; onSwitch: (lang: Lang) => void; children: React.ReactNode }) {
  return <LanguageContext.Provider value={{ lang, setLang: onSwitch, t: T[lang] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

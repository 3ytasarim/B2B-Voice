import { useEffect } from "react";
import { canonicalFor, type PageMeta } from "./pageMeta";

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: "name" | "property", val: string) => () => {
  const el = document.createElement("meta");
  el.setAttribute(key, val);
  return el;
};

/**
 * Keeps <head> in sync with the current page during client-side navigation.
 * The first HTML response already contains the same values (prerendered),
 * so on a direct visit this is a no-op.
 */
export function usePageMeta(page: PageMeta) {
  useEffect(() => {
    const url = canonicalFor(page.path);
    document.title = page.title;
    setTag('meta[name="description"]', meta("name", "description"), "content", page.description);
    setTag('meta[name="robots"]', meta("name", "robots"), "content", page.noindex ? "noindex, nofollow" : "index, follow");
    setTag('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", url);
    setTag('meta[property="og:type"]', meta("property", "og:type"), "content", page.ogType);
    setTag('meta[property="og:title"]', meta("property", "og:title"), "content", page.title);
    setTag('meta[property="og:description"]', meta("property", "og:description"), "content", page.description);
    setTag('meta[property="og:url"]', meta("property", "og:url"), "content", url);
    setTag('meta[property="og:image"]', meta("property", "og:image"), "content", page.ogImage);
    setTag('meta[name="twitter:title"]', meta("name", "twitter:title"), "content", page.title);
    setTag('meta[name="twitter:description"]', meta("name", "twitter:description"), "content", page.description);
    setTag('meta[name="twitter:image"]', meta("name", "twitter:image"), "content", page.ogImage);
  }, [page]);
}

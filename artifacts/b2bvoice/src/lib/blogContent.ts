// On-demand article markup for the posts imported from the content packages and for every
// translation (src/blog/articles/<slug>.html for English, <lang>/<slug>.html for German / Spanish,
// optional .js with the calculator script). Each article is its own chunk, so the blog index and the
// original posts never download the other articles' HTML.
//
// Rendering needs the markup synchronously: the prerender (and React's Suspense) waits for the
// promise, and the browser entry preloads it before hydrating, so hydration finds it in `cache`.
import type { Locale } from "./i18n";

const htmlLoaders = {
  ...(import.meta.glob("../blog/articles/*.html", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
  ...(import.meta.glob("../blog/articles/de/*.html", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
  ...(import.meta.glob("../blog/articles/es/*.html", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
};
const scriptLoaders = {
  ...(import.meta.glob("../blog/articles/*.js", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
  ...(import.meta.glob("../blog/articles/de/*.js", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
  ...(import.meta.glob("../blog/articles/es/*.js", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>),
};

export interface PostContent {
  html: string;
  script: string;
}

const cache = new Map<string, PostContent>();
const pending = new Map<string, Promise<PostContent>>();

const dir = (locale: Locale) => (locale === "en" ? "../blog/articles" : `../blog/articles/${locale}`);
const keyFor = (slug: string, ext: "html" | "js", locale: Locale) => `${dir(locale)}/${slug}.${ext}`;
const cacheKey = (slug: string, locale: Locale) => `${locale}:${slug}`;

export function hasPostContent(slug: string, locale: Locale = "en"): boolean {
  return keyFor(slug, "html", locale) in htmlLoaders;
}

export function loadPostContent(slug: string, locale: Locale = "en"): Promise<PostContent> {
  const k = cacheKey(slug, locale);
  const done = cache.get(k);
  if (done) return Promise.resolve(done);
  let p = pending.get(k);
  if (!p) {
    const htmlLoader = htmlLoaders[keyFor(slug, "html", locale)];
    const scriptLoader = scriptLoaders[keyFor(slug, "js", locale)];
    p = Promise.all([htmlLoader(), scriptLoader ? scriptLoader() : Promise.resolve("")]).then(([html, script]) => {
      const content = { html, script };
      cache.set(k, content);
      return content;
    });
    pending.set(k, p);
  }
  return p;
}

/** The markup if it is already loaded, otherwise throws the loading promise (for Suspense). */
export function readPostContent(slug: string, locale: Locale = "en"): PostContent {
  const done = cache.get(cacheKey(slug, locale));
  if (done) return done;
  throw loadPostContent(slug, locale);
}

/** Used by the browser entry before hydrating a post page. Resolves for unknown slugs too. */
export async function preloadPostContent(slug: string, locale: Locale = "en"): Promise<void> {
  if (hasPostContent(slug, locale)) await loadPostContent(slug, locale);
}

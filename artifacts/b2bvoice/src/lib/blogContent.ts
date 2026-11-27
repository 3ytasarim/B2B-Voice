// On-demand article markup for the posts imported from the content packages
// (src/blog/articles/<slug>.html, optional <slug>.js). Each article is its own chunk, so the
// blog index and the original posts never download the other articles' HTML.
//
// Rendering needs the markup synchronously: the prerender (and React's Suspense) waits for the
// promise, and the browser entry preloads it before hydrating, so hydration finds it in `cache`.

const htmlLoaders = import.meta.glob("../blog/articles/*.html", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>;
const scriptLoaders = import.meta.glob("../blog/articles/*.js", { query: "?raw", import: "default" }) as Record<string, () => Promise<string>>;

export interface PostContent {
  html: string;
  script: string;
}

const cache = new Map<string, PostContent>();
const pending = new Map<string, Promise<PostContent>>();

const keyFor = (slug: string, ext: "html" | "js") => `../blog/articles/${slug}.${ext}`;

export function hasPostContent(slug: string): boolean {
  return keyFor(slug, "html") in htmlLoaders;
}

export function loadPostContent(slug: string): Promise<PostContent> {
  const done = cache.get(slug);
  if (done) return Promise.resolve(done);
  let p = pending.get(slug);
  if (!p) {
    const htmlLoader = htmlLoaders[keyFor(slug, "html")];
    const scriptLoader = scriptLoaders[keyFor(slug, "js")];
    p = Promise.all([htmlLoader(), scriptLoader ? scriptLoader() : Promise.resolve("")]).then(([html, script]) => {
      const content = { html, script };
      cache.set(slug, content);
      return content;
    });
    pending.set(slug, p);
  }
  return p;
}

/** The markup if it is already loaded, otherwise throws the loading promise (for Suspense). */
export function readPostContent(slug: string): PostContent {
  const done = cache.get(slug);
  if (done) return done;
  throw loadPostContent(slug);
}

/** Used by the browser entry before hydrating a post page. Resolves for unknown slugs too. */
export async function preloadPostContent(slug: string): Promise<void> {
  if (hasPostContent(slug)) await loadPostContent(slug);
}

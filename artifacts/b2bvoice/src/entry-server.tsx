import { prerenderToNodeStream } from "react-dom/static";
import App from "./App";

/** Renders the app for `path` to an HTML string (waits for lazy routes). */
export async function render(path: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(<App ssrPath={path} />);
  let html = "";
  for await (const chunk of prelude) html += chunk.toString();
  return html;
}

import { blogPosts as posts, hasTranslation, localizePost } from "./lib/blogPosts";
import { localizePath, type Locale } from "./lib/i18n";
import { jsonLdFor } from "./seo/jsonLd";
import { STATIC_PAGES, NOT_FOUND_META, ADMIN_META, blogIndexMeta, postMeta, type PageMeta } from "./seo/pageMeta";

export interface PrerenderPage {
  meta: PageMeta;
  jsonLd: object[];
  /** Ready to be served as a static HTML file (vs. an empty SPA shell). */
  ssr: boolean;
  /** ISO date used as sitemap <lastmod>. */
  lastmod?: string;
}

/** Every public page that gets its own static HTML, in sitemap order. */
export function getPages(): PrerenderPage[] {
  const pages: PrerenderPage[] = STATIC_PAGES.map((meta) => ({
    meta,
    jsonLd: jsonLdFor(meta, posts),
    ssr: true,
  }));
  const newest = posts.map((p) => p.date).sort().at(-1);
  const blog = pages.find((p) => p.meta.path === "/blog");
  if (blog) blog.lastmod = newest;
  const home = pages.find((p) => p.meta.path === "/");
  if (home) home.lastmod = newest;
  for (const post of posts) {
    const meta = postMeta(post);
    pages.push({ meta, jsonLd: jsonLdFor(meta, posts), ssr: true, lastmod: post.date });
  }
  // German and Spanish blog: /de/blog, /de/<slug>, /es/blog, /es/<slug>
  for (const locale of ["de", "es"] as Locale[]) {
    const localized = posts.filter((p) => hasTranslation(p.slug, locale)).map((p) => localizePost(p, locale));
    if (!localized.length) continue;
    const index = blogIndexMeta(locale);
    pages.push({ meta: index, jsonLd: jsonLdFor(index, localized), ssr: true, lastmod: newest });
    for (const post of localized) {
      const meta = postMeta(post, locale);
      pages.push({ meta, jsonLd: jsonLdFor(meta, localized), ssr: true, lastmod: post.date });
    }
  }
  return pages;
}

export const notFoundPage = { meta: NOT_FOUND_META, jsonLd: [] as object[], ssr: true };
export const adminPage = { meta: ADMIN_META, jsonLd: [] as object[], ssr: false };
export const getPosts = () => posts;

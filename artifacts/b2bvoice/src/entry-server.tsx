import { prerenderToNodeStream } from "react-dom/static";
import App from "./App";

/** Renders the app for `path` to an HTML string (waits for lazy routes). */
export async function render(path: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(<App ssrPath={path} />);
  let html = "";
  for await (const chunk of prelude) html += chunk.toString();
  return html;
}

import { blogPosts as posts } from "./lib/blogPosts";
import { jsonLdFor } from "./seo/jsonLd";
import { STATIC_PAGES, NOT_FOUND_META, ADMIN_META, postMeta, type PageMeta } from "./seo/pageMeta";

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
  return pages;
}

export const notFoundPage = { meta: NOT_FOUND_META, jsonLd: [] as object[], ssr: true };
export const adminPage = { meta: ADMIN_META, jsonLd: [] as object[], ssr: false };
export const getPosts = () => posts;

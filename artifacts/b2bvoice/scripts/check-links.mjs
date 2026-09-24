// Static link audit of the prerendered site (dist/public), no server needed.
//
//   pnpm --filter @workspace/b2bvoice run check:links
//
// Checks, for every generated .html file:
//   - internal <a href> targets exist (broken internal links)
//   - local <img src>/<source srcset>/<link href>/<script src> files exist
//   - every URL in sitemap.xml is linked from at least one OTHER page (orphans)
//   - links are real hrefs to canonical form (no trailing slash, no .html)
// Exits 1 when something is broken, so it can gate CI.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist/public");
const SITE = "https://b2b-voice.com";

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const htmlFiles = walk(root).filter((f) => f.endsWith(".html") && !f.endsWith("404.html"));
const urlOfFile = (f) => {
  const rel = path.relative(root, f).replace(/\\/g, "/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
};

/** Does a site-relative path resolve to something nginx would serve as 200? */
function resolves(p) {
  if (p === "/") return true;
  const file = path.join(root, p);
  if (existsSync(file) && statSync(file).isFile()) return true;
  return existsSync(`${file}.html`);
}

const problems = [];
const linkedFrom = new Map(); // url -> Set(pages linking to it)

for (const file of htmlFiles) {
  const page = urlOfFile(file);
  const html = readFileSync(file, "utf8");

  for (const m of html.matchAll(/<a\b[^>]*?\bhref="([^"]*)"/g)) {
    let href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|javascript:|#)/.test(href)) continue;
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (!href.startsWith("/")) continue; // external
    const [pathname] = href.split(/[?#]/);
    if (pathname.startsWith("/api/")) continue;
    if (pathname !== "/" && (pathname.endsWith("/") || pathname.endsWith(".html"))) {
      problems.push(`${page}: non-canonical link ${href}`);
    }
    const target = pathname.replace(/\/$/, "") || "/";
    if (!resolves(target)) problems.push(`${page}: BROKEN link ${href}`);
    if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
    if (target !== page) linkedFrom.get(target).add(page);
  }

  const refs = [
    ...[...html.matchAll(/<img\b[^>]*?\bsrc="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<source\b[^>]*?\bsrcset="([^"]*)"/g)].flatMap((m) =>
      m[1].split(",").map((s) => s.trim().split(/\s+/)[0]),
    ),
    ...[...html.matchAll(/<(?:link|script)\b[^>]*?\b(?:href|src)="([^"]*)"/g)].map((m) => m[1]),
  ];
  for (const ref of refs) {
    if (!ref.startsWith("/") || ref.startsWith("//")) continue;
    if (!existsSync(path.join(root, ref.split(/[?#]/)[0]))) problems.push(`${page}: missing asset ${ref}`);
  }
}

// Orphans: sitemap URLs nobody else links to.
const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(SITE.length) || "/");
for (const p of sitemapPaths) {
  if (p === "/") continue;
  if (!linkedFrom.get(p)?.size) problems.push(`ORPHAN (in sitemap, linked from no other page): ${p}`);
}

console.log(`checked ${htmlFiles.length} pages, ${sitemapPaths.length} sitemap URLs`);
if (problems.length) {
  console.log(problems.map((p) => `  ✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("  ✓ no broken links, no orphans");

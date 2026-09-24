// Post-build static site generation.
//
//   vite build            -> dist/public (client bundle + index.html shell)
//   node scripts/prerender.mjs
//     1. builds src/entry-server.tsx for Node (dist/server)
//     2. renders every public route to real HTML with page-specific
//        <title>, description, canonical, Open Graph, Twitter and JSON-LD
//     3. writes dist/public/<route>.html, 404.html, admin shells,
//        sitemap.xml
//
// The React app hydrates the prerendered markup, so users see the same page
// crawlers get. nginx maps /route -> /route.html (see deploy/nginx).
import { build } from "vite";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "dist/public");
const serverDir = path.join(root, "dist/server");
const SITE_URL = "https://b2b-voice.com";

process.env.PORT ??= "5173";
process.env.BASE_PATH ??= "/";

await build({
  configFile: path.join(root, "vite.config.ts"),
  logLevel: "warn",
  build: {
    ssr: path.join(root, "src/entry-server.tsx"),
    minify: false,
    outDir: serverDir,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "entry-server.mjs", manualChunks: undefined } },
  },
  ssr: { noExternal: true },
});

const { render, getPages, notFoundPage, adminPage } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.mjs")).href
);

const shell = await readFile(path.join(publicDir, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const canonical = (p) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`);

function headBlock({ meta, jsonLd }) {
  const url = canonical(meta.path);
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, nofollow" : "index, follow"}" />`,
    meta.noindex ? "" : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="B2BVoice" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${meta.ogImage}" />`,
    ...(meta.ogImage.endsWith("/opengraph.jpg") || meta.ogImage.includes("/og/")
      ? [
          `<meta property="og:image:type" content="image/jpeg" />`,
          `<meta property="og:image:width" content="${meta.ogImage.includes("/og/") ? 1200 : 1280}" />`,
          `<meta property="og:image:height" content="${meta.ogImage.includes("/og/") ? 630 : 720}" />`,
          `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
        ]
      : []),
    ...(meta.published ? [`<meta property="article:published_time" content="${meta.published}" />`] : []),
    `<link rel="alternate" type="application/rss+xml" title="B2BVoice Blog" href="${SITE_URL}/blog/rss.xml" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${meta.ogImage}" />`,
    ...jsonLd.map(
      (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\u003c")}</script>`,
    ),
  ].filter(Boolean);
  return lines.map((l) => `    ${l}`).join("\n");
}

function assemble(page, bodyHtml) {
  let html = shell
    // drop the shell's generic metadata; the page-specific block replaces it
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="(description|robots)"[^>]*>/g, "")
    .replace(/\s*<meta (property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/g, "")
    .replace(/\s*<!-- (Open Graph|Twitter)[^>]*-->/g, "")
    .replace(/(<meta name="viewport"[^>]*>)/, `$1\n${headBlock(page)}`);
  html = html.replace(
    '<div id="root" style="overflow-x:hidden;max-width:100vw;"></div>',
    `<div id="root" style="overflow-x:hidden;max-width:100vw;"${bodyHtml ? ' data-prerendered="true"' : ""}>${bodyHtml}</div>`,
  );
  return html;
}

async function write(rel, content) {
  const file = path.join(publicDir, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

const pages = getPages();
for (const page of pages) {
  const body = await render(page.meta.path);
  const rel = page.meta.path === "/" ? "index.html" : `${page.meta.path.slice(1)}.html`;
  await write(rel, assemble(page, body));
  console.log(`prerendered ${page.meta.path} -> ${rel} (${body.length} chars)`);
}

// Social cards: one 1200x630 JPG per page (title on the brand background).
const wrap = (text, max) => {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > max && line) { lines.push(line); line = word; }
    else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
};
const xmlEsc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const logoPng = await sharp(path.join(publicDir, "logo-footer-white.png")).resize({ width: 340 }).png().toBuffer();
const fallbackOg = path.join(publicDir, "opengraph.jpg");
for (const page of pages) {
  const m = page.meta;
  const name = m.ogImage.match(/\/og\/([^/]+)\.jpg$/)?.[1];
  if (!name) continue;
  const raw = m.path === "/" ? "Your AI Voice Assistant Talks to Customers 24/7" : m.title.replace(/ \| .*$/, "");
  const label = m.ogType === "article" ? "AI VOICE AGENT GUIDE" : m.path === "/" ? "24/7 AI VOICE ASSISTANT" : "B2BVOICE";
  const size = raw.length <= 55 ? 68 : raw.length <= 105 ? 54 : 44;
  const lines = wrap(raw, Math.floor(1040 / (size * 0.52))).slice(0, 4);
  const tspans = lines.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : Math.round(size * 1.18)}">${xmlEsc(l)}</tspan>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00357a"/><stop offset="1" stop-color="#001a3f"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="1200" height="8" fill="#22b8e8"/>
  <text x="80" y="200" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="#22b8e8">${xmlEsc(label)}</text>
  <text x="80" y="${200 + size + 20}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="800" fill="#ffffff">${tspans}</text>
  <text x="80" y="576" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" fill="#9fd6f2">b2b-voice.com</text>
</svg>`;
  const out = path.join(publicDir, "og", `${name}.jpg`);
  await mkdir(path.dirname(out), { recursive: true });
  try {
    await sharp(Buffer.from(svg))
      .composite([{ input: logoPng, left: 80, top: 70 }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
  } catch (err) {
    console.warn(`og image for ${m.path} failed (${err.message}); using opengraph.jpg`);
    await copyFile(fallbackOg, out);
  }
}
console.log("og images written");

// Real 404 page (nginx serves it with status 404).
await write("404.html", assemble(notFoundPage, await render("/404")));

// Admin stays a client-side SPA: an empty shell with noindex.
await write("admin.html", assemble(adminPage, ""));
await write("admin/login.html", assemble(adminPage, ""));

// sitemap.xml — only canonical, indexable URLs.
const urls = pages
  .filter((p) => !p.meta.noindex)
  .map(
    (p) =>
      `  <url>\n    <loc>${canonical(p.meta.path)}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ""}\n  </url>`,
  )
  .join("\n");
await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${pages.filter((p) => !p.meta.noindex).length} urls`);

// RSS feed + llms.txt (optional extras; generated from the same post list).
const { getPosts } = await import(pathToFileURL(path.join(serverDir, "entry-server.mjs")).href);
const posts = getPosts().slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
await write(
  "blog/rss.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>B2BVoice Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Insights on AI voice agents, business automation and customer communication from B2BVoice.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${SITE_URL}/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${xml(p.excerpt)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`,
);
await write(
  "llms.txt",
  `# B2BVoice

> B2BVoice designs and builds custom AI voice agents and AI receptionists that answer calls, schedule appointments and sync with business systems such as CRMs and calendars.

## Main pages
- [Home](${SITE_URL}/): what B2BVoice builds and for whom
- [Book a demo](${SITE_URL}/demo): request a free custom AI voice agent demo
- [Blog](${SITE_URL}/blog): technical guides on AI voice agents

## Articles
${posts.map((p) => `- [${p.title}](${SITE_URL}/${p.slug}): ${p.excerpt.replace(/\s+/g, " ")}`).join("\n")}

## Legal
- [Privacy Policy](${SITE_URL}/privacy-policy)
- [Cookie Policy](${SITE_URL}/cookie-policy)
- [Terms of Use](${SITE_URL}/terms-of-use)
- [Legal Notice](${SITE_URL}/legal-notice)
`,
);
console.log("blog/rss.xml + llms.txt written");

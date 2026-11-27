// One-off importer for the content team's article packages (Phase 2 + Phase 3).
//
//   node scripts/import-blog.mjs <folder containing B2B-Voice-Phase-2 / B2B-Voice-Phase-3>
//
// For every article it writes (committed, so the build never needs the packages):
//   src/blog/articles/<slug>.html   scoped <style> + the article's own <main> markup
//   src/blog/articles/<slug>.js     the article's inline calculator script, if it has one
// and src/lib/blogNew.ts with the metadata (SEO title/description, excerpt, tags, FAQ).
//
// Changes made to the packages' markup (text is never edited):
//   - banner images are dropped (articles are published without photos)
//   - the article's own "back" link / breadcrumb is dropped (the page renders one itself)
//   - same-site absolute links (https://b2b-voice.com/x) become root-relative (/x)
//   - a small override block restyles them with the site's font and navy and gives every
//     article the same centred reading column
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const src = process.argv[2];
if (!src) throw new Error("usage: node scripts/import-blog.mjs <packages folder>");

/** All new posts share the release date; the packages say "set the real date at launch". */
const PUBLISHED = "2026-11-27";
const AUTHOR = "B2B Voice";

const TOPIC = {
  "ai-receptionist-vs-human-receptionist": "Operations & Integrations",
  "ai-voice-agent-call-center-implementation": "Operations & Integrations",
  "ai-voice-agents-for-call-centers": "Operations & Integrations",
  "ai-voice-agents-for-dental-practices": "Industry Solutions",
  "ai-voice-agents-for-home-services": "Industry Solutions",
  "ai-voice-agents-for-law-firms": "Industry Solutions",
  "ai-voice-agents-for-real-estate": "Industry Solutions",
  "ai-voice-agents-for-veterinary-clinics": "Industry Solutions",
  "best-ai-voice-agent-for-call-centers": "Buyer Guides",
  "cost-of-missed-business-calls": "Operations & Integrations",
  "how-to-choose-an-ai-voice-agent": "Buyer Guides",
  "how-to-integrate-ai-voice-agents": "Operations & Integrations",
};
const topicFor = (slug) => TOPIC[slug] ?? "Testing & Quality";

function parseCsv(text) {
  const rows = [];
  let row = [], cur = "", q = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur.replace(/\r$/, "")); rows.push(row); }
  const [h, ...r] = rows;
  return r.filter((x) => x.length > 1).map((x) => Object.fromEntries(h.map((k, i) => [k, x[i]])));
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const text = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/** Site look for the packages' own stylesheets: site font + navy, one centred reading column. */
const SITE_OVERRIDES = `
/* --- B2BVoice site look (added on import) --- */
.b2bv3, .b2bv { font-family: inherit; max-inline-size: 58rem; margin-inline: auto; }
.b2bv3 { --ink: #0b1f3a; --link: #00357a; --muted: #44556b; --rule: #d3dcea; --light: #f3f6fb; }
.b2bv { --b2bv-ink: #0b1f3a; --b2bv-copy: #263a57; --b2bv-blue: #00357a; --b2bv-focus: #00357a; --b2bv-light: #f3f6fb; --b2bv-line: #d3dcea; }
.b2bv3 h1, .b2bv3 h2, .b2bv3 h3, .b2bv h1, .b2bv h2, .b2bv h3 { font-family: inherit; font-weight: 700; color: #0b1f3a; }
.b2bv h1 { max-inline-size: none; }
.b2bv h2 { max-inline-size: none; }
.b2bv .b2bv-content p, .b2bv .b2bv-lede, .b2bv .b2bv-header-answer { max-inline-size: none; }
.b2bv .b2bv-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 1.5rem; }
.b2bv thead th { background: #00357a; }
.b2bv .b2bv-cta { background: #00357a; }
.b2bv .b2bv-calculator button { background: #00357a; }
.b2bv3-cta { background: #00357a !important; color: #e6eefb !important; }
.b2bv3-cta h2, .b2bv3-cta a { color: #fff !important; }
`;

function convert(htmlFile) {
  const html = readFileSync(htmlFile, "utf8");
  const title = text((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "");
  const seoTitle = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").trim();
  const metaDescription = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");

  let faq = [];
  const ld = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
  if (ld) {
    const graph = JSON.parse(ld)["@graph"] || [];
    const f = graph.find((x) => x["@type"] === "FAQPage");
    if (f) faq = f.mainEntity.map((e) => ({ q: e.name, a: text(e.acceptedAnswer.text) }));
  }

  let style = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [])[1] || "";
  style += SITE_OVERRIDES;
  let main = (html.match(/<main[\s\S]*?<\/main>/) || [])[0];
  if (!main) throw new Error("no <main> in " + htmlFile);

  main = main
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "") // banners
    .replace(/<img\b[^>]*>/g, "")
    .replace(/<a[^>]*class="b2bv-back"[^>]*>[\s\S]*?<\/a>/g, "") // own back link (page renders one)
    .replace(/<nav[^>]*class="b2bv3-crumbs"[^>]*>[\s\S]*?<\/nav>/g, "") // own breadcrumb
    .replace(/href="https:\/\/b2b-voice\.com\/?"/g, 'href="/"')
    .replace(/href="https:\/\/b2b-voice\.com\/(?!")/g, 'href="/')
    .replace(/<script\b[\s\S]*?<\/script>/g, "");
  if (/<img|<figure/.test(main)) throw new Error("image left in " + htmlFile);

  // the calculators / scorecards are progressive enhancements driven by one inline script
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1].trim());
  return { title, seoTitle, metaDescription, faq, fragment: `<style>${style}</style>\n${main}\n`, script: scripts.join("\n") };
}

const outDir = path.join(appRoot, "src/blog/articles");
mkdirSync(outDir, { recursive: true });

const posts = [];
for (const phase of ["Phase-2", "Phase-3"]) {
  const dir = path.join(src, `B2B-Voice-${phase}`);
  const meta = parseCsv(readFileSync(path.join(dir, "developer", "article-metadata.csv"), "utf8"));
  let manifest = [];
  if (phase === "Phase-3") manifest = parseCsv(readFileSync(path.join(dir, "developer", "article-url-manifest.csv"), "utf8"));
  for (const file of readdirSync(path.join(dir, "articles")).filter((f) => f.endsWith(".html"))) {
    const slug = file.replace(/\.html$/, "");
    const c = convert(path.join(dir, "articles", file));
    const row = meta.find((m) => (m.Slug || m.article_url || "").replace(/^.*\//, "") === slug);
    if (!row) throw new Error("no metadata row for " + slug);
    const order = phase === "Phase-2" ? Number(row["Article ID"]) : 1000 + Number(manifest.find((m) => m.html_filename === file).release_order);
    const category = row["Suggested Category"] || row.article_section;
    const tagText = row["Visible Tags"] || row.tags;
    const tags = tagText.split(phase === "Phase-2" ? "," : "|").map((t) => t.trim()).filter(Boolean);
    const excerpt = (row["Archive Excerpt"] || row.archive_excerpt || "").trim();
    writeFileSync(path.join(outDir, `${slug}.html`), c.fragment);
    if (c.script) writeFileSync(path.join(outDir, `${slug}.js`), c.script + "\n");
    posts.push({
      id: order, slug, title: c.title, seoTitle: c.seoTitle || row["SEO Title"] || row.seo_title, metaDescription: c.metaDescription,
      author: AUTHOR, date: PUBLISHED, category, topic: topicFor(slug), tags, excerpt, coverImage: "", faq: c.faq, hasScript: Boolean(c.script),
    });
  }
}
// The packages number their articles independently (Phase 2 and Phase 3 overlap), so ids are
// assigned here: Phase 2 first (by its own id), then Phase 3 (by release order), after the 11 existing posts.
const FIRST_ID = 12;
posts.sort((a, b) => a.id - b.id);
posts.forEach((p, i) => { p.id = FIRST_ID + i; });
const ids = posts.map((p) => p.id);

const ts = `// GENERATED by scripts/import-blog.mjs from the content team's Phase 2 + Phase 3 packages.
// The article markup lives in src/blog/articles/<slug>.html (loaded on demand, see blogContent.ts);
// only the metadata is bundled with the blog index.
import type { BlogPostMeta } from "./blogPosts";

export const newPostMeta: BlogPostMeta[] = ${JSON.stringify(posts, null, 2)};
`;
writeFileSync(path.join(appRoot, "src/lib/blogNew.ts"), ts);
console.log(`imported ${posts.length} articles (ids ${ids.join(",")}); ${posts.filter((p) => p.hasScript).length} with scripts; FAQ on ${posts.filter((p) => p.faq.length).length}`);

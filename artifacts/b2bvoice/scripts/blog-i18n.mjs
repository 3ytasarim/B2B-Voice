// Translation pipeline for the blog articles (DE / ES).
//
//   node scripts/blog-i18n.mjs extract <workDir>   split every article into a markup skeleton + text segments
//   node scripts/blog-i18n.mjs check   <workDir>   validate translated segments against the source
//   node scripts/blog-i18n.mjs apply   <workDir>   write src/blog/articles/<lang>/<slug>.html + src/lib/blogI18n.ts
//
// The article markup is never sent through the translator: a skeleton keeps every tag, attribute, <style>,
// <script> and <pre> byte for byte, and only "runs" of text (a paragraph, a list item, a table cell, with their
// inline <a>/<strong>/<code> tags) plus a few attributes (aria-label, title, alt, placeholder) are translated.
// `check` makes sure the inline tags and links came back unchanged, so a translation cannot break a page.
//
// Needs a fresh build first (it reads the original posts from dist/server/entry-server.mjs).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const [cmd, workDirArg] = process.argv.slice(2);
if (!cmd || !workDirArg) throw new Error("usage: node scripts/blog-i18n.mjs <extract|check|apply> <workDir>");
const workDir = path.resolve(workDirArg);
const LANGS = ["de", "es"];
const CHUNK = 45; // segments per file given to a translator

const VOID = new Set(["br", "hr", "img", "input", "meta", "link", "col", "source", "wbr", "area", "base", "track", "embed"]);
const INLINE = new Set(["a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr"]);
const RAW = new Set(["style", "script", "pre", "textarea", "svg"]);
const ATTRS = ["aria-label", "title", "alt", "placeholder"];

const TOKEN = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*?)?\/?>|[^<]+|</g;
function tokenize(html) {
  const out = [];
  for (const m of html.matchAll(TOKEN)) {
    const raw = m[0];
    if (raw.startsWith("<!--")) out.push({ t: "comment", raw });
    else if (m[1]) {
      const name = m[1].toLowerCase();
      if (raw.startsWith("</")) out.push({ t: "close", name, raw });
      else out.push({ t: "open", name, raw, void: VOID.has(name) || raw.endsWith("/>") });
    } else out.push({ t: "text", raw });
  }
  return out;
}

const hasLetters = (s) => /\p{L}/u.test(s.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " "));

/** Splits markup into a skeleton (with {{S1}} / {{A1}} placeholders) and the translatable segments. */
function segment(html) {
  const tokens = tokenize(html);
  const segs = {};
  let n = 0, an = 0;
  let skel = "";
  let run = [];
  const flush = () => {
    if (!run.length) return;
    const joined = run.join("");
    if (hasLetters(joined)) {
      const lead = joined.match(/^\s*/)[0];
      const trail = joined.match(/\s*$/)[0];
      const core = joined.slice(lead.length, joined.length - trail.length);
      const id = `S${++n}`;
      segs[id] = core;
      skel += `${lead}{{${id}}}${trail}`;
    } else skel += joined;
    run = [];
  };
  let rawTag = null;
  for (const tk of tokens) {
    if (rawTag) {
      skel += tk.raw;
      if (tk.t === "close" && tk.name === rawTag) rawTag = null;
      continue;
    }
    if (tk.t === "open" && RAW.has(tk.name) && !tk.void) {
      flush();
      skel += tk.raw;
      rawTag = tk.name;
      continue;
    }
    if (tk.t === "text") { run.push(tk.raw); continue; }
    if ((tk.t === "open" || tk.t === "close") && INLINE.has(tk.name)) {
      // attributes of inline tags stay as they are (href, class...) except visible ones
      run.push(tk.t === "open" ? replaceAttrs(tk.raw, segs, () => `A${++an}`) : tk.raw);
      continue;
    }
    if (tk.t === "comment") { flush(); skel += tk.raw; continue; }
    flush();
    skel += tk.t === "open" ? replaceAttrs(tk.raw, segs, () => `A${++an}`) : tk.raw;
  }
  flush();
  return { skel, segs };
}

function replaceAttrs(tag, segs, nextId) {
  return tag.replace(/\s(aria-label|title|alt|placeholder)="([^"]*)"/g, (m, name, value) => {
    if (!hasLetters(value)) return m;
    const id = nextId();
    segs[id] = value;
    return ` ${name}="{{${id}}}"`;
  });
}

/** Multiset of the opening/closing tags in a run: a translation must keep every inline tag and link. */
function tagBag(s) {
  const bag = new Map();
  for (const m of s.matchAll(/<\/?[a-zA-Z][^>]*>/g)) bag.set(m[0], (bag.get(m[0]) ?? 0) + 1);
  return bag;
}
const sameBag = (a, b) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);

/** A calculator script may only differ in its string literals (messages, locale argument). */
const codeSkeleton = (code) => code.replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '""');

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}
const chunkName = (slug, i) => `${slug}.c${String(i + 1).padStart(2, "0")}`;

async function loadPosts() {
  const { getPosts } = await import(pathToFileURL(path.join(appRoot, "dist/server/entry-server.mjs")).href);
  return getPosts();
}

function sourceHtml(post) {
  if (post.content) return post.content;
  return readFileSync(path.join(appRoot, "src/blog/articles", `${post.slug}.html`), "utf8");
}

function metaStrings(post) {
  const m = { title: post.title, excerpt: post.excerpt };
  if (post.seoTitle) m.seoTitle = post.seoTitle;
  if (post.metaDescription) m.metaDescription = post.metaDescription;
  post.tags.forEach((t, i) => (m[`tag${i}`] = t));
  (post.faq ?? []).forEach((f, i) => { m[`faq${i}q`] = f.q; m[`faq${i}a`] = f.a; });
  return m;
}

if (cmd === "extract") {
  const posts = await loadPosts();
  mkdirSync(path.join(workDir, "in"), { recursive: true });
  mkdirSync(path.join(workDir, "out"), { recursive: true });
  const index = [];
  let total = 0;
  for (const post of posts) {
    const { skel, segs } = segment(sourceHtml(post));
    writeFileSync(path.join(workDir, "in", `${post.slug}.skel.html`), skel);
    const ids = Object.keys(segs);
    const chunks = [];
    for (let i = 0; i < ids.length; i += CHUNK) chunks.push(Object.fromEntries(ids.slice(i, i + CHUNK).map((id) => [id, segs[id]])));
    chunks.forEach((c, i) => writeFileSync(path.join(workDir, "in", `${chunkName(post.slug, i)}.json`), JSON.stringify(c, null, 1)));
    writeFileSync(path.join(workDir, "in", `${post.slug}.meta.json`), JSON.stringify(metaStrings(post), null, 1));
    const words = Object.values(segs).join(" ").replace(/<[^>]+>/g, "").split(/\s+/).length;
    total += words;
    index.push({ slug: post.slug, chunks: chunks.length, segments: ids.length, words });
  }
  writeFileSync(path.join(workDir, "index.json"), JSON.stringify(index, null, 1));
  console.log(`extracted ${posts.length} articles, ${index.reduce((a, x) => a + x.segments, 0)} segments, ~${total} words`);
}

if (cmd === "check" || cmd === "apply") {
  // ONLY=slug1,slug2 restricts the check (while translations are still coming in); `apply` always needs all.
  const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
  const index = readJson(path.join(workDir, "index.json")).filter((x) => !only || only.has(x.slug));
  if (cmd === "apply" && only) throw new Error("apply needs every article: unset ONLY");
  const problems = [];
  const translations = { de: {}, es: {} };
  for (const { slug, chunks } of index) {
    for (const lang of LANGS) {
      const merged = {};
      let missing = false;
      for (let i = 0; i < chunks; i++) {
        const src = readJson(path.join(workDir, "in", `${chunkName(slug, i)}.json`));
        const file = path.join(workDir, "out", `${chunkName(slug, i)}.${lang}.json`);
        if (!existsSync(file)) { problems.push(`${slug} ${lang}: missing ${path.basename(file)}`); missing = true; continue; }
        let out;
        try { out = readJson(file); } catch (e) { problems.push(`${slug} ${lang} c${i + 1}: invalid JSON (${e.message.slice(0, 60)})`); missing = true; continue; }
        for (const [id, text] of Object.entries(src)) {
          const t = out[id];
          if (typeof t !== "string" || !t.trim()) { problems.push(`${slug} ${lang} ${id}: missing translation`); missing = true; continue; }
          if (id.startsWith("S") && !sameBag(tagBag(text), tagBag(t))) problems.push(`${slug} ${lang} ${id}: inline tags/links changed\n   EN ${text.slice(0, 120)}\n   ${lang.toUpperCase()} ${t.slice(0, 120)}`);
          if (id.startsWith("A") && /["<>]/.test(t)) problems.push(`${slug} ${lang} ${id}: bad characters in attribute text`);
          if (/[Ѐ-ӿ؀-ۿ぀-ヿ一-鿿]/.test(t)) problems.push(`${slug} ${lang} ${id}: characters from a foreign script`);
          if (/\{\{[SA]\d+\}\}/.test(t)) problems.push(`${slug} ${lang} ${id}: placeholder left in translation`);
          merged[id] = t;
        }
      }
      // meta
      const metaSrc = readJson(path.join(workDir, "in", `${slug}.meta.json`));
      const metaFile = path.join(workDir, "out", `${slug}.meta.${lang}.json`);
      let metaOut = {};
      if (!existsSync(metaFile)) { problems.push(`${slug} ${lang}: missing meta file`); missing = true; }
      else {
        try { metaOut = readJson(metaFile); } catch { problems.push(`${slug} ${lang}: invalid meta JSON`); missing = true; }
        for (const k of Object.keys(metaSrc)) if (typeof metaOut[k] !== "string" || !metaOut[k].trim()) { problems.push(`${slug} ${lang} meta.${k}: missing`); missing = true; }
      }
      if (!missing) translations[lang][slug] = { segs: merged, meta: metaOut };
    }
  }
  if (problems.length) {
    console.log(problems.join("\n"));
    console.log(`\n${problems.length} problem(s)`);
    if (cmd === "apply") process.exit(1);
  } else console.log("check: all translations complete and consistent");

  if (cmd === "apply") {
    const posts = await loadPosts();
    const bySlug = new Map(posts.map((p) => [p.slug, p]));
    const slugs = new Set(posts.map((p) => p.slug));
    const i18n = { de: {}, es: {} };
    for (const lang of LANGS) {
      mkdirSync(path.join(appRoot, "src/blog/articles", lang), { recursive: true });
      for (const { slug } of index) {
        const post = bySlug.get(slug);
        const { segs, meta } = translations[lang][slug];
        let html = readFileSync(path.join(workDir, "in", `${slug}.skel.html`), "utf8");
        html = html.replace(/\{\{([SA]\d+)\}\}/g, (_m, id) => (id.startsWith("A") ? segs[id].replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;") : segs[id]));
        // internal links stay inside the language: /how-to-x -> /de/how-to-x, /blog -> /de/blog
        html = html.replace(/href="(\/[^"#?]*)([^"]*)"/g, (m, p, rest) => {
          const clean = p.replace(/\/$/, "");
          if (clean === "/blog" || slugs.has(clean.slice(1))) return `href="/${lang}${clean}${rest}"`;
          return m;
        });
        // the <html> text of a calculator script is not touched; only the document language of the article changes
        writeFileSync(path.join(appRoot, "src/blog/articles", lang, `${slug}.html`), html);
        // scripts: copy unchanged (their on-screen messages are translated by `blog-scripts` below if present)
        const scriptFile = path.join(appRoot, "src/blog/articles", `${slug}.js`);
        const translatedScript = path.join(workDir, "out", `${slug}.script.${lang}.js`);
        if (existsSync(translatedScript) && existsSync(scriptFile) && codeSkeleton(readFileSync(translatedScript, "utf8")) !== codeSkeleton(readFileSync(scriptFile, "utf8"))) {
          throw new Error(`${slug}: the ${lang} script differs from the original beyond its string literals`);
        }
        if (existsSync(translatedScript)) writeFileSync(path.join(appRoot, "src/blog/articles", lang, `${slug}.js`), readFileSync(translatedScript, "utf8"));
        else if (existsSync(scriptFile)) throw new Error(`${slug}: has a calculator script but no translated script for ${lang}`);
        const tr = { title: meta.title, excerpt: meta.excerpt, tags: post.tags.map((_t, i) => meta[`tag${i}`]) };
        if (meta.seoTitle) tr.seoTitle = meta.seoTitle;
        if (meta.metaDescription) tr.metaDescription = meta.metaDescription;
        if (post.faq?.length) tr.faq = post.faq.map((_f, i) => ({ q: meta[`faq${i}q`], a: meta[`faq${i}a`] }));
        i18n[lang][slug] = tr;
      }
    }
    const ts = `// GENERATED by scripts/blog-i18n.mjs: German and Spanish metadata of every blog post.
// The translated article markup lives in src/blog/articles/<lang>/<slug>.html (loaded on demand).
export interface PostTranslation {
  title: string;
  excerpt: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  faq?: { q: string; a: string }[];
}

export const blogTranslations: Record<"de" | "es", Record<string, PostTranslation>> = ${JSON.stringify(i18n, null, 2)};
`;
    writeFileSync(path.join(appRoot, "src/lib/blogI18n.ts"), ts);
    console.log(`applied ${index.length} articles x ${LANGS.length} languages`);
  }
}

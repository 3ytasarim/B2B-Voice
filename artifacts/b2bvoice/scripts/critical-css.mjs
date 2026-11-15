// Critical CSS extraction for the prerendered pages (no extra dependencies:
// postcss is resolved from vite's own install).
//
// The full stylesheet (~200 KB, ~30 KB gzip) used to block first paint. For
// each page we now inline only the rules the above-the-fold markup can match
// (header + first sections), and load the FULL stylesheet without blocking.
// The full sheet is not split: after it loads, the cascade is exactly the
// original one (the inlined rules are just earlier duplicates), so there is no
// ordering risk. Before it loads, everything the first screen needs is there.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const viteRequire = createRequire(require.resolve("vite/package.json", { paths: [process.cwd()] }));
const postcss = viteRequire("postcss");

// Pseudo-classes that only apply after user interaction / state changes.
const DYNAMIC = /:(hover|focus|focus-visible|focus-within|active|visited|disabled|checked|target|placeholder-shown|group-hover|peer-[a-z-]+)\b|::(placeholder|selection|file-selector-button|backdrop)|\[data-(state|open|closed|active|highlighted|disabled|side|orientation|selected|panel)/;

// Class names in CSS are escaped (`.md\:flex`, `.w-\[42rem\]`, `.\32 xl\:p-4`). Encode
// every non-identifier character as `_xHH_` on both sides (CSS and HTML), so the
// matching below never has to reason about escapes.
const enc = (s) => s.replace(/[^A-Za-z0-9_-]/g, (c) => `_x${c.charCodeAt(0).toString(16)}_`);
const decodeEntities = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
function encodeCssEscapes(sel) {
  return sel
    .replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => enc(String.fromCodePoint(parseInt(hex, 16))))
    .replace(/\\(.)/g, (_, ch) => enc(ch));
}
function splitSelectors(sel) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of sel) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Tokens (classes / ids / tags) present in an HTML fragment. */
export function tokensOf(html) {
  const classes = new Set();
  const ids = new Set();
  const tags = new Set();
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g)) {
    tags.add(m[1].toLowerCase());
    const attrs = m[2];
    const c = attrs.match(/\sclass="([^"]*)"/);
    if (c) for (const k of decodeEntities(c[1]).split(/\s+/)) if (k) classes.add(enc(k));
    const i = attrs.match(/\sid="([^"]*)"/);
    if (i) ids.add(enc(decodeEntities(i[1])));
  }
  return { classes, ids, tags };
}

/** `sel` has already been through encodeCssEscapes(). */
function selectorMatches(sel, tok) {
  if (DYNAMIC.test(sel)) return false;
  // Ignore anything inside :not()/:is()/:where()/:has() - requiring those would be wrong
  // (:not) or needlessly strict (:is/:where), and a superset of rules is harmless.
  let s = sel;
  for (let i = 0; i < 4; i++) s = s.replace(/:(not|is|where|has)\((?:[^()]|\([^()]*\))*\)/g, "");
  s = s.replace(/\[[^\]]*\]/g, ""); // attribute selectors
  s = s.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, ""); // remaining pseudos (:before, :first-child, ...)
  for (const m of s.matchAll(/\.([A-Za-z0-9_-]+)/g)) if (!tok.classes.has(m[1])) return false;
  for (const m of s.matchAll(/#([A-Za-z0-9_-]+)/g)) if (!tok.ids.has(m[1])) return false;
  // type selectors: a name at the start or after a combinator
  const stripped = s.replace(/[.#][A-Za-z0-9_-]+/g, "");
  for (const m of stripped.matchAll(/(?:^|[\s>+~])([a-zA-Z][a-zA-Z0-9-]*)/g)) {
    const t = m[1].toLowerCase();
    if (t !== "html" && t !== "body" && !tok.tags.has(t)) return false;
  }
  return true;
}

function keep(node, tok, usedAnimations) {
  if (node.type === "rule") {
    if (!splitSelectors(encodeCssEscapes(node.selector)).some((s) => selectorMatches(s, tok))) return false;
    node.walkDecls(/^animation(-name)?$/, (d) => {
      for (const m of d.value.matchAll(/(?:^|\s|,)([a-zA-Z_][\w-]*)(?=\s|,|$)/g)) usedAnimations.add(m[1]);
    });
    return true;
  }
  if (node.type === "atrule") {
    if (/^(media|supports|container|layer)$/i.test(node.name) && node.nodes) {
      for (const child of [...node.nodes]) if (!keep(child, tok, usedAnimations)) child.remove();
      return node.nodes.length > 0;
    }
  }
  return true;
}

/**
 * @param {string} css  the full built stylesheet
 * @param {string} fragmentHtml  markup of the above-the-fold part of a page
 * @param {string[]} extraClasses  classes only present after hydration (client-rendered)
 */
export function criticalCss(css, fragmentHtml, extraClasses = []) {
  const tok = tokensOf(fragmentHtml);
  for (const c of extraClasses) tok.classes.add(enc(c));
  const root = postcss.parse(css);
  const usedAnimations = new Set();

  for (const node of [...root.nodes]) {
    const name = node.type === "atrule" ? node.name.toLowerCase() : "";
    // Always keep: layer order statement, @property, @font-face (tiny, order-sensitive).
    if (node.type === "atrule" && (name === "property" || name === "font-face")) continue;
    if (node.type === "atrule" && name === "layer") {
      if (!node.nodes) continue; // `@layer a, b, c;`
      // Layers that define variables / resets are kept whole; the rest is filtered.
      if (/^(properties|theme|base)$/.test(node.params)) {
        node.walkDecls(/^animation(-name)?$/, (d) => {
          for (const m of d.value.matchAll(/([a-zA-Z_][\w-]*)/g)) usedAnimations.add(m[1]);
        });
        continue;
      }
    }
    if (node.type === "atrule" && name === "keyframes") continue; // decided below
    if (!keep(node, tok, usedAnimations)) node.remove();
  }
  for (const node of [...root.nodes]) {
    if (node.type === "atrule" && /keyframes$/i.test(node.name) && !usedAnimations.has(node.params)) node.remove();
  }
  return root.toString();
}

export function loadCss(file) {
  return readFileSync(file, "utf8");
}

# B2BVoice – SEO / GEO checklist

Source: "Nihai SEO, AI Search ve Crawler Teknik Revizyon Listesi" (22 items).
Branch: `seo/ssg-overhaul`. Status legend: done / code-ready (needs deploy) / open.

| # | Item | Status |
|---|------|--------|
| 1 | Backup, URL inventory, staging | code-ready (`deploy/staging.sh`, `deploy/rollback.sh`) |
| 2 | SSG: real HTML in first response | code-ready (`scripts/prerender.mjs`) |
| 3 | One blog content source, out of main bundle | done (`src/lib/blogPosts.ts`, lazy chunk) |
| 4 | One `<main>`, one `<article>`, one `<h1>`, `<time>` | done |
| 5 | Per-page metadata + canonical + OG | done (`src/seo/pageMeta.ts`); OG image still shared |
| 6 | Domain / HTTPS redirects, trailing slash | code-ready (`deploy/nginx`) |
| 7 | Real 404 | code-ready (`404.html` + nginx) |
| 8 | Real `sitemap.xml` | code-ready (generated at build) |
| 9 | `robots.txt` with AI bots + Sitemap | done |
| 10 | Crawler access (CDN/firewall) | open – verify after deploy (`deploy/verify.sh`) |
| 11 | Schema in first HTML | done (`src/seo/jsonLd.ts`); FAQPage intentionally omitted |
| 12 | Image semantics | done – see rules below |
| 13 | Image performance (srcset, AVIF) | open |
| 14 | Internal linking | partial – no service/sector pages yet |
| 15 | Keep URL structure | done |
| 16 | Compression, cache, code splitting | partial – main bundle still large |
| 17 | Mobile/a11y (viewport zoom fixed) | partial – labels/targets/contrast audit open |
| 18 | noindex/broken-link audit | partial – admin noindex done, crawl open |
| 19 | Search Console / Bing | owner action after deploy |
| 20 | Backlinks | not development work |
| 21 | RSS, `llms.txt` | done (`blog/rss.xml`, `llms.txt`) |
| 22 | Final acceptance tests | `deploy/verify.sh` |

## Image rules (item 12)

- **Informative image** → short, specific `alt` (what it shows, not a keyword list).
- **Decorative image** → `alt=""`. Applies to sector photos, orbit integration
  icons and AI-assistant button icons, whose meaning is already given by adjacent
  visible text or an `aria-label`.
- **Repeated marquee copies** → the wrapper is `aria-hidden` and `alt=""`; only the
  first copy of each logo is exposed (`<Name> logo`).
- **Inline SVG** (icons, waveforms, progress ring) → `aria-hidden="true" focusable="false"`.
- **Image that carries text or data** (infographic) → short `alt` **plus** visible
  text: a `<figcaption>`, or for long ones a `<details><summary>` transcript inside
  the `<figcaption>`. Never copy image text into a hidden `<div>` for crawlers.
- Content images are real `<img>`/`<picture>`, never CSS `background-image`.
- Always set `width`/`height`; only the LCP image may be `eager`/`fetchpriority="high"`.

Audit result (home page, prerendered HTML): every `<img>` has an `alt`; no site
image contains text that would need a transcript; blog articles contain no images.

Known limitation: logos in the "trusted by" strip are rendered from a built-in
fallback list at prerender time and replaced by the database entries in the
browser. Their alt text is `<company name> logo`, so keep company names in the
admin panel descriptive.

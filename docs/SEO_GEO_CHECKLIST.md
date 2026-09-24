# B2BVoice – SEO / GEO checklist

Source: "Nihai SEO, AI Search ve Crawler Teknik Revizyon Listesi" (22 items).
Branch: `seo/ssg-overhaul`. Status legend: done / code-ready (needs deploy) / open.

| # | Item | Status |
|---|------|--------|
| 1 | Backup, URL inventory, staging | code-ready (`deploy/staging.sh`, `deploy/rollback.sh`) |
| 2 | SSG: real HTML in first response | code-ready (`scripts/prerender.mjs`) |
| 3 | One blog content source, out of main bundle | done (`src/lib/blogPosts.ts`, lazy chunk) |
| 4 | One `<main>`, one `<article>`, one `<h1>`, `<time>` | done |
| 5 | Per-page metadata + canonical + OG | done (`src/seo/pageMeta.ts`); per-page OG cards generated at build |
| 6 | Domain / HTTPS redirects, trailing slash | code-ready (`deploy/nginx`) |
| 7 | Real 404 | code-ready (`404.html` + nginx) |
| 8 | Real `sitemap.xml` | code-ready (generated at build) |
| 9 | `robots.txt` with AI bots + Sitemap | done |
| 10 | Crawler access (CDN/firewall) | open – verify after deploy (`deploy/verify.sh`) |
| 11 | Schema in first HTML | done (`src/seo/jsonLd.ts`); FAQPage intentionally omitted |
| 12 | Image semantics | done – see rules below |
| 13 | Image performance (srcset, AVIF, per-page OG) | done for local images; sector/agent photos live on the CDN bucket (open) |
| 14 | Internal linking | done except service/sector pages (content decision pending); `check:links` audits broken links + orphans |
| 15 | Keep URL structure | done |
| 16 | Compression, cache, code splitting | done in code (entry JS 418 -> 152 KB gzip, self-hosted fonts); Brotli needs the nginx module |
| 17 | Mobile/a11y | done – axe-core clean on blog, article, demo, legal pages; see section below |
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

## Image performance (item 13)

- `scripts/optimize-images.mjs` writes AVIF + WebP variants (and `src/lib/imageManifest.json`) for `public/integrations`, `ask-ai`, `partners`, `clients`. Re-run it after adding images there.
- `<ResponsiveImage>` (`src/components/ui/responsive-image.tsx`) renders `<picture>` (AVIF, WebP fallback) with `srcset`/`sizes` and intrinsic `width`/`height`; anything not in the manifest (CDN URLs, data URIs) stays a plain `<img>`.
- Result: the 12 orbit icons went from about 700 KB of 1024px PNGs to about 60 KB of 64px AVIFs on a 2x phone; logos/partners similarly.
- Nothing on the home page is preloaded or `fetchpriority=high`: the LCP element is text (the H1), not an image. Below-the-fold images are `loading="lazy"`.
- `scripts/prerender.mjs` generates a 1200x630 social card per page into `dist/public/og/` (title on the brand background) and writes `og:image:width/height/alt`. Falls back to `opengraph.jpg` if sharp fails.
- Still open: sector and agent photos are served from the object-storage CDN (no variants). Re-encode them into the bucket to get srcset/AVIF there too.

## Internal linking (item 14)

- Demo CTAs (navbar, hero, pricing, two final CTAs) are real `<a href="/demo">` instead of `onClick` buttons, so crawlers can follow them.
- Footer now links every public page: Privacy, Terms, Cookies, Blog and Legal Notice (which was previously an orphan).
- Blog list "Continue Reading" links carry the article title as screen-reader text; every article ends with Related Articles (4), a demo CTA and a link back to the home page; articles without their own breadcrumb get a visible one.
- `pnpm --filter @workspace/b2bvoice run check:links` scans `dist/public` for broken internal links/assets, non-canonical links (trailing slash, `.html`) and sitemap orphans. Run after `pnpm build`.
- Article bodies are intentionally untouched (they are embedded byte-for-byte), so contextual in-text links to other articles are not injected.

## JavaScript, CSS, fonts, caching (item 16)

- **Entry bundle:** 1,460 KB -> 492 KB (gzip 418 -> 152 KB). The 3D footer robot (three.js + react-three-fiber, ~970 KB) is a separate chunk loaded by `LazyFooterRobot` only when the footer is within 800 px of the viewport, never on phones. Blog articles, admin, demo and legal pages are route-level chunks.
- **Fonts:** Bricolage Grotesque and Inter are self-hosted (`public/fonts`, `src/fonts.css`, generated by `scripts/fetch-fonts.mjs`) - no Google CSS request, no extra origins; the heading font is preloaded.
- **Third-party scripts:** the ElevenLabs widget and Umami recorder load after the `load` event when the browser is idle. GTM and Umami `script.js` are unchanged.
- **nginx (`deploy/nginx/b2b-voice-locations.conf`):** hashed `/assets/` immutable for 1 year; fonts/images/audio 30 days; HTML `no-cache`; gzip for text formats. Brotli: check `nginx -V 2>&1 | grep -c brotli`; if 0, `apt install libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static` and uncomment the block at the bottom of the locations file.
- **Core Web Vitals:** not measurable in this environment; run PageSpeed Insights on staging/production after deploy.

## Mobile usability and accessibility (item 17)

Audited with axe-core (mobile 390 px and desktop 1280 px) plus manual checks.

- **No horizontal overflow** at 390 px on any page; zoom is allowed (viewport `maximum-scale` removed).
- **Forms (demo, admin login):** every field has a `<label htmlFor>` (or `aria-label`), `id`/`name`, correct `autocomplete`; errors use `role="alert"`; selectable options expose `aria-pressed`; the password toggle has an accessible name.
- **Icon-only buttons** now have names: language menu (`Language: English`, `aria-expanded`), 12 voice-sample play buttons (`Play Alex voice sample`, `aria-pressed`).
- **Landmarks and headings:** every page has one `<main id="main-content">`; blog posts use `<header>`/`<footer>` around the chrome; heading order fixed (demo steps and hero card are `h2`). A "Skip to main content" link is the first tab stop.
- **Keyboard:** global `:focus-visible` ring; scrollable regions (industries carousel, article tables) are focusable.
- **Contrast:** `text-gray-400`/`gray-300`/small green/amber labels raised to at least 4.5:1 (mostly `gray-500`).
- **Touch targets:** nav buttons 44 px; back links, blog category links and "Continue Reading" enlarged without moving the layout (padding + negative margin); voice play button has an 8 px invisible hit area.
- **Known leftovers:** language-chip buttons in the multilingual demo widget are 28 px tall (above WCAG 2.2 AA 24 px, below the 44-48 px goal); a few decorative mock-UI labels use 8-9 px type; the ElevenLabs widget is third-party and outside our landmarks; `axe` still reports a few transient contrast hits on the animated mock dashboard.

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
| 11 | Schema in first HTML | done and verified with Google Rich Results Test (0 warnings) - see below |
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

## Verification against the PDF checklist (this session)

Ran actual tests, not just code review, against the local prerendered build (`dist/public`):

- **Section F (per-page checks):** single H1 on all 20 pages; unique `<title>`/description across all 18 indexable pages (verified programmatically, no duplicates); canonical is self-referencing on every page; schema present in raw HTML (curl, no JS) on every page; every `<img>` has `alt` (107 on the home page, 0 missing); no unwanted `noindex` (only 404/admin have it); `check:links` finds 0 broken links / 0 orphans across 20 pages and 18 sitemap URLs.
- **JavaScript disabled:** loaded `/`, `/blog`, an article and `/demo` with JS turned off in a real browser - H1, real body text (6.7-14 KB) and internal links are all present; React never mounts.
- **No cloaking:** compared responses for `Mozilla/5.0`, `OAI-SearchBot`, `Claude-SearchBot`, `ClaudeBot`, `Googlebot`, `Google-Extended`, `GPTBot` on 4 pages - byte-for-byte identical every time (diff confirms it). Nothing in the build or the static server branches on user-agent.
- **Google Rich Results Test (official tool, not a local validator):** pasted the built `what-is-b2b-voice.html` into search.google.com/test/rich-results. First run: 3 valid items (Article, Breadcrumbs, Organization), 4 non-critical warnings (`datePublished`/`dateModified` missing a timezone). Fixed by emitting full ISO 8601 datetimes (`toIsoDateTime()` in `src/seo/jsonLd.ts`) instead of bare dates. Re-tested: **3/3 valid items, 0 warnings, 0 errors.**
- **Known, accepted deviation:** 2 of the 11 articles (`ai-voice-agent-turn-taking-interruptions`, `rag-vs-tool-calling-vs-prompt-context`) have their `<h1>` as a sibling of `<article>` inside `<main>` rather than nested in `<article><header>`, because their source HTML (kept byte-for-byte per an explicit instruction not to alter injected article markup) was authored with a `<main class="wrap">` structure. Counts are still exactly one `<main>`/`<article>`/`<h1>` and heading order is unaffected; flagged here rather than silently claimed as fully matching the PDFs example.
- **Not verifiable in this environment:** Lighthouse/PageSpeed Core Web Vitals (headless Chromium in this VM cannot complete an LCP/TBT trace - FCP and CLS computed fine, LCP/TBT came back null on both mobile and desktop presets); must be measured on staging or production after deploy.

## ElevenLabs widget scope + mobile size (post-launch tweak)

The voice widget now only loads on the home page (`location.pathname === "/"` check in `index.html`, since every prerendered page shares the same HTML shell) - it looked out of place on `/demo`, which already has its own CTA flow. On screens <=640px it is scaled to 0.62x (`transform: scale(0.62)`, anchored bottom-right) so it no longer dominates the viewport; above that width it renders at full size. Verified in the browser at 375px (widget clearly smaller, page content no longer covered) and 1280px (unscaled, unchanged).

## Footer overlap fix (post-launch bug report)

User reported the footer text all overlapping on their phone. Root cause: the Legal+Contact block used a JS-measured translateX nudge (to line the phone number up under the "Design by" credit) that only activated at the sm breakpoint (640px) and up, while the two-column grid it nudges also only split there - but at tablet widths (640-1023px) the nowrap link/contact text barely fit its narrow column, and the nudge computed a sharply negative delta, dragging the whole Legal+Contact block left on top of the logo/tagline column. Likely present before, just newly visible once "Legal Notice" was added to the links list and someone hit that width range.

Fix in src/pages/home.tsx Footer component:
- Two-column grid (and the matching margin/robot) now only activate at the lg breakpoint (1024px) - below that the footer stacks in one column (Legal + Contact still sit side by side within it, same as always worked on phones).
- Added a safety clamp to the alignment effect: it now reads the logo/tagline column's right edge and never lets the nudge push the Legal+Contact block closer than 32px to it, regardless of width or future link-list length. Verified empirically (not just read) at 700/1024/1280px: no overlap at any width, and the original phone/credit pixel alignment is unchanged at 1280px+ (the clamp never triggers there).

## PageSpeed (mobile) + SEO-tool findings batch

Source: PageSpeed Insights mobile run for b2b-voice.com (FCP 2.4 s, LCP 8.4 s, TBT 1,700 ms, Speed Index 11.3 s) plus generic SEO-tool findings. Root causes and fixes:

- **LCP / render delay:** hero text was server-rendered at `opacity: 0` (framer-motion `initial`) and only revealed after hydration, so the LCP element was the nav logo, delayed by third-party traffic. The hero entrance is now CSS (`.hero-enter-*` in `index.css`, `animation-fill-mode: backwards`), so server HTML is visible immediately; the CSS loops (`soft-pulse`, `card-shake`) replace three framer-motion infinite animations. Logo: `fetchPriority="high"`, `decoding="async"`, intrinsic width/height and a 168/336/420 px `srcset` (`logo-clean-*.webp`) instead of one oversized file.
- **Third-party contention:** GTM (and the GA4/Meta tags inside it), the Umami recorder and the ElevenLabs widget no longer load in `<head>`. A small scheduler in `index.html` loads the widget (home only) when idle after `load`, GTM on first interaction or 4 s after load, the recorder on first interaction or 10 s after load. Analytics timing therefore shifts slightly; visitors who bounce within ~4 s without interacting are not counted by GTM tags.
- **Main-thread cost:** `content-visibility: auto` + `contain-intrinsic-size` on below-the-fold sections (`main#main-content > :nth-child(n+3)`); blurred hero blob animations only on >=1024 px with motion allowed; the WebGL `MeshGradient` is lazy-loaded and used only on >=1024 px with WebGL and no reduced-motion (phones get a static gradient, and its chunk never downloads).
- **Images:** marquee/partner logos have explicit width/height (no CLS), descriptive alt text on marquee logos, sector photos, "ask AI" icons and orbit icons.
- **Tap targets:** "Go to sector N" dots are decorative on phones (`pointer-events-none` below `sm`) and get a 8 px invisible hit area on larger screens.
- **HTML hygiene:** duplicate `id="demo"` removed (FinalCTA is now `id="get-demo"`; `#demo` links still target the demo form); inline scheduler script is minified and HTML/CSS comments stripped from the shell in `scripts/prerender.mjs`.
- **Measured locally** (headless Edge, 4x CPU throttle, relative numbers only): load/hydration event ~35 s -> ~8 s; FCP unchanged (~2.5 s); H1 visible at first paint instead of after hydration. Real PSI must be re-run after deploy.
- **Not fixable on our side:** cache TTL and legacy JS inside Facebook pixel / GTM / Umami recorder / ElevenLabs widget bundles; AMP (obsolete); "external links" advice (articles are kept byte-for-byte). Flag for the owner: GA4 is loaded twice (GTM container and `useGoogleTracking`) and a Meta pixel lives inside the GTM container.

## Performance sprint 2 (branch perf/mobile-sprint-2)

Starting point: production at 2194b30, mobile PSI 60. Lighthouse flagged ~642 KiB unused JS (ElevenLabs 321, GTM/GA4 139, Meta 123, first-party 59), render-blocking app CSS (~30 KiB), a font chain to inter-latin.woff2 and forced reflow from the ElevenLabs widget.

**Findings from the real script graph**
- GA4 comes only from `useGoogleTracking` (gtag.js, G-2J4S6PFFR4, read from `/api/tracking`). The published GTM container (GTM-TWK7KMW9) contains a single Custom HTML tag, the Meta pixel 4652135665107478 - no GA4 tag and no pixel in app code, so there is no duplicate GA4 or Meta setup. The earlier "possible duplicate GA4" warning was wrong.
- Real duplicate found while testing: when gtag.js and GTM start at the same moment, GTM fetches a second copy of the same Google tag (`gtag/js?id=G-...&cx=c&gtm=...`, +177 KB). Fixed by starting GTM only after gtag.js has loaded (index.html `__b2bvGtagSettled`, 3.5 s safety timeout).
- No cookie banner / Consent Mode exists in the repo (only the cookie-policy page), so there was nothing to preserve or change there.
- Inter is not used above the fold (Bricolage Grotesque is the hero font and is already preloaded); the early Inter request came from the ElevenLabs widget's shadow DOM. No Inter preload was added.
- robot-hero (three.js, ~266 KB gzip) and the WebGL mesh gradient were already lazy and desktop-only; verified with network logs that neither is requested on a phone, even after scrolling the whole page.

**Changes**
1. **ElevenLabs widget:** the embed (~470 KB) is no longer downloaded on load, idle or by timer. A lightweight, accessible trigger button (same look as the widget's collapsed pill, 53 px tall tap target, focus ring, `aria-busy` while loading, "Try again" on failure) is shown on `/` only. The embed starts downloading on first hover/focus/touch of the trigger and the widget is mounted expanded (`default-expanded`) on click - at most once (state + `customElements.get` guard). The mobile `zoom: .62` fix is kept. Home-only visibility also follows SPA navigation.
2. **gtag.js + GTM:** both wait for the first interaction or 4 s after load; GTM waits for gtag.js (see above). Recorder: first interaction or 10 s.
3. **Critical CSS:** `scripts/critical-css.mjs` (postcss from vite's install, no new dependency) inlines only the rules the header + first two sections can match (~6-10 KB gzip) and loads the FULL stylesheet non-blocking (`preload` + onload swap, `noscript` fallback). The full sheet is not split, so the final cascade is identical to before. Below-the-fold markup is `visibility:hidden` until the sheet is ready (class `css-ready`, also set on error) so nothing flashes unstyled. Admin shell keeps the blocking stylesheet. Verified: critical-only vs full viewport screenshots on 5 pages x mobile/desktop differ only by animation frames.
4. **Framer Motion:** `m` + `<LazyMotion>` with the features in an async chunk (`motionFeatures`/`layout`, 27 KB gzip) instead of the full `motion` bundle in the entry; vendor-motion chunk removed from manualChunks. Entry JS 189 KB -> 161 KB gzip.
5. **Forced reflow / re-renders:** navbar "scrolled" state and the scroll-to-top button use an IntersectionObserver sentinel and a rAF-throttled, cached-height progress hook (`src/hooks/use-scroll-state.ts`) instead of per-scroll-event `scrollY`/`scrollHeight` reads and state updates; the sector gallery reads `offsetLeft` once per frame and only autoplays while on screen; the orbit/waveform rAF loops pause while off screen. Third-party internals were not touched.

**Behaviour changes to be aware of**
- Widget needs one click/tap on the trigger, then the widget opens expanded (a second click on "Start a call" begins the call).
- gtag.js (GA4) now starts on first interaction or 4 s after load instead of right after hydration; visitors who leave before that are not counted (same trade-off already made for GTM in the previous sprint).

## Performance sprint 3 (branch perf/mobile-sprint-3)

Starting point: production at dce04b7, mobile PSI 87, LCP 3.1 s, FCP 2.4 s, TBT 110 ms. LCP element: the hero paragraph (`p.text-xl`), "element render delay" ~3.2 s.

**Root cause of the late LCP (measured, not assumed).** Resources were all in by ~90 ms locally, yet the first paint contained only the logo image and the hero text only appeared ~500-700 ms later. Frame captures showed the hero column at opacity 0: the left column (H1 + paragraph + CTAs) used the `hero-enter-left` entrance animation that faded from `opacity: 0`, and Chrome does not count text that is still fading in. It was independent of JS and fonts (same result with JS blocked and with fonts blocked). Fix: that animation is now transform-only (`translateX(-16px)`, 0.6 s) - the text is painted at first paint and the paragraph becomes the LCP candidate at FCP. The right-hand call card and the e-mail link keep their fade (their text is not the LCP candidate).

**Other checks (no change needed)**
- Hero font: Bricolage Grotesque `latin` is preloaded (`crossorigin`), `font-display: swap`; Inter is not used above the fold and is not preloaded. Removing the Bricolage preload gave no FCP/LCP gain and introduced a small CLS (0.004), so it stays.
- Critical CSS (sprint 2) verified again; switching the full-stylesheet load from `preload` to `media=print` made no measurable difference locally, so it was left as is.
- Meta pixel: the published GTM container has one Custom HTML tag (standard base code, `init` + `PageView`, fires on `gtm.js`); no `fbq` in app code and no duplicate load. There is no consent banner/Consent Mode in the app. Cache TTL of Google/Meta files cannot be changed from our side.
- Source maps: production builds have `sourcemap: false`. The Lighthouse "missing source maps" warning is not a performance issue and clearing it would require publishing the maps (readable source); intentionally not done.

**Main-thread work**
- A profile with MutationObserver + invalidation tracking showed endless animation loops far below the fold restyling thousands of elements per second (6.6k style mutations / 3 s on the sparkle SVGs, 5.2k on the 20 waveform bars). `src/components/ui/motion-gated.tsx` is a drop-in for framer-motion's `m` that only runs `transition={{ repeat: Infinity }}` elements while they are within 150 px of the viewport; `SparklesText` also stops its 10 Hz re-render loop off screen. Output markup is unchanged. Result: main-thread work -27 %, Speed Index -18 % in the local Lighthouse runs.
- Tried and reverted: incremental/selective hydration of the below-the-fold sections via `Suspense` + `use()`. React 19.1 client-rendered (and so removed) the dehydrated boundaries instead of keeping their server HTML, so it was dropped rather than shipped.

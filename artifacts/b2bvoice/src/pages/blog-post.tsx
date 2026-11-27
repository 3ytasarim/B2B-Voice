import { Suspense, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "wouter";
import { blogPosts, fmtDate, getPostBySlug, hasTranslation, localizePost, type BlogPost } from "@/lib/blogPosts";
import { readPostContent } from "@/lib/blogContent";
import { BLOG_UI } from "@/lib/blogUi";
import { LOCALES, LOCALE_INFO, localizePath, parseLocale, type Locale } from "@/lib/i18n";
import { LanguageScope } from "@/lib/LanguageContext";
import { NOT_FOUND_META, postMeta } from "@/seo/pageMeta";
import { usePageMeta } from "@/seo/usePageMeta";
import { DemoModalCtx, Footer, Navbar } from "@/pages/home";

/** Wide tables scroll inside .table-wrap: give that region keyboard access. */
function withAccessibleTables(html: string): string {
  return html.replace(/class="table-wrap"/g, 'class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"');
}

// "Published August 30, 2026" / "Veröffentlicht am 30. August 2026" / "Publicado el 30 de agosto de 2026"
const PUBLISHED_RE: Record<Locale, RegExp> = {
  en: /Published ([A-Z][a-z]+ \d{1,2}, \d{4})/,
  de: /Veröffentlicht am (\d{1,2}\. [A-ZÄÖÜ][a-zäöü]+ \d{4})/,
  es: /Publicado el (\d{1,2} de [a-záéíóú]+ de \d{4})/,
};

/** Turns the printed publication date into a real <time datetime>. */
function withTimeElement(html: string, isoDate: string, locale: Locale): string {
  return html.replace(PUBLISHED_RE[locale], (m, label: string) => m.replace(label, `<time datetime="${isoDate}">${label}</time>`));
}

/** 4 related posts: same topic and most shared tags first, then most recent. */
function relatedPosts(current: BlogPost, pool: BlogPost[], count = 4): BlogPost[] {
  const tags = new Set(current.tags);
  const score = (p: BlogPost) => p.tags.filter((t) => tags.has(t)).length + (p.topic && p.topic === current.topic ? 1 : 0);
  return pool
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ p, score: score(p) }))
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

const DEMO_MODAL_VALUE = { open: () => { window.location.href = "/demo"; } };

/** Article markup: embedded in the post data (original English posts) or loaded on demand (imported posts, every translation). */
function ArticleBody({ post, locale }: { post: BlogPost; locale: Locale }) {
  const loaded = locale !== "en" || !post.content ? readPostContent(post.slug, locale) : null;
  const raw = loaded ? loaded.html : post.content;
  const script = loaded?.script ?? "";
  const html = useMemo(() => withAccessibleTables(withTimeElement(raw, post.date, locale)), [raw, post.date, locale]);

  // The calculators / scorecards of a few articles are progressively enhanced by one inline script
  // (their forms are hidden until it runs); scripts inside injected HTML do not execute by themselves.
  useEffect(() => {
    if (!script) return;
    const el = document.createElement("script");
    el.text = script;
    document.body.appendChild(el);
    return () => el.remove();
  }, [script]);

  return (
    <div
      id="main-content"
      tabIndex={-1}
      className="blog-content focus:outline-none"
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid="blog-post-content"
    />
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [path, navigate] = useLocation();
  const { locale } = parseLocale(path);
  const ui = BLOG_UI[locale];

  const original = slug ? getPostBySlug(slug) : undefined;
  const post = original && hasTranslation(original.slug, locale) ? localizePost(original, locale) : undefined;
  const meta = useMemo(() => (post ? postMeta(post, locale) : NOT_FOUND_META), [post, locale]);
  usePageMeta(meta);

  const pool = useMemo(() => blogPosts.filter((p) => hasTranslation(p.slug, locale)).map((p) => localizePost(p, locale)), [locale]);
  const related = post ? relatedPosts(post, pool) : [];
  // where the language dropdown / the language links lead: the same article in the other language
  const switchTo = (l: Locale) => navigate(localizePath(slug ? `/${slug}` : "/blog", l));

  if (!post || !original) {
    return (
      <LanguageScope lang={locale} onSwitch={(l) => navigate(localizePath("/blog", l))}>
        <DemoModalCtx.Provider value={DEMO_MODAL_VALUE}>
          <Navbar />
          <main id="main-content" className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 pt-[72px]">
            <h1 className="text-2xl font-bold text-gray-900">{ui.notFoundTitle}</h1>
            <p className="text-gray-500">{ui.notFoundText}</p>
            <Link href={localizePath("/blog", locale)} className="text-primary font-semibold hover:underline">{ui.backToBlog}</Link>
          </main>
          <Footer />
        </DemoModalCtx.Provider>
      </LanguageScope>
    );
  }

  // Two of the original articles carry their own breadcrumb trail.
  const hasOwnBreadcrumb = original.content.includes('class="breadcrumbs"');
  // Original articles print "Published <date>" themselves; the imported ones only have a byline.
  const showsOwnDate = original.content.includes("Published ");
  // Same left edge as the article: the original posts bring their own ~930px column, the imported ones a 58rem one.
  const column = original.content ? "max-w-[58.125rem] px-[18px] min-[58.2rem]:px-0" : "max-w-[58rem] px-[clamp(1rem,4.5vw,3.25rem)]";
  const blogPath = localizePath("/blog", locale);

  return (
    <LanguageScope lang={locale} onSwitch={switchTo}>
      <DemoModalCtx.Provider value={DEMO_MODAL_VALUE}>
        <Navbar />
        <div className="min-h-screen bg-white pt-[72px]">
          {/* Same centred column as the article below */}
          <header className={`mx-auto ${column} pt-8`}>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <Link href={blogPath} className="inline-flex items-center gap-2 py-3 -my-3 text-sm text-primary font-semibold hover:underline">
                {ui.backToBlog}
              </Link>
              <nav aria-label="Language" className="flex items-center gap-4 text-sm">
                {LOCALES.map((l) =>
                  l === locale ? (
                    <span key={l} lang={LOCALE_INFO[l].hreflang} aria-current="true" className="font-bold text-gray-900">{LOCALE_INFO[l].label}</span>
                  ) : hasTranslation(original.slug, l) ? (
                    <Link key={l} href={localizePath(`/${original.slug}`, l)} hrefLang={LOCALE_INFO[l].hreflang} lang={LOCALE_INFO[l].hreflang} className="py-2 text-primary hover:underline">
                      {LOCALE_INFO[l].label}
                    </Link>
                  ) : null,
                )}
              </nav>
            </div>

            {!hasOwnBreadcrumb && (
              <nav aria-label={ui.breadcrumb} className="mt-4 text-sm text-gray-500">
                <ol className="flex flex-wrap items-center gap-x-2">
                  <li><Link href="/" className="hover:underline">{ui.home}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href={blogPath} className="hover:underline">Blog</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-gray-700">{post.title}</li>
                </ol>
              </nav>
            )}
          </header>

          {/*
            The article's own <main> + <article> + <h1> is embedded verbatim, so this wrapper is a
            plain <div>: each page has exactly one <main>, one <article> and one <h1>.
          */}
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <ArticleBody post={original} locale={locale} />
          </Suspense>

          <div className={`mx-auto ${column} mt-4 pt-8 pb-20 border-t border-gray-100`}>
            {!showsOwnDate && (
              <p className="mb-6 text-sm text-gray-500">
                {ui.published} <time dateTime={post.date}>{fmtDate(post.date, locale)}</time> · {ui.by} {post.author}
              </p>
            )}

            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-10" aria-label={ui.topicsLabel}>
                {post.tags.map((tag) => (
                  <li key={tag} className="px-2.5 py-1 bg-primary/5 border border-primary/15 text-primary text-[11px] font-semibold rounded-full">
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <aside aria-labelledby="related-articles">
              <h2 id="related-articles" className="text-2xl font-bold text-gray-900 mb-5">{ui.related}</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <li key={p.slug} className="border border-gray-200 p-5 hover:border-primary/40 transition-colors">
                    <Link href={localizePath(`/${p.slug}`, locale)} className="font-semibold text-gray-900 hover:text-primary leading-snug">
                      {p.title}
                    </Link>
                    <p className="mt-2 text-xs text-gray-500">{fmtDate(p.date, locale)}</p>
                  </li>
                ))}
              </ul>
            </aside>

            <p className="mt-10 text-gray-600">
              {ui.ctaLead}{" "}
              <Link href="/demo" className="text-primary font-semibold hover:underline">{ui.ctaDemo}</Link>{" "}
              {ui.ctaOr} <Link href="/" className="text-primary font-semibold hover:underline">{ui.ctaHome}</Link>
              {ui.ctaEnd}
            </p>
          </div>
        </div>
        <Footer />
      </DemoModalCtx.Provider>
    </LanguageScope>
  );
}

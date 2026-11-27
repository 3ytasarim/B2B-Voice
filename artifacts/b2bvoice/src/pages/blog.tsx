import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { blogIndexMeta } from "@/seo/pageMeta";
import { usePageMeta } from "@/seo/usePageMeta";
import { blogPosts, fmtDate, getTopics, hasTranslation, localizePost } from "@/lib/blogPosts";
import { BLOG_UI } from "@/lib/blogUi";
import { LOCALES, LOCALE_INFO, localizePath, parseLocale } from "@/lib/i18n";
import { LanguageScope } from "@/lib/LanguageContext";
import { DemoModalCtx, Footer, Navbar } from "@/pages/home";

const DEMO_MODAL_VALUE = { open: () => { window.location.href = "/demo"; } };

export default function BlogPage() {
  const [path, navigate] = useLocation();
  const { locale } = parseLocale(path);
  const ui = BLOG_UI[locale];
  usePageMeta(blogIndexMeta(locale));

  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const topics = useMemo(() => getTopics(), []);
  const localized = useMemo(
    () => blogPosts.filter((p) => hasTranslation(p.slug, locale)).map((p) => localizePost(p, locale)),
    [locale],
  );

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localized
      .filter((p) => (activeTopic ? p.topic === activeTopic : true))
      .filter((p) =>
        q ? p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)) : true,
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [query, activeTopic, localized]);

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
      active ? "border-primary bg-primary text-white shadow-sm" : "border-primary/40 bg-white text-primary hover:bg-primary/5"
    }`;

  return (
    <LanguageScope lang={locale} onSwitch={(l) => navigate(localizePath("/blog", l))}>
      <DemoModalCtx.Provider value={DEMO_MODAL_VALUE}>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-[72px]">
          {/* Header */}
          <section className="bg-gradient-to-b from-muted to-white px-4 sm:px-6 pb-12 pt-14 md:pt-20">
            <div className="mx-auto max-w-5xl text-center">
              <span className="inline-block border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                {ui.eyebrow}
              </span>
              <h1 className="mt-7 text-[clamp(2.1rem,6.4vw,4.6rem)] leading-[1.05] tracking-tight text-gray-900">
                <span className="font-light">{ui.headingLead}</span>
                <span className="font-extrabold text-primary">
                  {ui.headingAccent}
                  <span className="text-accent">.</span>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-gray-600">{ui.subtitle}</p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3" role="group" aria-label={ui.filterLabel}>
                <button type="button" onClick={() => setActiveTopic(null)} aria-pressed={activeTopic === null} className={chip(activeTopic === null)}>
                  {ui.all} <span className="text-xs opacity-80">{localized.length}</span>
                </button>
                {topics.map(({ topic }) => {
                  const count = localized.filter((p) => p.topic === topic).length;
                  return (
                    <button key={topic} type="button" onClick={() => setActiveTopic(topic)} aria-pressed={activeTopic === topic} className={chip(activeTopic === topic)}>
                      {ui.topics[topic] ?? topic} <span className="text-xs opacity-80">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mx-auto mt-6 max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  aria-label={ui.searchLabel}
                  className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* The same blog in the other languages (real links: crawlers and visitors both use them) */}
              <nav aria-label="Language" className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
                {LOCALES.map((l) =>
                  l === locale ? (
                    <span key={l} lang={LOCALE_INFO[l].hreflang} aria-current="true" className="font-bold text-gray-900">{LOCALE_INFO[l].label}</span>
                  ) : (
                    <Link key={l} href={localizePath("/blog", l)} hrefLang={LOCALE_INFO[l].hreflang} lang={LOCALE_INFO[l].hreflang} className="py-2 text-primary hover:underline">
                      {LOCALE_INFO[l].label}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          </section>

          {/* Articles: two columns */}
          <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
            <p className="mb-6 text-sm text-gray-500" aria-live="polite">
              {posts.length} {posts.length === 1 ? ui.articleOne : ui.articleMany}
              {activeTopic ? ` ${ui.inTopic} ${ui.topics[activeTopic] ?? activeTopic}` : ""}
            </p>

            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">{ui.noResults}</p>
                <button type="button" onClick={() => { setQuery(""); setActiveTopic(null); }} className="mt-4 text-sm font-semibold text-primary hover:underline">
                  {ui.showAll}
                </button>
              </div>
            ) : (
              <ul className="grid gap-6 md:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.id} className="relative flex" data-testid={`blog-card-${p.slug}`}>
                    <article className="group relative flex w-full flex-col border border-gray-200 border-t-[3px] border-t-primary bg-white p-6 md:p-7 transition-shadow hover:shadow-[0_18px_44px_-22px_rgba(0,53,122,0.45)]">
                      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="font-bold uppercase tracking-widest text-primary">{ui.topics[p.topic ?? ""] ?? p.topic}</span>
                        <span aria-hidden="true" className="text-gray-300">•</span>
                        <time dateTime={p.date} className="text-gray-500">{fmtDate(p.date, locale)}</time>
                      </div>

                      <h2 className="text-xl md:text-[1.4rem] font-bold leading-snug text-gray-900">
                        <Link href={localizePath(`/${p.slug}`, locale)} className="transition-colors group-hover:text-primary after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">
                          {p.title}
                        </Link>
                      </h2>

                      {p.excerpt && <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-gray-600">{p.excerpt}</p>}

                      <div className="mt-auto pt-6">
                        {p.tags.length > 0 && (
                          <div className="mb-5 flex flex-wrap gap-2">
                            {p.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                          {ui.readArticle}<span className="sr-only">: {p.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        <Footer />
      </DemoModalCtx.Provider>
    </LanguageScope>
  );
}

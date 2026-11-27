import { Suspense, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { blogPosts, fmtDate, getPostBySlug, type BlogPost } from "@/lib/blogPosts";
import { readPostContent } from "@/lib/blogContent";
import { NOT_FOUND_META, postMeta } from "@/seo/pageMeta";
import { usePageMeta } from "@/seo/usePageMeta";
import { DemoModalCtx, Footer, Navbar } from "@/pages/home";

/** Wide tables scroll inside .table-wrap: give that region keyboard access. */
function withAccessibleTables(html: string): string {
  return html.replace(/class="table-wrap"/g, 'class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"');
}

/** Turns the "Published August 30, 2026" text into a real <time datetime>. */
function withTimeElement(html: string, isoDate: string): string {
  return html.replace(
    /Published ([A-Z][a-z]+ \d{1,2}, \d{4})/,
    (_m, label: string) => `Published <time datetime="${isoDate}">${label}</time>`,
  );
}

/** 4 related posts: same topic and most shared tags first, then most recent. */
function relatedPosts(current: BlogPost, count = 4): BlogPost[] {
  const tags = new Set(current.tags);
  const score = (p: BlogPost) => p.tags.filter((t) => tags.has(t)).length + (p.topic && p.topic === current.topic ? 1 : 0);
  return blogPosts
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ p, score: score(p) }))
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

const DEMO_MODAL_VALUE = { open: () => { window.location.href = "/demo"; } };

/** Article markup: embedded in the post data (original posts) or loaded on demand (imported posts). */
function ArticleBody({ post }: { post: BlogPost }) {
  const loaded = post.content ? null : readPostContent(post.slug);
  const raw = post.content || loaded!.html;
  const script = loaded?.script ?? "";
  const html = useMemo(() => withAccessibleTables(withTimeElement(raw, post.date)), [raw, post.date]);

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
  const post = slug ? getPostBySlug(slug) : undefined;
  const meta = useMemo(() => (post ? postMeta(post) : NOT_FOUND_META), [post]);
  usePageMeta(meta);

  const related = post ? relatedPosts(post) : [];

  if (!post) {
    return (
      <DemoModalCtx.Provider value={DEMO_MODAL_VALUE}>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 pt-[72px]">
          <h1 className="text-2xl font-bold text-gray-900">404 – Page not found</h1>
          <p className="text-gray-500">This page could not be found.</p>
          <Link href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
        </main>
        <Footer />
      </DemoModalCtx.Provider>
    );
  }

  // Two of the original articles carry their own breadcrumb trail.
  const hasOwnBreadcrumb = post.content.includes('class="breadcrumbs"');
  // Original articles print "Published <date>" themselves; the imported ones only have a byline.
  const showsOwnDate = post.content.includes("Published ");
  // Same left edge as the article: the original posts bring their own ~930px column, the imported ones a 58rem one.
  const column = post.content ? "max-w-[58.125rem] px-[18px] min-[58.2rem]:px-0" : "max-w-[58rem] px-[clamp(1rem,4.5vw,3.25rem)]";

  return (
    <DemoModalCtx.Provider value={DEMO_MODAL_VALUE}>
      <Navbar />
      <div className="min-h-screen bg-white pt-[72px]">
        {/* Same centred column as the article below */}
        <header className={`mx-auto ${column} pt-8`}>
          <Link href="/blog" className="inline-flex items-center gap-2 py-3 -my-3 text-sm text-primary font-semibold hover:underline">
            ← Back to Blog
          </Link>

          {!hasOwnBreadcrumb && (
            <nav aria-label="Breadcrumb" className="mt-4 text-sm text-gray-500">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="hover:underline">Blog</Link></li>
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
          <ArticleBody post={post} />
        </Suspense>

        <div className={`mx-auto ${column} mt-4 pt-8 pb-20 border-t border-gray-100`}>
          {!showsOwnDate && (
            <p className="mb-6 text-sm text-gray-500">
              Published <time dateTime={post.date}>{fmtDate(post.date)}</time> · By {post.author}
            </p>
          )}

          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-10" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag} className="px-2.5 py-1 bg-primary/5 border border-primary/15 text-primary text-[11px] font-semibold rounded-full">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <aside aria-labelledby="related-articles">
            <h2 id="related-articles" className="text-2xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug} className="border border-gray-200 p-5 hover:border-primary/40 transition-colors">
                  <Link href={`/${p.slug}`} className="font-semibold text-gray-900 hover:text-primary leading-snug">
                    {p.title}
                  </Link>
                  <p className="mt-2 text-xs text-gray-500">{fmtDate(p.date)}</p>
                </li>
              ))}
            </ul>
          </aside>

          <p className="mt-10 text-gray-600">
            Want to hear an AI voice agent handle your own calls?{" "}
            <Link href="/demo" className="text-primary font-semibold hover:underline">Book a free B2BVoice demo</Link>{" "}
            or read more about <Link href="/" className="text-primary font-semibold hover:underline">what B2BVoice builds for businesses</Link>.
          </p>
        </div>
      </div>
      <Footer />
    </DemoModalCtx.Provider>
  );
}

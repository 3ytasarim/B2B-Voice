import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { blogPosts, fmtDate, getPostBySlug, type BlogPost } from "@/lib/blogPosts";
import { NOT_FOUND_META, postMeta } from "@/seo/pageMeta";
import { usePageMeta } from "@/seo/usePageMeta";

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

/** 3–5 related posts: most shared tags first, then most recent. */
function relatedPosts(current: BlogPost, count = 4): BlogPost[] {
  const tags = new Set(current.tags);
  return blogPosts
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ p, score: p.tags.filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const meta = useMemo(() => (post ? postMeta(post) : NOT_FOUND_META), [post]);
  usePageMeta(meta);

  const content = useMemo(
    () => (post ? withAccessibleTables(withTimeElement(post.content, post.date)) : ""),
    [post],
  );

  if (!post) {
    return (
      <main id="main-content" className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">404 – Page not found</h1>
        <p className="text-gray-500">This page could not be found.</p>
        <Link href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
      </main>
    );
  }

  const related = relatedPosts(post);
  // Two of the articles already carry their own breadcrumb trail.
  const hasOwnBreadcrumb = post.content.includes('class="breadcrumbs"');

  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-6 pt-8">
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

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-w-5xl mx-auto rounded-xl mt-6 border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </header>

      {/*
        The article's own <main> + <article> + <h1> header is embedded
        verbatim in post.content (see blogPosts.ts) — this wrapper is a plain
        <div> so each page has exactly one <main>, one <article> and one <h1>.
      */}
      <div
        id="main-content"
        tabIndex={-1}
        className="blog-content focus:outline-none"
        dangerouslySetInnerHTML={{ __html: content }}
        data-testid="blog-post-content"
      />

      <footer className="container mx-auto px-6 max-w-5xl mt-4 pt-8 pb-16 border-t border-gray-100">
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
      </footer>
    </div>
  );
}

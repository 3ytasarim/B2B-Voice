import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { getPostBySlug, fmtDate } from "@/lib/blogPosts";

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  // SEO: title, description, keywords, JSON-LD Article schema
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | B2BVoice Blog`;
    if (post.excerpt) setMeta("description", post.excerpt);
    if (post.tags.length) setMeta("keywords", post.tags.join(", "));

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "blog-jsonld";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || undefined,
      keywords: post.tags.join(", ") || undefined,
      articleSection: post.category,
      datePublished: post.date,
      dateModified: post.date,
      image: post.coverImage ? `${window.location.origin}${post.coverImage}` : undefined,
      author: { "@type": "Person", name: post.author },
      publisher: { "@type": "Organization", name: "B2B Voice LLC", url: "https://b2b-voice.com" },
      mainEntityOfPage: { "@type": "WebPage", "@id": window.location.href },
    });
    document.getElementById("blog-jsonld")?.remove();
    document.head.appendChild(ld);
    return () => { document.getElementById("blog-jsonld")?.remove(); };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">This article could not be found.</p>
        <Link href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Blog
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 mb-4">
          <span className="font-semibold text-gray-600">{post.author}</span>
          <span aria-hidden="true">·</span>
          <span>{fmtDate(post.date)}</span>
          <span aria-hidden="true">·</span>
          <Link
            href="/blog"
            className="font-bold uppercase tracking-wide text-primary hover:underline"
          >
            {post.category}
          </Link>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6" data-testid="blog-post-title">
          {post.title}
        </h1>
        {post.excerpt && <p className="text-lg text-gray-500 mb-8">{post.excerpt}</p>}

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl mb-10 border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <div
          className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary leading-relaxed blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          data-testid="blog-post-content"
        />

        {post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-primary/5 border border-primary/15 text-primary text-[11px] font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

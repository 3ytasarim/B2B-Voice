import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { getPostBySlug } from "@/lib/blogPosts";

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
      <article className="container mx-auto px-6 py-10 max-w-5xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-6 hover:underline">
          ← Back to Blog
        </Link>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl mb-6 border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        {/*
          The article's own header/hero (kicker, breadcrumbs, h1, dek/deck,
          meta row) is embedded verbatim in post.content — see blogPosts.ts.
          data-testid kept here for existing test selectors; the actual
          heading text comes from the injected HTML, not this element.
        */}
        <h1 className="sr-only" data-testid="blog-post-title">{post.title}</h1>

        <div
          className="max-w-none blog-content"
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

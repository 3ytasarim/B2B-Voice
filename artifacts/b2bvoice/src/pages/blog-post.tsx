import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Calendar } from "lucide-react";

interface BlogPostFull {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string;
  hasImage: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

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
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => data && setPost(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  // SEO: title, description, keywords, JSON-LD Article schema
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | B2BVoice Blog`;
    if (post.excerpt) setMeta("description", post.excerpt);
    if (post.keywords) setMeta("keywords", post.keywords);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "blog-jsonld";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || undefined,
      keywords: post.keywords || undefined,
      datePublished: post.createdAt || undefined,
      dateModified: post.updatedAt || post.createdAt || undefined,
      image: post.hasImage ? `${window.location.origin}/api/blog/${post.id}/image` : undefined,
      author: { "@type": "Organization", name: "B2BVoice", url: "https://b2b-voice.com" },
      publisher: { "@type": "Organization", name: "B2B Voice LLC", url: "https://b2b-voice.com" },
      mainEntityOfPage: { "@type": "WebPage", "@id": window.location.href },
    });
    document.getElementById("blog-jsonld")?.remove();
    document.head.appendChild(ld);
    return () => { document.getElementById("blog-jsonld")?.remove(); };
  }, [post]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">This article could not be found.</p>
        <Link href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Blog
        </Link>

        <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Calendar className="w-3.5 h-3.5" />
          {fmtDate(post.createdAt)}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6" data-testid="blog-post-title">
          {post.title}
        </h1>
        {post.excerpt && <p className="text-lg text-gray-500 mb-8">{post.excerpt}</p>}

        {post.hasImage && (
          <img
            src={`/api/blog/${post.id}/image`}
            alt={post.title}
            className="w-full rounded-xl mb-10 border border-gray-100"
          />
        )}

        <div
          className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary leading-relaxed blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          data-testid="blog-post-content"
        />

        {post.keywords && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {post.keywords.split(",").map((k) => k.trim()).filter(Boolean).map((k) => (
              <span key={k} className="px-2.5 py-1 bg-primary/5 border border-primary/15 text-primary text-[11px] font-semibold rounded-full">
                {k}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

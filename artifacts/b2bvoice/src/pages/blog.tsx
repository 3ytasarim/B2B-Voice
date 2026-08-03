import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string;
  createdAt: string | null;
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog | B2BVoice — AI Voice Assistant Insights";
    setMeta("description", "Insights, guides, and industry news about AI voice assistants, business automation, and customer communication from the B2BVoice team.");
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : []))
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-5">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">B2BVoice Blog</h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Insights on AI voice assistants, business automation, and customer communication.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm">No articles published yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group block border border-gray-200 hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                data-testid={`blog-card-${p.slug}`}
              >
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={`/api/blog/${p.id}/image`}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                  />
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
                    <Calendar className="w-3 h-3" />
                    {fmtDate(p.createdAt)}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h2>
                  {p.excerpt && <p className="text-sm text-gray-500 line-clamp-3 mb-3">{p.excerpt}</p>}
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

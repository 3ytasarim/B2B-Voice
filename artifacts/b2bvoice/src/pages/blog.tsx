import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { blogPosts, fmtDate, getCategories } from "@/lib/blogPosts";

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
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = useMemo(() => getCategories(), []);
  const latestPosts = useMemo(
    () => [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5),
    [],
  );

  useEffect(() => {
    document.title = "Blog | B2BVoice — AI Voice Assistant Insights";
    setMeta(
      "description",
      "Insights, guides, and industry news about AI voice assistants, business automation, and customer communication from the B2BVoice team.",
    );
  }, []);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts
      .filter((p) => (activeCategory ? p.category === activeCategory : true))
      .filter((p) =>
        q ? p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-5">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">B2BVoice Blog</h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Insights on AI voice assistants, business automation, and customer communication.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          {/* Main post list */}
          <main>
            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm">No articles match your search.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {posts.map((p) => (
                  <article
                    key={p.id}
                    className="py-12 first:pt-0 border-b border-gray-100 last:border-0"
                    data-testid={`blog-card-${p.slug}`}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                      <Link href={`/${p.slug}`} className="hover:text-primary transition-colors">
                        {p.title}
                      </Link>
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 mb-6">
                      <span className="font-semibold text-gray-600">{p.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>{fmtDate(p.date)}</span>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(p.category)}
                        className="font-bold uppercase tracking-wide text-primary hover:underline"
                      >
                        {p.category}
                      </button>
                    </div>

                    <Link href={`/${p.slug}`} className="block aspect-[16/9] bg-gray-100 overflow-hidden mb-6 group">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                      />
                    </Link>

                    {p.excerpt && <p className="text-base text-gray-500 leading-relaxed mb-6">{p.excerpt}</p>}

                    <Link
                      href={`/${p.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-colors mb-6"
                    >
                      Continue Reading
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-semibold uppercase tracking-wide rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:pt-1">
            <div className="mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-5">Latest Posts</h3>
              <ul className="flex flex-col gap-4">
                {latestPosts.map((p) => (
                  <li key={p.id}>
                    <Link href={`/${p.slug}`} className="flex items-center gap-3 group">
                      <span className="shrink-0 w-14 h-14 bg-gray-100 overflow-hidden rounded-md">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {p.title}
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">{fmtDate(p.date)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-5">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-colors"
                  aria-label="Search"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-5">Categories</h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className={`text-sm transition-colors ${activeCategory === null ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}
                  >
                    All
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-sm transition-colors ${activeCategory === cat ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

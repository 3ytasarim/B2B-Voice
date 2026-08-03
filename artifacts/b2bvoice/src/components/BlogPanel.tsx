import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Plus, Pencil, Trash2, X, Save, Image as ImageIcon,
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Eye, EyeOff,
} from "lucide-react";

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string;
  published: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

const TOKEN_KEY = "b2bvoice_admin_token";
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const BLOG_BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/blog`;

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded border text-xs transition-colors ${
        active ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function BlogEditor({ post, onClose, onSaved }: {
  post: BlogPostRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [keywords, setKeywords] = useState("");
  const [published, setPublished] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState<string>(""); // new upload
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(!!post);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your blog post content here…" }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[320px] p-4 focus:outline-none",
      },
    },
  });

  // Load full post when editing
  useEffect(() => {
    if (!post) return;
    (async () => {
      try {
        const res = await fetch(`/api/blog/${post.slug}?draft=1`, { headers: authHeaders() });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setSlugTouched(true);
        setExcerpt(data.excerpt);
        setKeywords(data.keywords);
        setPublished(data.published);
        setHasExistingImage(data.hasImage);
        editor?.commands.setContent(data.content || "");
      } catch {
        setError("Could not load post.");
      } finally {
        setLoadingPost(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, editor]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setRemoveImage(false);
    };
    reader.readAsDataURL(file);
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) { setError("Title and slug are required."); return; }
    setSaving(true);
    setError(null);
    const body = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: editor?.getHTML() ?? "",
      keywords: keywords.trim(),
      published,
      coverImage: imageDataUrl
        ? imageDataUrl
        : post && hasExistingImage && !removeImage
          ? "__KEEP__"
          : "",
    };
    try {
      const res = await fetch(post ? `/api/blog/${post.id}` : "/api/blog", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      if (res.status === 409) { setError("This slug is already in use."); return; }
      if (!res.ok) throw new Error();
      onSaved();
    } catch {
      setError("Could not save the post. Make sure the API server is running.");
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = imageDataUrl || (post && hasExistingImage && !removeImage ? `/api/blog/${post.id}/image` : "");

  return (
    <div className="bg-white border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {post ? "Edit Post" : "New Post"}
        </p>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600" data-testid="blog-editor-close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {loadingPost ? (
        <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="p-5 space-y-5">
          {/* Title & slug */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Title *</label>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="How AI Voice Assistants Transform Customer Service"
                data-testid="blog-title-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">URL Slug *</label>
              <input
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                placeholder="how-ai-voice-assistants-transform-customer-service"
                data-testid="blog-slug-input"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Excerpt <span className="normal-case font-normal">(shown in list + meta description for SEO)</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
              placeholder="A short summary of the post (1–2 sentences)…"
              data-testid="blog-excerpt-input"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Keywords <span className="normal-case font-normal">(comma separated, for SEO)</span>
            </label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="ai voice assistant, customer service, automation"
              data-testid="blog-keywords-input"
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Cover Image</label>
            {previewSrc ? (
              <div className="relative inline-block">
                <img src={previewSrc} alt="Cover preview" className="h-40 w-auto border border-gray-200 object-cover" />
                <button
                  onClick={() => { setImageDataUrl(""); setRemoveImage(true); }}
                  className="absolute top-2 right-2 bg-white/90 border border-gray-200 p-1 hover:bg-red-50 hover:text-red-500"
                  title="Remove image"
                  data-testid="blog-image-remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 py-8 cursor-pointer hover:border-primary/40 transition-colors">
                <ImageIcon className="w-6 h-6 text-gray-300" />
                <span className="text-xs text-gray-400">Click to upload an image (JPG, PNG, WebP)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  data-testid="blog-image-input"
                />
              </label>
            )}
          </div>

          {/* Content editor */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Content *</label>
            <div className="border border-gray-200">
              {/* Toolbar */}
              {editor && (
                <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-gray-200 bg-gray-50">
                  {[1, 2, 3].map((lvl) => (
                    <ToolbarButton
                      key={lvl}
                      title={`Heading ${lvl}`}
                      active={editor.isActive("heading", { level: lvl })}
                      onClick={() => editor.chain().focus().toggleHeading({ level: lvl as 1 | 2 | 3 }).run()}
                    >
                      <span className="font-bold px-0.5">H{lvl}</span>
                    </ToolbarButton>
                  ))}
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
                    <LinkIcon className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="w-3.5 h-3.5" />
                  </ToolbarButton>
                  <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="w-3.5 h-3.5" />
                  </ToolbarButton>
                </div>
              )}
              <EditorContent editor={editor} data-testid="blog-content-editor" />
            </div>
          </div>

          {/* Published toggle + save */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors ${
                published ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500 border-gray-200 bg-gray-50"
              }`}
              data-testid="blog-published-toggle"
            >
              {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {published ? "Published" : "Draft"}
            </button>
            <div className="flex items-center gap-3">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors"
                data-testid="blog-save-button"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving…" : "Save Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogPanel() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog/all", { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setPosts(await res.json());
      setError(null);
    } catch {
      setError("Could not load blog posts. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (p: BlogPostRow) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await fetch(`/api/blog/${p.id}`, { method: "DELETE", headers: authHeaders() });
    fetchPosts();
  };

  if (creating || editing) {
    return (
      <BlogEditor
        post={editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSaved={() => { setCreating(false); setEditing(null); fetchPosts(); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Blog Posts ({posts.length})</p>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          data-testid="blog-new-button"
        >
          <Plus className="w-3.5 h-3.5" />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-8 text-center text-sm text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-400 mb-1">No blog posts yet.</p>
          <p className="text-xs text-gray-300">Click "New Post" to write your first article.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4" data-testid={`blog-row-${p.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                  {!p.published && (
                    <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">Draft</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-mono truncate">/blog/{p.slug}</p>
              </div>
              <p className="text-[11px] text-gray-400 shrink-0 hidden md:block">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
              </p>
              <a
                href={`${BLOG_BASE}/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-primary transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                onClick={() => setEditing(p)}
                className="p-2 text-gray-400 hover:text-primary transition-colors"
                title="Edit"
                data-testid={`blog-edit-${p.id}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
                data-testid={`blog-delete-${p.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

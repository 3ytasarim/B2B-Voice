import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, upsertBlogPostSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import sharp from "sharp";
import sanitizeHtml from "sanitize-html";
import { requireAdmin, isAdminRequest } from "../lib/adminAuth";

const router = Router();

/** Sanitize TipTap-authored HTML with a strict allowlist. */
function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "p", "br", "hr",
      "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "code", "pre", "a",
    ],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}

/** Process an incoming data-URL image: resize + convert to webp, return base64. */
async function processCover(dataUrl: string): Promise<string> {
  if (!dataUrl) return "";
  // already stored base64 (no data: prefix change) — pass through
  const m = dataUrl.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/);
  const raw = m ? m[1] : dataUrl;
  const buf = Buffer.from(raw, "base64");
  const out = await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  return out.toString("base64");
}

const listColumns = {
  id: blogPostsTable.id,
  slug: blogPostsTable.slug,
  title: blogPostsTable.title,
  excerpt: blogPostsTable.excerpt,
  keywords: blogPostsTable.keywords,
  published: blogPostsTable.published,
  createdAt: blogPostsTable.createdAt,
  updatedAt: blogPostsTable.updatedAt,
};

// Public: list published posts (no content/image payload)
router.get("/blog", async (_req, res) => {
  const rows = await db.select(listColumns).from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt));
  res.json(rows);
});

// Admin: list all posts
router.get("/blog/all", requireAdmin, async (_req, res) => {
  const rows = await db.select(listColumns).from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
  res.json(rows);
});

// Cover image (serve as binary with long cache)
router.get("/blog/:id/image", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const rows = await db.select({ coverImage: blogPostsTable.coverImage, coverImageType: blogPostsTable.coverImageType, published: blogPostsTable.published })
    .from(blogPostsTable).where(eq(blogPostsTable.id, id)).limit(1);
  if (rows.length === 0 || !rows[0].coverImage) { res.status(404).end(); return; }
  if (!rows[0].published && !isAdminRequest(req)) { res.status(404).end(); return; }
  res.setHeader("Content-Type", rows[0].coverImageType || "image/webp");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(Buffer.from(rows[0].coverImage, "base64"));
});

// Public: single post by slug (published only unless ?draft=1)
router.get("/blog/:slug", async (req, res) => {
  const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
  const post = rows[0];
  if (!post || (!post.published && !(req.query.draft === "1" && isAdminRequest(req)))) { res.status(404).json({ error: "Not found" }); return; }
  const { coverImage, ...rest } = post;
  res.json({ ...rest, hasImage: !!coverImage });
});

// Admin: create
router.post("/blog", requireAdmin, async (req, res) => {
  const parse = upsertBlogPostSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { coverImage, ...data } = parse.data;
  const existing = await db.select({ id: blogPostsTable.id }).from(blogPostsTable).where(eq(blogPostsTable.slug, data.slug)).limit(1);
  if (existing.length > 0) { res.status(409).json({ error: "Slug already exists" }); return; }
  const processed = coverImage ? await processCover(coverImage) : "";
  const inserted = await db.insert(blogPostsTable).values({ ...data, content: cleanContent(data.content), coverImage: processed }).returning({ id: blogPostsTable.id, slug: blogPostsTable.slug });
  res.status(201).json(inserted[0]);
});

// Admin: update
router.put("/blog/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parse = upsertBlogPostSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { coverImage, ...data } = parse.data;
  const update: Record<string, unknown> = { ...data, content: cleanContent(data.content), updatedAt: new Date() };
  if (coverImage === "__KEEP__") {
    // keep existing image
  } else {
    update.coverImage = coverImage ? await processCover(coverImage) : "";
  }
  const updated = await db.update(blogPostsTable).set(update).where(eq(blogPostsTable.id, id)).returning({ id: blogPostsTable.id });
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

// Admin: delete
router.delete("/blog/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const deleted = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id)).returning({ id: blogPostsTable.id });
  if (deleted.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

export default router;

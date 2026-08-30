import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "@workspace/db";
import {
  blogPostsTable,
  upsertBlogPostSchema,
} from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import sharp from "sharp";
import sanitizeHtml from "sanitize-html";
import {
  requireAdmin,
  isAdminRequest,
} from "../lib/adminAuth";
import {
  uploadObject,
  deleteObject,
  publicObjectUrl,
} from "../lib/objectStorage";

const router = Router();

function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "p", "br", "hr",
      "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "code", "pre", "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

function isStorageKey(value: string): boolean {
  return value.startsWith("blog/");
}

async function processCover(dataUrl: string): Promise<string> {
  if (!dataUrl) return "";

  const match = dataUrl.match(
    /^data:image\/[a-zA-Z+]+;base64,(.+)$/
  );

  if (!match) {
    throw new Error("Invalid cover image");
  }

  const input = Buffer.from(match[1], "base64");

  const output = await sharp(input)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `blog/${randomUUID()}.webp`;

  await uploadObject(key, output, "image/webp");

  return key;
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

router.get("/blog", async (_req, res) => {
  const rows = await db
    .select(listColumns)
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt));

  res.json(rows);
});

router.get("/blog/all", requireAdmin, async (_req, res) => {
  const rows = await db
    .select(listColumns)
    .from(blogPostsTable)
    .orderBy(desc(blogPostsTable.createdAt));

  res.json(rows);
});

router.get("/blog/:id/image", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const rows = await db
    .select({
      coverImage: blogPostsTable.coverImage,
      coverImageType: blogPostsTable.coverImageType,
      published: blogPostsTable.published,
    })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .limit(1);

  const post = rows[0];

  if (!post?.coverImage) {
    res.status(404).end();
    return;
  }

  if (!post.published && !isAdminRequest(req)) {
    res.status(404).end();
    return;
  }

  if (isStorageKey(post.coverImage)) {
    res.redirect(302, publicObjectUrl(post.coverImage));
    return;
  }

  // Eski Base64 kayıtları için geriye dönük destek.
  res.setHeader(
    "Content-Type",
    post.coverImageType || "image/webp"
  );
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(Buffer.from(post.coverImage, "base64"));
});

router.get("/blog/:slug", async (req, res) => {
  const rows = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, req.params.slug))
    .limit(1);

  const post = rows[0];

  if (
    !post ||
    (
      !post.published &&
      !(req.query.draft === "1" && isAdminRequest(req))
    )
  ) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const { coverImage, ...rest } = post;
  res.json({
    ...rest,
    hasImage: Boolean(coverImage),
  });
});

router.post("/blog", requireAdmin, async (req, res) => {
  const parse = upsertBlogPostSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json({
      error: "Validation error",
      details: parse.error.issues,
    });
    return;
  }

  const { coverImage, ...data } = parse.data;

  const existing = await db
    .select({ id: blogPostsTable.id })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, data.slug))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "Slug already exists" });
    return;
  }

  const storedCover = coverImage
    ? await processCover(coverImage)
    : "";

  const inserted = await db
    .insert(blogPostsTable)
    .values({
      ...data,
      content: cleanContent(data.content),
      coverImage: storedCover,
      coverImageType: "image/webp",
    })
    .returning({
      id: blogPostsTable.id,
      slug: blogPostsTable.slug,
    });

  res.status(201).json(inserted[0]);
});

router.put("/blog/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parse = upsertBlogPostSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json({
      error: "Validation error",
      details: parse.error.issues,
    });
    return;
  }

  const currentRows = await db
    .select({ coverImage: blogPostsTable.coverImage })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .limit(1);

  if (currentRows.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const oldCover = currentRows[0].coverImage;
  const { coverImage, ...data } = parse.data;

  const update: Record<string, unknown> = {
    ...data,
    content: cleanContent(data.content),
    updatedAt: new Date(),
  };

  let newCover: string | undefined;

  if (coverImage !== "__KEEP__") {
    newCover = coverImage
      ? await processCover(coverImage)
      : "";

    update.coverImage = newCover;
    update.coverImageType = "image/webp";
  }

  await db
    .update(blogPostsTable)
    .set(update)
    .where(eq(blogPostsTable.id, id));

  if (
    newCover !== undefined &&
    isStorageKey(oldCover) &&
    oldCover !== newCover
  ) {
    await deleteObject(oldCover).catch((error) => {
      console.error("[storage] old cover delete failed:", error);
    });
  }

  res.json({ success: true });
});

router.delete("/blog/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const deleted = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .returning({
      id: blogPostsTable.id,
      coverImage: blogPostsTable.coverImage,
    });

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (isStorageKey(deleted[0].coverImage)) {
    await deleteObject(deleted[0].coverImage).catch((error) => {
      console.error("[storage] cover delete failed:", error);
    });
  }

  res.json({ success: true });
});

export default router;

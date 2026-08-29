import { Router } from "express";
import { db } from "@workspace/db";
import { partnersTable, upsertPartnerSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import sharp from "sharp";
import { requireAdmin } from "../lib/adminAuth";

const router = Router();

/** Resize + convert an incoming data-URL logo to a compact webp data-URL. */
async function processLogo(dataUrl: string): Promise<string> {
  if (!dataUrl) return "";
  if (!dataUrl.startsWith("data:")) return dataUrl; // external https URL, pass through
  const m = dataUrl.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/);
  if (!m) return "";
  const buf = Buffer.from(m[1], "base64");
  const out = await sharp(buf).resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  return `data:image/webp;base64,${out.toString("base64")}`;
}

// Public: list all partners
router.get("/partners", async (_req, res) => {
  const rows = await db.select().from(partnersTable).orderBy(asc(partnersTable.sortOrder));
  res.json(rows);
});

// Admin: create
router.post("/partners", requireAdmin, async (req, res) => {
  const parse = upsertPartnerSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { imageUrl, ...data } = parse.data;
  const processed = imageUrl ? await processLogo(imageUrl) : "";
  const [row] = await db.insert(partnersTable).values({ ...data, imageUrl: processed }).returning();
  res.status(201).json(row);
});

// Admin: update
router.put("/partners/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parse = upsertPartnerSchema.partial().safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { imageUrl, ...data } = parse.data;
  const update: Record<string, unknown> = { ...data };
  if (imageUrl !== undefined) {
    update.imageUrl = imageUrl ? await processLogo(imageUrl) : "";
  }
  const [row] = await db.update(partnersTable).set(update).where(eq(partnersTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

// Admin: delete
router.delete("/partners/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db.delete(partnersTable).where(eq(partnersTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

export default router;

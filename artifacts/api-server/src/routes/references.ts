import { Router } from "express";
import { db } from "@workspace/db";
import { referencesTable, upsertReferenceSchema } from "@workspace/db/schema";
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

// Public: list references (optionally only published)
router.get("/references", async (req, res) => {
  const rows = req.query.published === "true"
    ? await db.select().from(referencesTable).where(eq(referencesTable.published, true)).orderBy(asc(referencesTable.sortOrder))
    : await db.select().from(referencesTable).orderBy(asc(referencesTable.sortOrder));
  res.json(rows);
});

// Admin: create
router.post("/references", requireAdmin, async (req, res) => {
  const parse = upsertReferenceSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { logoUrl, ...data } = parse.data;
  const processed = logoUrl ? await processLogo(logoUrl) : "";
  const [row] = await db.insert(referencesTable).values({ ...data, logoUrl: processed }).returning();
  res.status(201).json(row);
});

// Admin: update
router.put("/references/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parse = upsertReferenceSchema.partial().safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: "Validation error", details: parse.error.issues }); return; }
  const { logoUrl, ...data } = parse.data;
  const update: Record<string, unknown> = { ...data };
  if (logoUrl !== undefined) {
    update.logoUrl = logoUrl ? await processLogo(logoUrl) : "";
  }
  const [row] = await db.update(referencesTable).set(update).where(eq(referencesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

// Admin: delete
router.delete("/references/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db.delete(referencesTable).where(eq(referencesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

export default router;

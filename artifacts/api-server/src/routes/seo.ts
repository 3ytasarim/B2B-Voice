import { Router } from "express";
import { db } from "@workspace/db";
import { seoSettingsTable, upsertSeoSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/seo", async (_req, res) => {
  const rows = await db.select().from(seoSettingsTable);
  const result: Record<string, { title: string; description: string; keywords: string }> = {
    en: { title: "", description: "", keywords: "" },
    de: { title: "", description: "", keywords: "" },
    es: { title: "", description: "", keywords: "" },
  };
  for (const row of rows) {
    if (row.lang in result) {
      result[row.lang] = { title: row.title, description: row.description, keywords: row.keywords };
    }
  }
  res.json(result);
});

router.put("/seo", async (req, res) => {
  const parse = upsertSeoSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", details: parse.error.issues });
    return;
  }
  const { lang, title, description, keywords } = parse.data;
  const existing = await db.select().from(seoSettingsTable).where(eq(seoSettingsTable.lang, lang));
  if (existing.length > 0) {
    await db.update(seoSettingsTable)
      .set({ title, description, keywords, updatedAt: new Date() })
      .where(eq(seoSettingsTable.lang, lang));
  } else {
    await db.insert(seoSettingsTable).values({ lang, title, description, keywords });
  }
  res.json({ success: true });
});

export default router;

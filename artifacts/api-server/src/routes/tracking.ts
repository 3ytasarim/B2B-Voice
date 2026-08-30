import { Router } from "express";
import { db } from "@workspace/db";
import { trackingSettingsTable, upsertTrackingSchema } from "@workspace/db/schema";
import { requireAdmin } from "../lib/adminAuth";

const router = Router();

router.get("/tracking", async (_req, res) => {
  const rows = await db.select().from(trackingSettingsTable).limit(1);
  if (rows.length === 0) {
    res.json({ searchConsoleCode: "", analyticsId: "", adsId: "", adsConversionLabel: "" });
    return;
  }
  const { searchConsoleCode, analyticsId, adsId, adsConversionLabel } = rows[0];
  res.json({ searchConsoleCode, analyticsId, adsId, adsConversionLabel });
});

router.put("/tracking", requireAdmin, async (req, res) => {
  const parse = upsertTrackingSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", details: parse.error.issues });
    return;
  }
  const data = parse.data;
  const rows = await db.select().from(trackingSettingsTable).limit(1);
  if (rows.length === 0) {
    await db.insert(trackingSettingsTable).values({ ...data });
  } else {
    await db.update(trackingSettingsTable).set({ ...data, updatedAt: new Date() });
  }
  res.json({ success: true });
});

export default router;

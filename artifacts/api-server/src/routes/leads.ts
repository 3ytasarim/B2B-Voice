import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, updateLeadSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/adminAuth";

const router = Router();

router.post("/leads", async (req, res) => {
  const { email, phone, scenario } = req.body as { email?: string; phone?: string; scenario?: string };
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  const [lead] = await db
    .insert(leadsTable)
    .values({
      email: email.trim(),
      phone: phone?.trim() || null,
      scenario: scenario?.trim() || null,
      status: "partial",
    })
    .returning();
  res.status(201).json(lead);
});

router.patch("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parse = updateLeadSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", details: parse.error.issues });
    return;
  }
  const [lead] = await db
    .update(leadsTable)
    .set({ ...parse.data, updatedAt: new Date() })
    .where(eq(leadsTable.id, id))
    .returning();
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(lead);
});

router.get("/leads", requireAdmin, async (_req, res) => {
  const leads = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
  res.json(leads.reverse());
});

router.delete("/leads/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [lead] = await db.delete(leadsTable).where(eq(leadsTable.id, id)).returning();
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json({ ok: true, id });
});

export default router;

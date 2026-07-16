import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessType: text("business_type"),
  businessDescription: text("business_description"),
  website: text("website"),
  demoNeeds: text("demo_needs"),
  demoType: text("demo_type"),
  consentGiven: boolean("consent_given").default(false),
  status: text("status").default("partial"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = createInsertSchema(leadsTable)
  .omit({ id: true, createdAt: true, updatedAt: true, email: true })
  .partial();

export const selectLeadSchema = createSelectSchema(leadsTable);

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

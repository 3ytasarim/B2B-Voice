import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const referencesTable = pgTable("references", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientTitle: text("client_title"),
  company: text("company").notNull(),
  logoUrl: text("logo_url"), // data: URL or external https URL
  websiteUrl: text("website_url"),
  testimonial: text("testimonial"),
  rating: integer("rating"),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  row: integer("row").notNull().default(1), // which homepage marquee row (1 or 2)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const upsertReferenceSchema = z.object({
  clientName: z.string().min(1),
  clientTitle: z.string().optional().default(""),
  company: z.string().min(1),
  logoUrl: z.string().optional(), // omit to keep existing, "" to clear
  websiteUrl: z.string().optional().default(""),
  testimonial: z.string().optional().default(""),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  row: z.number().int().min(1).max(2).default(1),
});

export type ReferenceRow = typeof referencesTable.$inferSelect;
export type UpsertReference = z.infer<typeof upsertReferenceSchema>;

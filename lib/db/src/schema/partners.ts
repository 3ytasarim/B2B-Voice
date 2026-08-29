import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const partnersTable = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"), // data: URL or external https URL
  websiteUrl: text("website_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const upsertPartnerSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(), // omit to keep existing, "" to clear
  websiteUrl: z.string().optional().default(""),
  sortOrder: z.number().int().default(0),
});

export type PartnerRow = typeof partnersTable.$inferSelect;
export type UpsertPartner = z.infer<typeof upsertPartnerSchema>;

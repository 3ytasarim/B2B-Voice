import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const seoSettingsTable = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  lang: text("lang").notNull(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  keywords: text("keywords").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertSeoSchema = z.object({
  lang: z.enum(["en", "de", "es"]),
  title: z.string(),
  description: z.string(),
  keywords: z.string(),
});

export type SeoSettings = typeof seoSettingsTable.$inferSelect;
export type UpsertSeo = z.infer<typeof upsertSeoSchema>;

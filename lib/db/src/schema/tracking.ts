import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const trackingSettingsTable = pgTable("tracking_settings", {
  id: serial("id").primaryKey(),
  searchConsoleCode: text("search_console_code").notNull().default(""),
  analyticsId: text("analytics_id").notNull().default(""),
  adsId: text("ads_id").notNull().default(""),
  adsConversionLabel: text("ads_conversion_label").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertTrackingSchema = z.object({
  searchConsoleCode: z.string(),
  analyticsId: z.string(),
  adsId: z.string(),
  adsConversionLabel: z.string(),
});

export type TrackingSettings = typeof trackingSettingsTable.$inferSelect;
export type UpsertTracking = z.infer<typeof upsertTrackingSchema>;

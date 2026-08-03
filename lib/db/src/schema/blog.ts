import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  keywords: text("keywords").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""), // base64 webp
  coverImageType: text("cover_image_type").notNull().default("image/webp"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  keywords: z.string().default(""),
  coverImage: z.string().default(""), // data URL or base64
  published: z.boolean().default(true),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type UpsertBlogPost = z.infer<typeof upsertBlogPostSchema>;

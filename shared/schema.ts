import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Site Configuration
export const siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteName: text("site_name").notNull().default("Cuerpo de Banderas"),
  siteSubtitle: text("site_subtitle").notNull().default("Liceo de Costa Rica"),
  logoUrl: text("logo_url"),
  logoS3Key: text("logo_s3_key"),
  faviconUrl: text("favicon_url"),
  faviconS3Key: text("favicon_s3_key"),
  contactEmail: text("contact_email").default("cuerpo.banderas@liceocostarica.ed.cr"),
  contactPhone: text("contact_phone").default("+506 2221-9358"),
  address: text("address").default("Liceo de Costa Rica\nAvenida 6, Calle 7-9\nSan José, Costa Rica"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({ id: true, updatedAt: true });
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type SiteConfig = typeof siteConfig.$inferSelect;

// Leadership Periods (Jefaturas)
export const leadershipPeriods = pgTable("leadership_periods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: text("year").notNull(),
  jefatura: text("jefatura").notNull(),
  segundaVoz: text("segunda_voz"),
  imageUrl: text("image_url"),
  imageS3Key: text("image_s3_key"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadershipPeriodSchema = createInsertSchema(leadershipPeriods).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertLeadershipPeriod = z.infer<typeof insertLeadershipPeriodSchema>;
export type LeadershipPeriod = typeof leadershipPeriods.$inferSelect;

// Shields (Escudos)
export const shields = pgTable("shields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  imageS3Key: text("image_s3_key"),
  symbolism: text("symbolism"),
  displayOrder: integer("display_order").notNull().default(0),
  isMainShield: boolean("is_main_shield").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertShieldSchema = createInsertSchema(shields).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertShield = z.infer<typeof insertShieldSchema>;
export type Shield = typeof shields.$inferSelect;

// Gallery Categories
export const galleryCategories = pgTable("gallery_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGalleryCategorySchema = createInsertSchema(galleryCategories).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertGalleryCategory = z.infer<typeof insertGalleryCategorySchema>;
export type GalleryCategory = typeof galleryCategories.$inferSelect;

// Gallery Items
export const galleryItems = pgTable("gallery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  imageS3Key: text("image_s3_key"),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailS3Key: text("thumbnail_s3_key"),
  categoryId: varchar("category_id").references(() => galleryCategories.id, { onDelete: 'cascade' }),
  year: text("year"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

// Historical Milestones
export const historicalMilestones = pgTable("historical_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Flag"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHistoricalMilestoneSchema = createInsertSchema(historicalMilestones).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertHistoricalMilestone = z.infer<typeof insertHistoricalMilestoneSchema>;
export type HistoricalMilestone = typeof historicalMilestones.$inferSelect;

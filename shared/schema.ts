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
  heroDescription: text("hero_description").default("Honor, disciplina y patriotismo. Formando jóvenes costarricenses con pasos chilenos adaptados a nuestra cultura nacional."),
  logoUrl: text("logo_url"),
  logoS3Key: text("logo_s3_key"),
  faviconUrl: text("favicon_url"),
  faviconS3Key: text("favicon_s3_key"),
  contactEmail: text("contact_email").default("cuerpo.banderas@liceocostarica.ed.cr"),
  contactPhone: text("contact_phone").default("+506 2221-9358"),
  address: text("address").default("Liceo de Costa Rica\nAvenida 6, Calle 7-9\nSan José, Costa Rica"),
  trainingSchedule: text("training_schedule").default("Martes y Jueves, 2:00 PM - 4:00 PM"),
  trainingLocation: text("training_location").default("Patio principal del Liceo"),
  ceremoniesSchedule: text("ceremonies_schedule").default("Fechas patrias y eventos institucionales"),
  ceremoniesNotes: text("ceremonies_notes").default("Se coordinan con anticipación"),
  meetingsSchedule: text("meetings_schedule").default("Viernes, 3:00 PM - 4:00 PM"),
  meetingsLocation: text("meetings_location").default("Aula de coordinación"),
  admissionRequirements: text("admission_requirements").array().default(sql`ARRAY['Ser estudiante activo del Liceo de Costa Rica', 'Mantener promedio académico mínimo de 80', 'Disponibilidad para entrenamientos regulares', 'Compromiso con los valores institucionales', 'Participación en ceremonias patrias']::text[]`),
  footerDescription: text("footer_description").default("Formando jóvenes costarricenses con valores patrióticos, disciplina y honor desde 1951. Una tradición de más de 70 años al servicio de la patria."),
  missionStatement: text("mission_statement").default("Formar estudiantes con valores patrióticos, disciplina militar y amor por Costa Rica, manteniendo viva la tradición de honor que nos ha caracterizado por más de siete décadas."),
  leadershipTitle: text("leadership_title").default("Tradición de Liderazgo"),
  leadershipDescription: text("leadership_description").default("Desde 1951, el Cuerpo de Banderas ha sido dirigido por estudiantes excepcionales que han demostrado los más altos estándares de disciplina, patriotismo y liderazgo."),
  leadershipImageUrl: text("leadership_image_url"),
  leadershipImageS3Key: text("leadership_image_s3_key"),
  foundingYear: integer("founding_year").notNull().default(1951),
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

// Historical Images
export const historicalImages = pgTable("historical_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  imageS3Key: text("image_s3_key"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHistoricalImageSchema = createInsertSchema(historicalImages).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertHistoricalImage = z.infer<typeof insertHistoricalImageSchema>;
export type HistoricalImage = typeof historicalImages.$inferSelect;

// Shield Values (Honor, Disciplina, etc.)
export const shieldValues = pgTable("shield_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Award"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertShieldValueSchema = createInsertSchema(shieldValues).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertShieldValue = z.infer<typeof insertShieldValueSchema>;
export type ShieldValue = typeof shieldValues.$inferSelect;

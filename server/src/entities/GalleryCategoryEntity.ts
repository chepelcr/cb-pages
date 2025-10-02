import { galleryCategories } from '@shared/schema';

export const GalleryCategoryEntity = galleryCategories;
export type GalleryCategoryEntity = typeof galleryCategories.$inferSelect;

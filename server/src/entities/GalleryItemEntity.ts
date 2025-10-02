import { galleryItems } from '@shared/schema';

export const GalleryItemEntity = galleryItems;
export type GalleryItemEntity = typeof galleryItems.$inferSelect;

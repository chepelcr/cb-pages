import { siteConfig } from '@shared/schema';

export const SiteConfigEntity = siteConfig;
export type SiteConfigEntity = typeof siteConfig.$inferSelect;

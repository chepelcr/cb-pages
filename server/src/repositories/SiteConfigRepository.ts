import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { SiteConfigEntity } from '../entities';
import type { SiteConfigEntity as SiteConfigType } from '../entities/SiteConfigEntity';

export interface ISiteConfigRepository {
  getConfig(): Promise<SiteConfigType | undefined>;
  updateConfig(id: string, data: Partial<SiteConfigType>): Promise<SiteConfigType | undefined>;
  createConfig(data: Omit<SiteConfigType, 'id' | 'updatedAt'>): Promise<SiteConfigType>;
}

export class SiteConfigRepository implements ISiteConfigRepository {
  async getConfig(): Promise<SiteConfigType | undefined> {
    const [config] = await db.select().from(SiteConfigEntity).limit(1);
    return config;
  }

  async updateConfig(id: string, data: Partial<SiteConfigType>): Promise<SiteConfigType | undefined> {
    const [updated] = await db
      .update(SiteConfigEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(SiteConfigEntity.id, id))
      .returning();
    return updated;
  }

  async createConfig(data: Omit<SiteConfigType, 'id' | 'updatedAt'>): Promise<SiteConfigType> {
    const [created] = await db
      .insert(SiteConfigEntity)
      .values(data)
      .returning();
    return created;
  }
}

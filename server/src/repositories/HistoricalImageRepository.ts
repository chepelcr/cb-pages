import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { HistoricalImageEntity } from '../entities';
import type { HistoricalImage } from '@shared/schema';

export interface IHistoricalImageRepository {
  getAll(): Promise<HistoricalImage[]>;
  getById(id: string): Promise<HistoricalImage | undefined>;
  create(data: Omit<HistoricalImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<HistoricalImage>;
  update(id: string, data: Partial<HistoricalImage>): Promise<HistoricalImage | undefined>;
  delete(id: string): Promise<boolean>;
}

export class HistoricalImageRepository implements IHistoricalImageRepository {
  async getAll(): Promise<HistoricalImage[]> {
    return await db
      .select()
      .from(HistoricalImageEntity)
      .orderBy(asc(HistoricalImageEntity.displayOrder));
  }

  async getById(id: string): Promise<HistoricalImage | undefined> {
    const [image] = await db
      .select()
      .from(HistoricalImageEntity)
      .where(eq(HistoricalImageEntity.id, id))
      .limit(1);
    return image;
  }

  async create(data: Omit<HistoricalImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<HistoricalImage> {
    const [created] = await db
      .insert(HistoricalImageEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<HistoricalImage>): Promise<HistoricalImage | undefined> {
    const [updated] = await db
      .update(HistoricalImageEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(HistoricalImageEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(HistoricalImageEntity)
      .where(eq(HistoricalImageEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

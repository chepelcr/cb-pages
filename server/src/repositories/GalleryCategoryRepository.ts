import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { GalleryCategoryEntity } from '../entities';
import type { GalleryCategoryEntity as GalleryCategoryType } from '../entities/GalleryCategoryEntity';

export interface IGalleryCategoryRepository {
  getAll(): Promise<GalleryCategoryType[]>;
  getById(id: string): Promise<GalleryCategoryType | undefined>;
  getBySlug(slug: string): Promise<GalleryCategoryType | undefined>;
  create(data: Omit<GalleryCategoryType, 'id' | 'createdAt'>): Promise<GalleryCategoryType>;
  update(id: string, data: Partial<GalleryCategoryType>): Promise<GalleryCategoryType | undefined>;
  delete(id: string): Promise<boolean>;
}

export class GalleryCategoryRepository implements IGalleryCategoryRepository {
  async getAll(): Promise<GalleryCategoryType[]> {
    return await db
      .select()
      .from(GalleryCategoryEntity)
      .orderBy(asc(GalleryCategoryEntity.displayOrder));
  }

  async getById(id: string): Promise<GalleryCategoryType | undefined> {
    const [category] = await db
      .select()
      .from(GalleryCategoryEntity)
      .where(eq(GalleryCategoryEntity.id, id))
      .limit(1);
    return category;
  }

  async getBySlug(slug: string): Promise<GalleryCategoryType | undefined> {
    const [category] = await db
      .select()
      .from(GalleryCategoryEntity)
      .where(eq(GalleryCategoryEntity.slug, slug))
      .limit(1);
    return category;
  }

  async create(data: Omit<GalleryCategoryType, 'id' | 'createdAt'>): Promise<GalleryCategoryType> {
    const [created] = await db
      .insert(GalleryCategoryEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<GalleryCategoryType>): Promise<GalleryCategoryType | undefined> {
    const [updated] = await db
      .update(GalleryCategoryEntity)
      .set(data)
      .where(eq(GalleryCategoryEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(GalleryCategoryEntity)
      .where(eq(GalleryCategoryEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

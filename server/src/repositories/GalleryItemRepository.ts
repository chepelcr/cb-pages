import { db } from '../../db';
import { eq, asc, isNull } from 'drizzle-orm';
import { GalleryItemEntity } from '../entities';
import type { GalleryItemEntity as GalleryItemType } from '../entities/GalleryItemEntity';

export interface IGalleryItemRepository {
  getAll(): Promise<GalleryItemType[]>;
  getById(id: string): Promise<GalleryItemType | undefined>;
  getByCategory(categoryId: string): Promise<GalleryItemType[]>;
  getUncategorized(): Promise<GalleryItemType[]>;
  create(data: Omit<GalleryItemType, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItemType>;
  update(id: string, data: Partial<GalleryItemType>): Promise<GalleryItemType | undefined>;
  delete(id: string): Promise<boolean>;
}

export class GalleryItemRepository implements IGalleryItemRepository {
  async getAll(): Promise<GalleryItemType[]> {
    return await db
      .select()
      .from(GalleryItemEntity)
      .orderBy(asc(GalleryItemEntity.displayOrder));
  }

  async getById(id: string): Promise<GalleryItemType | undefined> {
    const [item] = await db
      .select()
      .from(GalleryItemEntity)
      .where(eq(GalleryItemEntity.id, id))
      .limit(1);
    return item;
  }

  async getByCategory(categoryId: string): Promise<GalleryItemType[]> {
    return await db
      .select()
      .from(GalleryItemEntity)
      .where(eq(GalleryItemEntity.categoryId, categoryId))
      .orderBy(asc(GalleryItemEntity.displayOrder));
  }

  async getUncategorized(): Promise<GalleryItemType[]> {
    return await db
      .select()
      .from(GalleryItemEntity)
      .where(isNull(GalleryItemEntity.categoryId))
      .orderBy(asc(GalleryItemEntity.displayOrder));
  }

  async create(data: Omit<GalleryItemType, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItemType> {
    const [created] = await db
      .insert(GalleryItemEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<GalleryItemType>): Promise<GalleryItemType | undefined> {
    const [updated] = await db
      .update(GalleryItemEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(GalleryItemEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(GalleryItemEntity)
      .where(eq(GalleryItemEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

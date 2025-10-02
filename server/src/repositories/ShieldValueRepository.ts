import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { ShieldValueEntity } from '../entities';
import type { ShieldValue } from '@shared/schema';

export interface IShieldValueRepository {
  getAll(): Promise<ShieldValue[]>;
  getById(id: string): Promise<ShieldValue | undefined>;
  create(data: Omit<ShieldValue, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShieldValue>;
  update(id: string, data: Partial<ShieldValue>): Promise<ShieldValue | undefined>;
  delete(id: string): Promise<boolean>;
}

export class ShieldValueRepository implements IShieldValueRepository {
  async getAll(): Promise<ShieldValue[]> {
    return await db
      .select()
      .from(ShieldValueEntity)
      .orderBy(asc(ShieldValueEntity.displayOrder));
  }

  async getById(id: string): Promise<ShieldValue | undefined> {
    const [value] = await db
      .select()
      .from(ShieldValueEntity)
      .where(eq(ShieldValueEntity.id, id))
      .limit(1);
    return value;
  }

  async create(data: Omit<ShieldValue, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShieldValue> {
    const [created] = await db
      .insert(ShieldValueEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<ShieldValue>): Promise<ShieldValue | undefined> {
    const [updated] = await db
      .update(ShieldValueEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ShieldValueEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(ShieldValueEntity)
      .where(eq(ShieldValueEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

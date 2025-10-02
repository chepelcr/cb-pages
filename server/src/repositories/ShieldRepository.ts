import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { ShieldEntity } from '../entities';
import type { ShieldEntity as ShieldType } from '../entities/ShieldEntity';

export interface IShieldRepository {
  getAll(): Promise<ShieldType[]>;
  getById(id: string): Promise<ShieldType | undefined>;
  getMainShield(): Promise<ShieldType | undefined>;
  create(data: Omit<ShieldType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShieldType>;
  update(id: string, data: Partial<ShieldType>): Promise<ShieldType | undefined>;
  delete(id: string): Promise<boolean>;
  clearMainShield(): Promise<void>;
}

export class ShieldRepository implements IShieldRepository {
  async getAll(): Promise<ShieldType[]> {
    return await db
      .select()
      .from(ShieldEntity)
      .orderBy(asc(ShieldEntity.displayOrder));
  }

  async getById(id: string): Promise<ShieldType | undefined> {
    const [shield] = await db
      .select()
      .from(ShieldEntity)
      .where(eq(ShieldEntity.id, id))
      .limit(1);
    return shield;
  }

  async getMainShield(): Promise<ShieldType | undefined> {
    const [shield] = await db
      .select()
      .from(ShieldEntity)
      .where(eq(ShieldEntity.isMainShield, true))
      .limit(1);
    return shield;
  }

  async create(data: Omit<ShieldType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShieldType> {
    if (data.isMainShield) {
      await this.clearMainShield();
    }
    
    const [created] = await db
      .insert(ShieldEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<ShieldType>): Promise<ShieldType | undefined> {
    if (data.isMainShield) {
      await this.clearMainShield();
    }
    
    const [updated] = await db
      .update(ShieldEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ShieldEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(ShieldEntity)
      .where(eq(ShieldEntity.id, id))
      .returning();
    return result.length > 0;
  }

  async clearMainShield(): Promise<void> {
    await db
      .update(ShieldEntity)
      .set({ isMainShield: false })
      .where(eq(ShieldEntity.isMainShield, true));
  }
}

import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { HistoricalMilestoneEntity } from '../entities';
import type { HistoricalMilestoneEntity as HistoricalMilestoneType } from '../entities/HistoricalMilestoneEntity';

export interface IHistoryRepository {
  getAll(): Promise<HistoricalMilestoneType[]>;
  getById(id: string): Promise<HistoricalMilestoneType | undefined>;
  create(data: Omit<HistoricalMilestoneType, 'id' | 'createdAt' | 'updatedAt'>): Promise<HistoricalMilestoneType>;
  update(id: string, data: Partial<HistoricalMilestoneType>): Promise<HistoricalMilestoneType | undefined>;
  delete(id: string): Promise<boolean>;
}

export class HistoryRepository implements IHistoryRepository {
  async getAll(): Promise<HistoricalMilestoneType[]> {
    return await db
      .select()
      .from(HistoricalMilestoneEntity)
      .orderBy(asc(HistoricalMilestoneEntity.displayOrder));
  }

  async getById(id: string): Promise<HistoricalMilestoneType | undefined> {
    const [milestone] = await db
      .select()
      .from(HistoricalMilestoneEntity)
      .where(eq(HistoricalMilestoneEntity.id, id))
      .limit(1);
    return milestone;
  }

  async create(data: Omit<HistoricalMilestoneType, 'id' | 'createdAt' | 'updatedAt'>): Promise<HistoricalMilestoneType> {
    const [created] = await db
      .insert(HistoricalMilestoneEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<HistoricalMilestoneType>): Promise<HistoricalMilestoneType | undefined> {
    const [updated] = await db
      .update(HistoricalMilestoneEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(HistoricalMilestoneEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(HistoricalMilestoneEntity)
      .where(eq(HistoricalMilestoneEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

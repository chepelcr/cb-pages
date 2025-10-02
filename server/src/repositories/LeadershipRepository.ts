import { db } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { LeadershipPeriodEntity } from '../entities';
import type { LeadershipPeriodEntity as LeadershipPeriodType } from '../entities/LeadershipPeriodEntity';

export interface ILeadershipRepository {
  getAll(): Promise<LeadershipPeriodType[]>;
  getById(id: string): Promise<LeadershipPeriodType | undefined>;
  create(data: Omit<LeadershipPeriodType, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadershipPeriodType>;
  update(id: string, data: Partial<LeadershipPeriodType>): Promise<LeadershipPeriodType | undefined>;
  delete(id: string): Promise<boolean>;
}

export class LeadershipRepository implements ILeadershipRepository {
  async getAll(): Promise<LeadershipPeriodType[]> {
    return await db
      .select()
      .from(LeadershipPeriodEntity)
      .orderBy(asc(LeadershipPeriodEntity.displayOrder));
  }

  async getById(id: string): Promise<LeadershipPeriodType | undefined> {
    const [period] = await db
      .select()
      .from(LeadershipPeriodEntity)
      .where(eq(LeadershipPeriodEntity.id, id))
      .limit(1);
    return period;
  }

  async create(data: Omit<LeadershipPeriodType, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadershipPeriodType> {
    const [created] = await db
      .insert(LeadershipPeriodEntity)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: Partial<LeadershipPeriodType>): Promise<LeadershipPeriodType | undefined> {
    const [updated] = await db
      .update(LeadershipPeriodEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(LeadershipPeriodEntity.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(LeadershipPeriodEntity)
      .where(eq(LeadershipPeriodEntity.id, id))
      .returning();
    return result.length > 0;
  }
}

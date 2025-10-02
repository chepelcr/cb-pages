import { LeadershipRepository } from '../repositories/LeadershipRepository';
import type { LeadershipPeriod, InsertLeadershipPeriod } from '@shared/schema';

export class LeadershipService {
  private repository: LeadershipRepository;

  constructor() {
    this.repository = new LeadershipRepository();
  }

  async getAll(): Promise<LeadershipPeriod[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<LeadershipPeriod | undefined> {
    return this.repository.getById(id);
  }

  async create(data: InsertLeadershipPeriod): Promise<LeadershipPeriod> {
    return this.repository.create(data as any);
  }

  async update(id: string, data: Partial<LeadershipPeriod>): Promise<LeadershipPeriod | undefined> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>): Promise<void> {
    for (const item of items) {
      await this.repository.update(item.id, { displayOrder: item.displayOrder });
    }
  }
}

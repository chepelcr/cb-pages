import { HistoryRepository } from '../repositories/HistoryRepository';
import type { HistoricalMilestone, InsertHistoricalMilestone } from '@shared/schema';

export class HistoryService {
  private repository: HistoryRepository;

  constructor() {
    this.repository = new HistoryRepository();
  }

  async getAll(): Promise<HistoricalMilestone[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<HistoricalMilestone | undefined> {
    return this.repository.getById(id);
  }

  async create(data: InsertHistoricalMilestone): Promise<HistoricalMilestone> {
    return this.repository.create(data as any);
  }

  async update(id: string, data: Partial<HistoricalMilestone>): Promise<HistoricalMilestone | undefined> {
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

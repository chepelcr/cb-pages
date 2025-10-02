import { HistoricalImageRepository } from '../repositories/HistoricalImageRepository';
import type { HistoricalImage, InsertHistoricalImage } from '@shared/schema';

export class HistoricalImageService {
  private repository: HistoricalImageRepository;

  constructor() {
    this.repository = new HistoricalImageRepository();
  }

  async getAll(): Promise<HistoricalImage[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<HistoricalImage | undefined> {
    return this.repository.getById(id);
  }

  async create(data: InsertHistoricalImage): Promise<HistoricalImage> {
    return this.repository.create(data as any);
  }

  async update(id: string, data: Partial<HistoricalImage>): Promise<HistoricalImage | undefined> {
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

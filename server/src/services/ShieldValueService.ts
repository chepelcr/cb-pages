import { ShieldValueRepository } from '../repositories/ShieldValueRepository';
import type { ShieldValue, InsertShieldValue } from '@shared/schema';

export class ShieldValueService {
  private repository: ShieldValueRepository;

  constructor() {
    this.repository = new ShieldValueRepository();
  }

  async getAll(): Promise<ShieldValue[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<ShieldValue | undefined> {
    return this.repository.getById(id);
  }

  async create(data: InsertShieldValue): Promise<ShieldValue> {
    return this.repository.create(data as any);
  }

  async update(id: string, data: Partial<ShieldValue>): Promise<ShieldValue | undefined> {
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

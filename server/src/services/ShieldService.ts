import { ShieldRepository } from '../repositories/ShieldRepository';
import type { Shield, InsertShield } from '@shared/schema';

export class ShieldService {
  private repository: ShieldRepository;

  constructor() {
    this.repository = new ShieldRepository();
  }

  async getAll(): Promise<Shield[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<Shield | undefined> {
    return this.repository.getById(id);
  }

  async getMainShield(): Promise<Shield | undefined> {
    return this.repository.getMainShield();
  }

  async create(data: InsertShield): Promise<Shield> {
    if (data.isMainShield) {
      await this.repository.clearMainShield();
    }
    return this.repository.create(data as any);
  }

  async update(id: string, data: Partial<Shield>): Promise<Shield | undefined> {
    if (data.isMainShield) {
      await this.repository.clearMainShield();
    }
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

  async setMainShield(id: string): Promise<Shield | undefined> {
    await this.repository.clearMainShield();
    return this.repository.update(id, { isMainShield: true });
  }
}

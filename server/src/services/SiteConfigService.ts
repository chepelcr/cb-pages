import { SiteConfigRepository } from '../repositories/SiteConfigRepository';
import type { SiteConfig } from '@shared/schema';

export class SiteConfigService {
  private repository: SiteConfigRepository;

  constructor() {
    this.repository = new SiteConfigRepository();
  }

  async getConfig(): Promise<SiteConfig | undefined> {
    return this.repository.getConfig();
  }

  async updateConfig(data: Partial<SiteConfig>): Promise<SiteConfig> {
    const existing = await this.repository.getConfig();
    if (existing) {
      const updated = await this.repository.updateConfig(existing.id, data);
      if (!updated) {
        throw new Error('Failed to update site configuration');
      }
      return updated;
    } else {
      return this.repository.createConfig(data as any);
    }
  }
}

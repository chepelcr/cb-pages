import { GalleryCategoryRepository } from '../repositories/GalleryCategoryRepository';
import type { GalleryCategory, InsertGalleryCategory } from '@shared/schema';

export class GalleryCategoryService {
  private repository: GalleryCategoryRepository;

  constructor() {
    this.repository = new GalleryCategoryRepository();
  }

  async getAll(): Promise<GalleryCategory[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<GalleryCategory | undefined> {
    return this.repository.getById(id);
  }

  async getBySlug(slug: string): Promise<GalleryCategory | undefined> {
    return this.repository.getBySlug(slug);
  }

  async create(data: InsertGalleryCategory): Promise<GalleryCategory> {
    const categoryData = { ...data };
    if (!categoryData.slug) {
      categoryData.slug = this.generateSlug(categoryData.name);
    }
    return this.repository.create(categoryData as any);
  }

  async update(id: string, data: Partial<GalleryCategory>): Promise<GalleryCategory | undefined> {
    if (data.name && !data.slug) {
      data.slug = this.generateSlug(data.name);
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

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

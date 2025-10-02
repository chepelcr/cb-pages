import { GalleryItemRepository } from '../repositories/GalleryItemRepository';
import { ImageUploadService } from './ImageUploadService';
import type { GalleryItem, InsertGalleryItem } from '@shared/schema';

export class GalleryService {
  private repository: GalleryItemRepository;
  private imageUploadService: ImageUploadService;

  constructor() {
    this.repository = new GalleryItemRepository();
    this.imageUploadService = new ImageUploadService();
  }

  async getAll(): Promise<GalleryItem[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<GalleryItem | undefined> {
    return this.repository.getById(id);
  }

  async getByCategory(categoryId: string): Promise<GalleryItem[]> {
    return this.repository.getByCategory(categoryId);
  }

  async getUncategorized(): Promise<GalleryItem[]> {
    return this.repository.getUncategorized();
  }

  async create(data: InsertGalleryItem): Promise<GalleryItem> {
    return this.repository.create(data as any);
  }

  async createWithImage(
    data: Omit<InsertGalleryItem, 'imageUrl' | 'thumbnailUrl'>,
    imageBuffer: Buffer,
    originalName: string
  ): Promise<GalleryItem> {
    const uploadResult = await this.imageUploadService.uploadImage(
      imageBuffer,
      originalName,
      true
    );

    const galleryItemData: InsertGalleryItem = {
      ...data,
      imageUrl: uploadResult.originalUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
    };

    return this.repository.create(galleryItemData as any);
  }

  async update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem | undefined> {
    return this.repository.update(id, data);
  }

  async updateWithImage(
    id: string,
    data: Partial<Omit<GalleryItem, 'imageUrl' | 'thumbnailUrl'>>,
    imageBuffer: Buffer,
    originalName: string
  ): Promise<GalleryItem | undefined> {
    const existingItem = await this.repository.getById(id);
    if (!existingItem) {
      return undefined;
    }

    const uploadResult = await this.imageUploadService.uploadImage(
      imageBuffer,
      originalName,
      true
    );

    if (existingItem.imageUrl) {
      const oldFilename = existingItem.imageUrl.split('/').pop();
      if (oldFilename) {
        await this.imageUploadService.deleteImage(oldFilename);
      }
    }

    if (existingItem.thumbnailUrl) {
      const oldThumbnail = existingItem.thumbnailUrl.split('/').pop();
      if (oldThumbnail) {
        await this.imageUploadService.deleteImage(oldThumbnail);
      }
    }

    const updateData = {
      ...data,
      imageUrl: uploadResult.originalUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
    };

    return this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    const item = await this.repository.getById(id);
    if (item) {
      if (item.imageUrl) {
        const filename = item.imageUrl.split('/').pop();
        if (filename) {
          await this.imageUploadService.deleteImage(filename);
        }
      }
      if (item.thumbnailUrl) {
        const thumbnail = item.thumbnailUrl.split('/').pop();
        if (thumbnail) {
          await this.imageUploadService.deleteImage(thumbnail);
        }
      }
    }
    return this.repository.delete(id);
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>): Promise<void> {
    for (const item of items) {
      await this.repository.update(item.id, { displayOrder: item.displayOrder });
    }
  }
}

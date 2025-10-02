import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export interface UploadedImage {
  originalUrl: string;
  thumbnailUrl?: string;
  filename: string;
}

export class ImageUploadService {
  private publicDir: string;

  constructor() {
    // Get the public directory from environment or use default
    const publicPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
    if (publicPaths) {
      // Parse the JSON array and get the first path
      const paths = JSON.parse(publicPaths);
      this.publicDir = paths[0] || '/tmp/public';
    } else {
      this.publicDir = '/tmp/public';
    }
  }

  /**
   * Upload an image with optional thumbnail generation
   * @param buffer - Image buffer from file upload
   * @param originalName - Original filename
   * @param generateThumbnail - Whether to generate a thumbnail
   * @returns UploadedImage with URLs
   */
  async uploadImage(
    buffer: Buffer,
    originalName: string,
    generateThumbnail: boolean = false
  ): Promise<UploadedImage> {
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${extension}`;
    const thumbnailFilename = generateThumbnail ? `thumb_${filename}` : undefined;

    // Ensure directory exists
    await mkdir(this.publicDir, { recursive: true });

    // Process and optimize the original image
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    // Save original/optimized image
    const originalPath = join(this.publicDir, filename);
    await writeFile(originalPath, optimizedBuffer);

    const result: UploadedImage = {
      originalUrl: `/public/${filename}`,
      filename: filename,
    };

    // Generate and save thumbnail if requested
    if (generateThumbnail && thumbnailFilename) {
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailPath = join(this.publicDir, thumbnailFilename);
      await writeFile(thumbnailPath, thumbnailBuffer);
      result.thumbnailUrl = `/public/${thumbnailFilename}`;
    }

    return result;
  }

  /**
   * Upload multiple images in batch
   * @param files - Array of {buffer, originalName}
   * @param generateThumbnails - Whether to generate thumbnails
   * @returns Array of UploadedImage
   */
  async uploadImages(
    files: Array<{ buffer: Buffer; originalName: string }>,
    generateThumbnails: boolean = false
  ): Promise<UploadedImage[]> {
    const uploadPromises = files.map(file =>
      this.uploadImage(file.buffer, file.originalName, generateThumbnails)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image file
   * @param filename - Filename to delete
   */
  async deleteImage(filename: string): Promise<void> {
    const { unlink } = await import('fs/promises');
    try {
      const filePath = join(this.publicDir, filename);
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete image ${filename}:`, error);
    }
  }

  /**
   * Get public URL for an uploaded image
   * @param filename - Filename
   * @returns Public URL
   */
  getPublicUrl(filename: string): string {
    return `/public/${filename}`;
  }
}

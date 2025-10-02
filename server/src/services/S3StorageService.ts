import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

export interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class S3StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(config: S3Config) {
    this.bucket = config.bucket;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Generate a presigned URL for uploading a file to S3
   * @param fileType - MIME type of the file
   * @param folder - Optional folder prefix (e.g., 'gallery', 'shields')
   * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
   * @returns Upload URL, file key, and public URL
   */
  async generatePresignedUploadUrl(
    fileType: string,
    folder: string = 'uploads',
    expiresIn: number = 300
  ): Promise<PresignedUploadResult> {
    const extension = this.getExtensionFromMimeType(fileType);
    const filename = `${randomUUID()}${extension}`;
    const fileKey = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: fileType,
      ACL: 'public-read', // Make uploaded objects publicly readable
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
    const publicUrl = this.getPublicUrl(fileKey);

    return {
      uploadUrl,
      fileKey,
      publicUrl,
    };
  }

  /**
   * Generate a presigned URL for downloading a file from S3
   * @param fileKey - S3 object key
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns Download URL
   */
  async generatePresignedDownloadUrl(
    fileKey: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete a file from S3
   * @param fileKey - S3 object key to delete
   */
  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete S3 object ${fileKey}:`, error);
      throw error;
    }
  }

  /**
   * Get the public URL for an S3 object via CloudFront
   * @param fileKey - S3 object key
   * @returns Public CloudFront URL
   */
  getPublicUrl(fileKey: string): string {
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || 'banderas-data.jcampos.dev';
    return `https://${cloudFrontDomain}/${fileKey}`;
  }

  /**
   * Extract file key from S3 URL
   * @param url - S3 URL
   * @returns File key or null if invalid
   */
  extractFileKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.slice(1).join('/');
    } catch {
      return null;
    }
  }

  /**
   * Get file extension from MIME type
   * @param mimeType - MIME type
   * @returns File extension with dot
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    };

    return mimeToExt[mimeType.toLowerCase()] || '.jpg';
  }
}

// Factory function to create S3 storage service
export function createS3StorageService(): S3StorageService {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing AWS configuration. Ensure AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.'
    );
  }

  return new S3StorageService({
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
  });
}

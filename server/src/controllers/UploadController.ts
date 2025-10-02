import { Router, Request, Response } from 'express';
import { createS3StorageService } from '../services/S3StorageService';

const s3Service = createS3StorageService();

export class UploadController {
  getRouter(): Router {
    const router = Router();
    // TODO: Add authentication middleware to protect this endpoint
    // This should only be accessible to authenticated admin users
    router.post('/presigned-url', this.generatePresignedUrl.bind(this));
    return router;
  }

  /**
   * @swagger
   * /api/uploads/presigned-url:
   *   post:
   *     summary: Generate a presigned URL for file upload
   *     tags: [Uploads]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fileType
   *             properties:
   *               fileType:
   *                 type: string
   *                 description: MIME type of the file
   *                 example: image/jpeg
   *               folder:
   *                 type: string
   *                 description: Folder prefix for organizing files
   *                 example: gallery
   *     responses:
   *       200:
   *         description: Presigned URL generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 uploadUrl:
   *                   type: string
   *                   description: Presigned URL for uploading
   *                 fileKey:
   *                   type: string
   *                   description: S3 object key
   *                 publicUrl:
   *                   type: string
   *                   description: Public URL to access the file after upload
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Failed to generate presigned URL
   */
  async generatePresignedUrl(req: Request, res: Response) {
    try {
      const { fileType, folder } = req.body;

      if (!fileType) {
        return res.status(400).json({ error: 'fileType is required' });
      }

      // Validate file type (only images allowed)
      if (!fileType.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed' });
      }

      const result = await s3Service.generatePresignedUploadUrl(
        fileType,
        folder || 'uploads',
        300 // 5 minutes expiration
      );

      res.json(result);
    } catch (error) {
      console.error('Failed to generate presigned URL:', error);
      res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
  }
}

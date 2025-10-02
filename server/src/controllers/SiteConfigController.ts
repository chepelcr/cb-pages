import { Router, Request, Response } from 'express';
import multer from 'multer';
import { siteConfigService } from '../dependency_injection';
import { ImageUploadService } from '../services/ImageUploadService';
import { createS3StorageService } from '../services/S3StorageService';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const imageUploadService = new ImageUploadService();

export class SiteConfigController {
  getRouter(): Router {
    const router = Router();
    router.get('/', this.getConfig.bind(this));
    router.put('/', upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'favicon', maxCount: 1 }
    ]), this.updateConfig.bind(this));
    router.put('/with-url', this.updateConfigWithUrl.bind(this));
    return router;
  }

  /**
   * @swagger
   * /api/admin/site-config:
   *   get:
   *     summary: Get site configuration
   *     tags: [Admin - Site Config]
   *     responses:
   *       200:
   *         description: Site configuration
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 siteName:
   *                   type: string
   *                 siteSubtitle:
   *                   type: string
   *                 logoUrl:
   *                   type: string
   *                   nullable: true
   *                 faviconUrl:
   *                   type: string
   *                   nullable: true
   *                 contactEmail:
   *                   type: string
   *                 contactPhone:
   *                   type: string
   *                 address:
   *                   type: string
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       500:
   *         description: Failed to get configuration
   */
  async getConfig(req: Request, res: Response) {
    try {
      const config = await siteConfigService.getConfig();
      res.json(config || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to get configuration" });
    }
  }

  /**
   * @swagger
   * /api/admin/site-config:
   *   put:
   *     summary: Update site configuration
   *     tags: [Admin - Site Config]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               siteName:
   *                 type: string
   *               siteSubtitle:
   *                 type: string
   *               logoUrl:
   *                 type: string
   *               faviconUrl:
   *                 type: string
   *               contactEmail:
   *                 type: string
   *               contactPhone:
   *                 type: string
   *               address:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated configuration
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       500:
   *         description: Failed to update configuration
   */
  async updateConfig(req: Request, res: Response) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const data: any = { ...req.body };

      // Handle logo removal
      if (req.body.removeLogo === 'true') {
        data.logoUrl = null;
      }
      // Handle logo upload if provided (overrides removal)
      else if (files && files.logo && files.logo[0]) {
        const logoResult = await imageUploadService.uploadImage(
          files.logo[0].buffer,
          files.logo[0].originalname,
          false // Don't generate thumbnail
        );
        data.logoUrl = logoResult.originalUrl;
      }

      // Handle favicon removal
      if (req.body.removeFavicon === 'true') {
        data.faviconUrl = null;
      }
      // Handle favicon upload if provided (overrides removal)
      else if (files && files.favicon && files.favicon[0]) {
        const faviconResult = await imageUploadService.uploadImage(
          files.favicon[0].buffer,
          files.favicon[0].originalname,
          false // Don't generate thumbnail
        );
        data.faviconUrl = faviconResult.originalUrl;
      }

      // Remove the removal flags from data before sending to service
      delete data.removeLogo;
      delete data.removeFavicon;

      const updated = await siteConfigService.updateConfig(data);
      res.json(updated);
    } catch (error) {
      console.error('Site config update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: "Failed to update configuration",
        details: errorMessage
      });
    }
  }

  /**
   * @swagger
   * /api/admin/site-config/with-url:
   *   put:
   *     summary: Update site configuration with S3 URLs
   *     tags: [Admin - Site Config]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               siteName:
   *                 type: string
   *               siteSubtitle:
   *                 type: string
   *               logoUrl:
   *                 type: string
   *               faviconUrl:
   *                 type: string
   *               contactEmail:
   *                 type: string
   *               contactPhone:
   *                 type: string
   *               address:
   *                 type: string
   *               removeLogo:
   *                 type: boolean
   *               removeFavicon:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Updated configuration
   *       400:
   *         description: Invalid image URL
   *       500:
   *         description: Failed to update configuration
   */
  async updateConfigWithUrl(req: Request, res: Response) {
    try {
      const { logoUrl, faviconUrl, removeLogo, removeFavicon, ...restData } = req.body;
      const data: any = { ...restData };

      const { validateAndParseS3Url } = await import('../utils/s3ValidationHelper');
      const existingConfig = await siteConfigService.getConfig();

      // Track S3 keys to delete after successful update
      const s3KeysToDelete: string[] = [];

      // Validate and handle logo
      if (removeLogo) {
        data.logoUrl = null;
        data.logoS3Key = null;
        // Schedule deletion after update succeeds
        if (existingConfig && existingConfig.logoS3Key) {
          s3KeysToDelete.push(existingConfig.logoS3Key);
        }
      } else if (logoUrl) {
        const parsedLogoUrl = validateAndParseS3Url(logoUrl);
        if (!parsedLogoUrl) {
          return res.status(400).json({ 
            error: "Invalid logo URL - must be a valid HTTPS URL from the configured S3 bucket" 
          });
        }
        data.logoUrl = logoUrl;
        data.logoS3Key = parsedLogoUrl.key;
        
        // Schedule old logo deletion if it's different
        if (existingConfig && existingConfig.logoS3Key && existingConfig.logoS3Key !== parsedLogoUrl.key) {
          s3KeysToDelete.push(existingConfig.logoS3Key);
        }
      }

      // Validate and handle favicon
      if (removeFavicon) {
        data.faviconUrl = null;
        data.faviconS3Key = null;
        // Schedule deletion after update succeeds
        if (existingConfig && existingConfig.faviconS3Key) {
          s3KeysToDelete.push(existingConfig.faviconS3Key);
        }
      } else if (faviconUrl) {
        const parsedFaviconUrl = validateAndParseS3Url(faviconUrl);
        if (!parsedFaviconUrl) {
          return res.status(400).json({ 
            error: "Invalid favicon URL - must be a valid HTTPS URL from the configured S3 bucket" 
          });
        }
        data.faviconUrl = faviconUrl;
        data.faviconS3Key = parsedFaviconUrl.key;
        
        // Schedule old favicon deletion if it's different
        if (existingConfig && existingConfig.faviconS3Key && existingConfig.faviconS3Key !== parsedFaviconUrl.key) {
          s3KeysToDelete.push(existingConfig.faviconS3Key);
        }
      }

      // Update database first
      const updated = await siteConfigService.updateConfig(data);
      
      // Delete old S3 files only after successful update
      if (s3KeysToDelete.length > 0) {
        const s3Service = createS3StorageService();
        for (const key of s3KeysToDelete) {
          try {
            await s3Service.deleteFile(key);
          } catch (s3Error) {
            console.error(`Failed to delete old S3 file ${key}:`, s3Error);
            // Database update succeeded, so continue despite S3 cleanup failure
          }
        }
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Site config update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: "Failed to update configuration",
        details: errorMessage
      });
    }
  }
}

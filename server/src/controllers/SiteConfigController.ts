import { Router, Request, Response } from 'express';
import multer from 'multer';
import { siteConfigService } from '../dependency_injection';
import { ImageUploadService } from '../services/ImageUploadService';

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
}

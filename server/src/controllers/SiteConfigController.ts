import { Router, Request, Response } from 'express';
import { siteConfigService } from '../dependency_injection';

export class SiteConfigController {
  getRouter(): Router {
    const router = Router();
    router.get('/', this.getConfig.bind(this));
    router.put('/', this.updateConfig.bind(this));
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
      const updated = await siteConfigService.updateConfig(req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update configuration" });
    }
  }
}

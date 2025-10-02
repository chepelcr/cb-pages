import { Router, Request, Response } from 'express';
import { shieldService } from '../dependency_injection';

export class ShieldController {
  getRouter(): Router {
    const router = Router();
    router.get('/', this.getAll.bind(this));
    router.get('/main', this.getMainShield.bind(this));
    router.get('/:id', this.getById.bind(this));
    router.post('/', this.create.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
    router.post('/reorder', this.reorder.bind(this));
    router.put('/:id/set-main', this.setMainShield.bind(this));
    return router;
  }

  /**
   * @swagger
   * /api/admin/shields:
   *   get:
   *     summary: Get all shields
   *     tags: [Admin - Shields]
   *     responses:
   *       200:
   *         description: List of shields
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   title:
   *                     type: string
   *                   description:
   *                     type: string
   *                   imageUrl:
   *                     type: string
   *                   symbolism:
   *                     type: string
   *                     nullable: true
   *                   displayOrder:
   *                     type: integer
   *                   isMainShield:
   *                     type: boolean
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Failed to get shields
   */
  async getAll(req: Request, res: Response) {
    try {
      const shields = await shieldService.getAll();
      res.json(shields);
    } catch (error) {
      res.status(500).json({ error: "Failed to get shields" });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/main:
   *   get:
   *     summary: Get main shield
   *     tags: [Admin - Shields]
   *     responses:
   *       200:
   *         description: Main shield
   *       404:
   *         description: Main shield not found
   *       500:
   *         description: Failed to get main shield
   */
  async getMainShield(req: Request, res: Response) {
    try {
      const shield = await shieldService.getMainShield();
      if (!shield) {
        return res.status(404).json({ error: "Main shield not found" });
      }
      res.json(shield);
    } catch (error) {
      res.status(500).json({ error: "Failed to get main shield" });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/{id}:
   *   get:
   *     summary: Get shield by ID
   *     tags: [Admin - Shields]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Shield ID
   *     responses:
   *       200:
   *         description: Shield details
   *       404:
   *         description: Shield not found
   *       500:
   *         description: Failed to get shield
   */
  async getById(req: Request, res: Response) {
    try {
      const shield = await shieldService.getById(req.params.id);
      if (!shield) {
        return res.status(404).json({ error: "Shield not found" });
      }
      res.json(shield);
    } catch (error) {
      res.status(500).json({ error: "Failed to get shield" });
    }
  }

  /**
   * @swagger
   * /api/admin/shields:
   *   post:
   *     summary: Create new shield
   *     tags: [Admin - Shields]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - imageUrl
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               symbolism:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *               isMainShield:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Shield created
   *       500:
   *         description: Failed to create shield
   */
  async create(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;
      
      // Validate S3 URL if provided
      if (imageUrl) {
        const { validateAndParseS3Url } = await import('../utils/s3ValidationHelper');
        const parsedUrl = validateAndParseS3Url(imageUrl);
        
        if (!parsedUrl) {
          return res.status(400).json({ 
            error: "Invalid image URL - must be a valid HTTPS URL from the configured S3 bucket" 
          });
        }
      }
      
      const shield = await shieldService.create(req.body);
      res.status(201).json(shield);
    } catch (error) {
      console.error('Failed to create shield:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to create shield", details: errorMessage });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/{id}:
   *   put:
   *     summary: Update shield
   *     tags: [Admin - Shields]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               symbolism:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *               isMainShield:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Shield updated
   *       404:
   *         description: Shield not found
   *       500:
   *         description: Failed to update shield
   */
  async update(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;
      
      // Validate S3 URL if provided
      if (imageUrl) {
        const { validateAndParseS3Url } = await import('../utils/s3ValidationHelper');
        const parsedUrl = validateAndParseS3Url(imageUrl);
        
        if (!parsedUrl) {
          return res.status(400).json({ 
            error: "Invalid image URL - must be a valid HTTPS URL from the configured S3 bucket" 
          });
        }
      }
      
      const shield = await shieldService.update(req.params.id, req.body);
      if (!shield) {
        return res.status(404).json({ error: "Shield not found" });
      }
      res.json(shield);
    } catch (error) {
      console.error('Failed to update shield:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to update shield", details: errorMessage });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/{id}:
   *   delete:
   *     summary: Delete shield
   *     tags: [Admin - Shields]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Shield deleted
   *       404:
   *         description: Shield not found
   *       500:
   *         description: Failed to delete shield
   */
  async delete(req: Request, res: Response) {
    try {
      const success = await shieldService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Shield not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shield" });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/reorder:
   *   post:
   *     summary: Reorder shields
   *     tags: [Admin - Shields]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     displayOrder:
   *                       type: integer
   *     responses:
   *       200:
   *         description: Shields reordered
   *       500:
   *         description: Failed to reorder shields
   */
  async reorder(req: Request, res: Response) {
    try {
      await shieldService.reorder(req.body.items);
      res.json({ message: "Shields reordered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder shields" });
    }
  }

  /**
   * @swagger
   * /api/admin/shields/{id}/set-main:
   *   put:
   *     summary: Set shield as main shield
   *     tags: [Admin - Shields]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Main shield updated
   *       404:
   *         description: Shield not found
   *       500:
   *         description: Failed to set main shield
   */
  async setMainShield(req: Request, res: Response) {
    try {
      const shield = await shieldService.setMainShield(req.params.id);
      if (!shield) {
        return res.status(404).json({ error: "Shield not found" });
      }
      res.json(shield);
    } catch (error) {
      res.status(500).json({ error: "Failed to set main shield" });
    }
  }
}

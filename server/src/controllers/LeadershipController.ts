import { Router, Request, Response } from 'express';
import { leadershipService } from '../dependency_injection';

export class LeadershipController {
  getRouter(): Router {
    const router = Router();
    router.get('/', this.getAll.bind(this));
    router.get('/:id', this.getById.bind(this));
    router.post('/', this.create.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
    router.post('/reorder', this.reorder.bind(this));
    return router;
  }

  /**
   * @swagger
   * /api/admin/leadership:
   *   get:
   *     summary: Get all leadership periods
   *     tags: [Admin - Leadership]
   *     responses:
   *       200:
   *         description: List of leadership periods
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   year:
   *                     type: string
   *                   jefatura:
   *                     type: string
   *                   segundaVoz:
   *                     type: string
   *                     nullable: true
   *                   imageUrl:
   *                     type: string
   *                     nullable: true
   *                   displayOrder:
   *                     type: integer
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Failed to get leadership periods
   */
  async getAll(req: Request, res: Response) {
    try {
      const periods = await leadershipService.getAll();
      res.json(periods);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leadership periods" });
    }
  }

  /**
   * @swagger
   * /api/admin/leadership/{id}:
   *   get:
   *     summary: Get leadership period by ID
   *     tags: [Admin - Leadership]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Leadership period ID
   *     responses:
   *       200:
   *         description: Leadership period
   *       404:
   *         description: Leadership period not found
   *       500:
   *         description: Failed to get leadership period
   */
  async getById(req: Request, res: Response) {
    try {
      const period = await leadershipService.getById(req.params.id);
      if (!period) {
        return res.status(404).json({ error: "Leadership period not found" });
      }
      res.json(period);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leadership period" });
    }
  }

  /**
   * @swagger
   * /api/admin/leadership:
   *   post:
   *     summary: Create new leadership period
   *     tags: [Admin - Leadership]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - year
   *               - jefatura
   *             properties:
   *               year:
   *                 type: string
   *               jefatura:
   *                 type: string
   *               segundaVoz:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Leadership period created
   *       500:
   *         description: Failed to create leadership period
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
      
      const period = await leadershipService.create(req.body);
      res.status(201).json(period);
    } catch (error) {
      console.error('Failed to create leadership period:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to create leadership period", details: errorMessage });
    }
  }

  /**
   * @swagger
   * /api/admin/leadership/{id}:
   *   put:
   *     summary: Update leadership period
   *     tags: [Admin - Leadership]
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
   *               year:
   *                 type: string
   *               jefatura:
   *                 type: string
   *               segundaVoz:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Leadership period updated
   *       404:
   *         description: Leadership period not found
   *       500:
   *         description: Failed to update leadership period
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
      
      const period = await leadershipService.update(req.params.id, req.body);
      if (!period) {
        return res.status(404).json({ error: "Leadership period not found" });
      }
      res.json(period);
    } catch (error) {
      console.error('Failed to update leadership period:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to update leadership period", details: errorMessage });
    }
  }

  /**
   * @swagger
   * /api/admin/leadership/{id}:
   *   delete:
   *     summary: Delete leadership period
   *     tags: [Admin - Leadership]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Leadership period deleted
   *       404:
   *         description: Leadership period not found
   *       500:
   *         description: Failed to delete leadership period
   */
  async delete(req: Request, res: Response) {
    try {
      const success = await leadershipService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Leadership period not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete leadership period" });
    }
  }

  /**
   * @swagger
   * /api/admin/leadership/reorder:
   *   post:
   *     summary: Reorder leadership periods
   *     tags: [Admin - Leadership]
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
   *         description: Leadership periods reordered
   *       500:
   *         description: Failed to reorder leadership periods
   */
  async reorder(req: Request, res: Response) {
    try {
      await leadershipService.reorder(req.body.items);
      res.json({ message: "Leadership periods reordered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder leadership periods" });
    }
  }
}

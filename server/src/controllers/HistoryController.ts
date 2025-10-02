import { Router, Request, Response } from 'express';
import { historyService } from '../dependency_injection';

export class HistoryController {
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
   * /api/admin/history:
   *   get:
   *     summary: Get all historical milestones
   *     tags: [Admin - History]
   *     responses:
   *       200:
   *         description: List of historical milestones
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
   *                   title:
   *                     type: string
   *                   description:
   *                     type: string
   *                   iconName:
   *                     type: string
   *                   displayOrder:
   *                     type: integer
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Failed to get historical milestones
   */
  async getAll(req: Request, res: Response) {
    try {
      const milestones = await historyService.getAll();
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ error: "Failed to get historical milestones" });
    }
  }

  /**
   * @swagger
   * /api/admin/history/{id}:
   *   get:
   *     summary: Get historical milestone by ID
   *     tags: [Admin - History]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Historical milestone ID
   *     responses:
   *       200:
   *         description: Historical milestone
   *       404:
   *         description: Historical milestone not found
   *       500:
   *         description: Failed to get historical milestone
   */
  async getById(req: Request, res: Response) {
    try {
      const milestone = await historyService.getById(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: "Historical milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to get historical milestone" });
    }
  }

  /**
   * @swagger
   * /api/admin/history:
   *   post:
   *     summary: Create new historical milestone
   *     tags: [Admin - History]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - year
   *               - title
   *               - description
   *             properties:
   *               year:
   *                 type: string
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               iconName:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Historical milestone created
   *       500:
   *         description: Failed to create historical milestone
   */
  async create(req: Request, res: Response) {
    try {
      const milestone = await historyService.create(req.body);
      res.status(201).json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to create historical milestone" });
    }
  }

  /**
   * @swagger
   * /api/admin/history/{id}:
   *   put:
   *     summary: Update historical milestone
   *     tags: [Admin - History]
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
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               iconName:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Historical milestone updated
   *       404:
   *         description: Historical milestone not found
   *       500:
   *         description: Failed to update historical milestone
   */
  async update(req: Request, res: Response) {
    try {
      const milestone = await historyService.update(req.params.id, req.body);
      if (!milestone) {
        return res.status(404).json({ error: "Historical milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to update historical milestone" });
    }
  }

  /**
   * @swagger
   * /api/admin/history/{id}:
   *   delete:
   *     summary: Delete historical milestone
   *     tags: [Admin - History]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Historical milestone deleted
   *       404:
   *         description: Historical milestone not found
   *       500:
   *         description: Failed to delete historical milestone
   */
  async delete(req: Request, res: Response) {
    try {
      const success = await historyService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Historical milestone not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete historical milestone" });
    }
  }

  /**
   * @swagger
   * /api/admin/history/reorder:
   *   post:
   *     summary: Reorder historical milestones
   *     tags: [Admin - History]
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
   *         description: Historical milestones reordered
   *       500:
   *         description: Failed to reorder historical milestones
   */
  async reorder(req: Request, res: Response) {
    try {
      await historyService.reorder(req.body.items);
      res.json({ message: "Historical milestones reordered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder historical milestones" });
    }
  }
}

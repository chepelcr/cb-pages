import { Router, Request, Response } from 'express';
import { galleryCategoryService } from '../dependency_injection';

export class GalleryCategoryController {
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
   * /api/admin/gallery-categories:
   *   get:
   *     summary: Get all gallery categories
   *     tags: [Admin - Gallery Categories]
   *     responses:
   *       200:
   *         description: List of gallery categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   slug:
   *                     type: string
   *                   displayOrder:
   *                     type: integer
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Failed to get gallery categories
   */
  async getAll(req: Request, res: Response) {
    try {
      const categories = await galleryCategoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery categories" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery-categories/{id}:
   *   get:
   *     summary: Get gallery category by ID
   *     tags: [Admin - Gallery Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Gallery category ID
   *     responses:
   *       200:
   *         description: Gallery category
   *       404:
   *         description: Gallery category not found
   *       500:
   *         description: Failed to get gallery category
   */
  async getById(req: Request, res: Response) {
    try {
      const category = await galleryCategoryService.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Gallery category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery category" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery-categories:
   *   post:
   *     summary: Create new gallery category
   *     tags: [Admin - Gallery Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               slug:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Gallery category created
   *       500:
   *         description: Failed to create gallery category
   */
  async create(req: Request, res: Response) {
    try {
      const category = await galleryCategoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery category" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery-categories/{id}:
   *   put:
   *     summary: Update gallery category
   *     tags: [Admin - Gallery Categories]
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
   *               name:
   *                 type: string
   *               slug:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Gallery category updated
   *       404:
   *         description: Gallery category not found
   *       500:
   *         description: Failed to update gallery category
   */
  async update(req: Request, res: Response) {
    try {
      const category = await galleryCategoryService.update(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Gallery category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to update gallery category" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery-categories/{id}:
   *   delete:
   *     summary: Delete gallery category
   *     tags: [Admin - Gallery Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Gallery category deleted
   *       404:
   *         description: Gallery category not found
   *       500:
   *         description: Failed to delete gallery category
   */
  async delete(req: Request, res: Response) {
    try {
      const success = await galleryCategoryService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Gallery category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery category" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery-categories/reorder:
   *   post:
   *     summary: Reorder gallery categories
   *     tags: [Admin - Gallery Categories]
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
   *         description: Gallery categories reordered
   *       500:
   *         description: Failed to reorder gallery categories
   */
  async reorder(req: Request, res: Response) {
    try {
      await galleryCategoryService.reorder(req.body.items);
      res.json({ message: "Gallery categories reordered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder gallery categories" });
    }
  }
}

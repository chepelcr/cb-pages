import { Router, Request, Response } from 'express';
import multer from 'multer';
import { galleryService } from '../dependency_injection';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export class GalleryController {
  getRouter(): Router {
    const router = Router();
    router.get('/', this.getAll.bind(this));
    router.get('/category/:categoryId', this.getByCategory.bind(this));
    router.get('/uncategorized', this.getUncategorized.bind(this));
    router.get('/:id', this.getById.bind(this));
    router.post('/', upload.single('image'), this.create.bind(this));
    router.put('/:id', upload.single('image'), this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
    router.post('/reorder', this.reorder.bind(this));
    return router;
  }

  /**
   * @swagger
   * /api/admin/gallery:
   *   get:
   *     summary: Get all gallery items
   *     tags: [Admin - Gallery]
   *     responses:
   *       200:
   *         description: List of gallery items
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
   *                     nullable: true
   *                   imageUrl:
   *                     type: string
   *                   thumbnailUrl:
   *                     type: string
   *                     nullable: true
   *                   categoryId:
   *                     type: string
   *                     nullable: true
   *                   year:
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
   *         description: Failed to get gallery items
   */
  async getAll(req: Request, res: Response) {
    try {
      const items = await galleryService.getAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/category/{categoryId}:
   *   get:
   *     summary: Get gallery items by category
   *     tags: [Admin - Gallery]
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID
   *     responses:
   *       200:
   *         description: List of gallery items in category
   *       500:
   *         description: Failed to get gallery items
   */
  async getByCategory(req: Request, res: Response) {
    try {
      const items = await galleryService.getByCategory(req.params.categoryId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/uncategorized:
   *   get:
   *     summary: Get uncategorized gallery items
   *     tags: [Admin - Gallery]
   *     responses:
   *       200:
   *         description: List of uncategorized gallery items
   *       500:
   *         description: Failed to get gallery items
   */
  async getUncategorized(req: Request, res: Response) {
    try {
      const items = await galleryService.getUncategorized();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/{id}:
   *   get:
   *     summary: Get gallery item by ID
   *     tags: [Admin - Gallery]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Gallery item ID
   *     responses:
   *       200:
   *         description: Gallery item
   *       404:
   *         description: Gallery item not found
   *       500:
   *         description: Failed to get gallery item
   */
  async getById(req: Request, res: Response) {
    try {
      const item = await galleryService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery item" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery:
   *   post:
   *     summary: Create new gallery item with image upload
   *     tags: [Admin - Gallery]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - image
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               categoryId:
   *                 type: string
   *               year:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Gallery item created
   *       400:
   *         description: Image file is required
   *       500:
   *         description: Failed to create gallery item
   */
  async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const { title, description, categoryId, year, displayOrder } = req.body;
      const item = await galleryService.createWithImage(
        {
          title,
          description: description || null,
          categoryId: categoryId || null,
          year: year || null,
          displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        },
        req.file.buffer,
        req.file.originalname
      );
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/{id}:
   *   put:
   *     summary: Update gallery item with optional image upload
   *     tags: [Admin - Gallery]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               categoryId:
   *                 type: string
   *               year:
   *                 type: string
   *               displayOrder:
   *                 type: integer
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Gallery item updated
   *       404:
   *         description: Gallery item not found
   *       500:
   *         description: Failed to update gallery item
   */
  async update(req: Request, res: Response) {
    try {
      const { title, description, categoryId, year, displayOrder } = req.body;
      const updateData: any = {};
      
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description || null;
      if (categoryId !== undefined) updateData.categoryId = categoryId || null;
      if (year !== undefined) updateData.year = year || null;
      if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);

      let item;
      if (req.file) {
        item = await galleryService.updateWithImage(
          req.params.id,
          updateData,
          req.file.buffer,
          req.file.originalname
        );
      } else {
        item = await galleryService.update(req.params.id, updateData);
      }

      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/{id}:
   *   delete:
   *     summary: Delete gallery item
   *     tags: [Admin - Gallery]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Gallery item deleted
   *       404:
   *         description: Gallery item not found
   *       500:
   *         description: Failed to delete gallery item
   */
  async delete(req: Request, res: Response) {
    try {
      const success = await galleryService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/reorder:
   *   post:
   *     summary: Reorder gallery items
   *     tags: [Admin - Gallery]
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
   *         description: Gallery items reordered
   *       500:
   *         description: Failed to reorder gallery items
   */
  async reorder(req: Request, res: Response) {
    try {
      await galleryService.reorder(req.body.items);
      res.json({ message: "Gallery items reordered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder gallery items" });
    }
  }
}

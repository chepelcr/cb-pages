import { Router, Request, Response } from 'express';
import multer from 'multer';
import { galleryService } from '../dependency_injection';
import { createS3StorageService } from '../services/S3StorageService';

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
    router.post('/with-url', this.createWithUrl.bind(this));
    router.put('/:id', upload.single('image'), this.update.bind(this));
    router.put('/:id/with-url', this.updateWithUrl.bind(this));
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
      // Get the item first to retrieve S3 key
      const item = await galleryService.getById(req.params.id);
      
      // Delete from database
      const success = await galleryService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      
      // Delete from S3 if key exists
      if (item && item.imageS3Key) {
        try {
          const s3Service = createS3StorageService();
          await s3Service.deleteFile(item.imageS3Key);
        } catch (s3Error) {
          console.error('Failed to delete S3 image:', s3Error);
          // Continue - database deletion succeeded
        }
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

  /**
   * @swagger
   * /api/admin/gallery/with-url:
   *   post:
   *     summary: Create gallery item with S3 image URL
   *     tags: [Admin - Gallery]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - imageUrl
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
   *               imageUrl:
   *                 type: string
   *                 description: S3 URL of the uploaded image
   *     responses:
   *       201:
   *         description: Gallery item created
   *       400:
   *         description: Image URL is required
   *       500:
   *         description: Failed to create gallery item
   */
  async createWithUrl(req: Request, res: Response) {
    try {
      const { title, description, categoryId, year, displayOrder, imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      // Validate S3 URL and extract key using centralized helper
      const { validateAndParseS3Url } = await import('../utils/s3ValidationHelper');
      const parsedUrl = validateAndParseS3Url(imageUrl);
      
      if (!parsedUrl) {
        return res.status(400).json({ 
          error: "Invalid image URL - must be a valid HTTPS URL from the configured S3 bucket" 
        });
      }

      const item = await galleryService.create({
        title,
        description: description || null,
        categoryId: categoryId || null,
        year: year || null,
        displayOrder: displayOrder || 0,
        imageUrl,
        imageS3Key: parsedUrl.key,
        thumbnailUrl: null,
        thumbnailS3Key: null,
      });

      res.status(201).json(item);
    } catch (error) {
      console.error('Failed to create gallery item with URL:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to create gallery item", details: errorMessage });
    }
  }

  /**
   * @swagger
   * /api/admin/gallery/{id}/with-url:
   *   put:
   *     summary: Update gallery item with S3 image URL
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
   *         application/json:
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
   *               imageUrl:
   *                 type: string
   *                 description: S3 URL of the uploaded image
   *     responses:
   *       200:
   *         description: Gallery item updated
   *       404:
   *         description: Gallery item not found
   *       500:
   *         description: Failed to update gallery item
   */
  async updateWithUrl(req: Request, res: Response) {
    try {
      const { title, description, categoryId, year, displayOrder, imageUrl } = req.body;
      const updateData: any = {};

      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description || null;
      if (categoryId !== undefined) updateData.categoryId = categoryId || null;
      if (year !== undefined) updateData.year = year || null;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
      
      // Validate imageUrl if provided and capture old S3 key
      let oldS3Key: string | null = null;
      if (imageUrl) {
        const { validateAndParseS3Url } = await import('../utils/s3ValidationHelper');
        const parsedUrl = validateAndParseS3Url(imageUrl);
        
        if (!parsedUrl) {
          return res.status(400).json({ 
            error: "Invalid image URL - must be a valid HTTPS URL from the configured S3 bucket" 
          });
        }
        
        updateData.imageUrl = imageUrl;
        updateData.imageS3Key = parsedUrl.key;
        
        // Capture old S3 key before update
        const existingItem = await galleryService.getById(req.params.id);
        if (existingItem && existingItem.imageS3Key && existingItem.imageS3Key !== parsedUrl.key) {
          oldS3Key = existingItem.imageS3Key;
        }
      }

      // Update database first
      const item = await galleryService.update(req.params.id, updateData);

      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      
      // Delete old S3 image only after successful update
      if (oldS3Key) {
        try {
          const s3Service = createS3StorageService();
          await s3Service.deleteFile(oldS3Key);
        } catch (deleteError) {
          console.error('Failed to delete old S3 image:', deleteError);
          // Database update succeeded, so continue despite S3 cleanup failure
        }
      }

      res.json(item);
    } catch (error) {
      console.error('Failed to update gallery item with URL:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to update gallery item", details: errorMessage });
    }
  }
}

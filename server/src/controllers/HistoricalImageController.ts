import { Router, Request, Response } from 'express';
import { HistoricalImageService } from '../services/HistoricalImageService';
import { createS3StorageService } from '../services/S3StorageService';

export class HistoricalImageController {
  private service: HistoricalImageService;

  constructor() {
    this.service = new HistoricalImageService();
  }

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

  async getAll(req: Request, res: Response) {
    try {
      const images = await this.service.getAll();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to get historical images" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const image = await this.service.getById(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Historical image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to get historical image" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const image = await this.service.create(req.body);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to create historical image" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const oldImage = await this.service.getById(req.params.id);
      const image = await this.service.update(req.params.id, req.body);
      
      if (!image) {
        return res.status(404).json({ error: "Historical image not found" });
      }

      if (oldImage && oldImage.imageS3Key && req.body.imageS3Key && oldImage.imageS3Key !== req.body.imageS3Key) {
        try {
          const s3Service = createS3StorageService();
          await s3Service.deleteFile(oldImage.imageS3Key);
        } catch (s3Error) {
          console.error('Failed to delete old image from S3:', s3Error);
        }
      }

      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to update historical image" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const image = await this.service.getById(req.params.id);
      const success = await this.service.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Historical image not found" });
      }

      if (image && image.imageS3Key) {
        try {
          const s3Service = createS3StorageService();
          await s3Service.deleteFile(image.imageS3Key);
        } catch (s3Error) {
          console.error('Failed to delete image from S3:', s3Error);
        }
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete historical image" });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      await this.service.reorder(req.body.items);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder historical images" });
    }
  }
}

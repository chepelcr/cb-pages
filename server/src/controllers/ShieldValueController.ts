import { Router, Request, Response } from 'express';
import { ShieldValueService } from '../services/ShieldValueService';

export class ShieldValueController {
  private service: ShieldValueService;

  constructor() {
    this.service = new ShieldValueService();
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
      const values = await this.service.getAll();
      res.json(values);
    } catch (error) {
      res.status(500).json({ error: "Failed to get shield values" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const value = await this.service.getById(req.params.id);
      if (!value) {
        return res.status(404).json({ error: "Shield value not found" });
      }
      res.json(value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get shield value" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const value = await this.service.create(req.body);
      res.status(201).json(value);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shield value" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const value = await this.service.update(req.params.id, req.body);
      if (!value) {
        return res.status(404).json({ error: "Shield value not found" });
      }
      res.json(value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update shield value" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Shield value not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shield value" });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      await this.service.reorder(req.body.items);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder shield values" });
    }
  }
}

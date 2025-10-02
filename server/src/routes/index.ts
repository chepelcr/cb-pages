import { Express } from 'express';
import { UserController } from '../controllers/UserController';
import { 
    SiteConfigController,
    LeadershipController,
    ShieldController,
    GalleryCategoryController,
    GalleryController,
    HistoryController
} from '../controllers';

export function setupRoutes(app: Express): void {
    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Initialize controllers
    const userController = new UserController();
    const siteConfigController = new SiteConfigController();
    const leadershipController = new LeadershipController();
    const shieldController = new ShieldController();
    const galleryCategoryController = new GalleryCategoryController();
    const galleryController = new GalleryController();
    const historyController = new HistoryController();

    // Setup API routes
    app.use('/api/users', userController.getRouter());
    
    // Admin content management routes
    app.use('/api/admin/site-config', siteConfigController.getRouter());
    app.use('/api/admin/leadership', leadershipController.getRouter());
    app.use('/api/admin/shields', shieldController.getRouter());
    app.use('/api/admin/gallery-categories', galleryCategoryController.getRouter());
    app.use('/api/admin/gallery', galleryController.getRouter());
    app.use('/api/admin/history', historyController.getRouter());
    
    console.log('API routes setup completed');
}
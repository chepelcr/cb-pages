import { Express } from 'express';
import { UserController } from '../controllers/UserController';

export function setupRoutes(app: Express): void {
    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Initialize controllers
    const userController = new UserController();

    // Setup API routes
    app.use('/api/users', userController.getRouter());
    
    console.log('API routes setup completed');
}
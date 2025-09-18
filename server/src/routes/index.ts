import { Express } from 'express';

export function setupRoutes(app: Express): void {
    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // TODO: Add more API routes as needed
    // app.use('/api/users', userRoutes);
    // app.use('/api/configurations', configurationRoutes);
    
    console.log('API routes setup completed');
}
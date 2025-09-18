import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';
import path from 'path';

// Use relative path that works in both environments
const controllersPath = path.resolve(process.cwd(), 'server/src/controllers');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cuerpo de Banderas API',
      version: '1.0.0',
      description: 'API documentation for Cuerpo de Banderas - Liceo de Costa Rica institutional website',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: process.env.VITE_CLOUDFRONT_URL || 'https://cuerpo-banderas.replit.app',
        description: 'Production server',
      },
    ],
  },
  apis: [path.join(controllersPath, '*.ts'), path.join(controllersPath, '*.js')],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  const swaggerOptions = {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  console.log('Swagger documentation setup complete - available at /api-docs');
}
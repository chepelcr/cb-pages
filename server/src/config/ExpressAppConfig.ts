import express, {Express, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import {setupRoutes} from '../routes';
import {setupSwagger} from './swagger';
import {userService} from '../dependency_injection';

export class ExpressAppConfig {
    private app: Express;
    private isLambda: boolean;

    constructor() {
        this.isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
        this.app = this._createApp();
        this._configureMiddleware();
        this._configureRoutes();
        this._configureErrorHandler();
    }

    private _createApp(): Express {
        const app = express();

        // Basic middleware
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));

        return app;
    }

    private _configureMiddleware(): void {
        // CORS configuration
        this.app.use(cors({
            origin: (origin, callback) => {
                // In development, be permissive for Vite and local development
                if (process.env.NODE_ENV === 'development') {
                    return callback(null, true);
                }
                
                const allowedOrigins = this._getAllowedOrigins();
                
                // Allow requests with no origin (mobile apps, Postman, etc.)
                if (!origin) return callback(null, true);
                
                // Check if origin is in allowed list
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                
                // Allow Capacitor origins (starts with capacitor:// or ionic://)
                if (origin && (origin.startsWith('capacitor://') || origin.startsWith('ionic://'))) {
                    return callback(null, true);
                }
                
                callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            exposedHeaders: ['X-Page-Number', 'X-Page-Size', 'X-Total-Elements', 'X-Total-Pages'],
            maxAge: 600
        }));

        // Request logging middleware
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const start = Date.now();
            const path = req.path;
            let capturedJsonResponse: Record<string, any> | undefined = undefined;

            const originalResJson = res.json;
            res.json = function (bodyJson, ...args) {
                capturedJsonResponse = bodyJson;
                return originalResJson.apply(res, [bodyJson, ...args]);
            };

            res.on('finish', () => {
                const duration = Date.now() - start;
                if (path.startsWith('/api')) {
                    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
                    if (capturedJsonResponse) {
                        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
                    }

                    if (logLine.length > 80) {
                        logLine = logLine.slice(0, 79) + '…';
                    }

                    console.log(logLine);
                }
            });

            next();
        });
    }

    private _configureRoutes(): void {
        // Setup Swagger documentation
        setupSwagger(this.app);

        // Setup API routes
        setupRoutes(this.app);
    }

    private _configureErrorHandler(): void {
        this.app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || 'Internal Server Error';

            console.error(`❌ ${req.method} ${req.path} - ${status} ${message}`);
            console.error(err.stack || err);

            res.status(status).json({message});
        });
    }

    private _getAllowedOrigins(): string[] {
        const defaultOrigins = [
            'http://localhost:3000',
            'http://localhost:5000',
            'https://biller.jcampos.dev',
            // Replit development hosts
            'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co',
            'https://' + process.env.REPL_ID + '.id.replit.app',
            // Android app origins
            'https://com.jcampos.biller',
            'capacitor://com.jcampos.biller',
            'ionic://com.jcampos.biller'
        ];

        const cloudfrontUrl = process.env.VITE_CLOUDFRONT_URL;
        if (cloudfrontUrl) {
            defaultOrigins.push(cloudfrontUrl);
        }

        // In development, be more permissive for Vite
        if (process.env.NODE_ENV === 'development') {
            return defaultOrigins.concat([
                'http://localhost:5173', // Vite default
                'http://127.0.0.1:5173',
                'null' // For file:// and data: URLs
            ]);
        }

        return defaultOrigins;
    }

    public async initializeDefaultUser(): Promise<void> {
        try {
            const adminEmail = 'admin@jcampos.dev';
            const existingUser = await userService.getUserByEmail(adminEmail);

            if (!existingUser) {
                console.log('Default admin user setup required - will be handled by first API call');
            } else {
                console.log(`Default admin user exists: ${existingUser.id}`);
            }
        } catch (error) {
            console.error('Error checking default admin user:', error);
        }
    }

    public getApp(): Express {
        return this.app;
    }

    public isRunningInLambda(): boolean {
        return this.isLambda;
    }
}
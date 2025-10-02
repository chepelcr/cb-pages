import { CognitoService, createCognitoService } from './services/CognitoService';
import { TemplateService } from './services/TemplateService';
import { EmailService } from './services/EmailService';
import { UserService } from './services/UserService';
import { SiteConfigService } from './services/SiteConfigService';
import { LeadershipService } from './services/LeadershipService';
import { ShieldService } from './services/ShieldService';
import { GalleryCategoryService } from './services/GalleryCategoryService';
import { GalleryService } from './services/GalleryService';
import { HistoryService } from './services/HistoryService';
import { MemoryUserRepository } from './repositories/UserRepository';

// Initialize repositories
export const userRepository = new MemoryUserRepository();

// Initialize external services
let cognitoServiceInstance: CognitoService | null = null;
try {
  cognitoServiceInstance = createCognitoService();
  console.log('✅ Cognito service initialized');
} catch (error) {
  console.log('⚠️ Cognito service disabled (missing AWS configuration)');
  console.log('🔍 To enable Cognito, set: AWS_COGNITO_USER_POOL_ID, AWS_COGNITO_CLIENT_ID');
}

// Create mock Cognito service for development if AWS not configured
const mockCognitoService: CognitoService = {
  createUser: async () => ({ id: 'mock-id', email: 'mock@example.com', userName: 'mock-user' }),
  createUserDetailed: async () => ({ username: 'mock', email: 'mock@example.com', sub: 'mock-sub' }),
  updateUserAttributes: async () => {},
  getUser: async () => null,
  initiatePasswordReset: async () => {},
  confirmPasswordReset: async () => {},
  validateTokenFormat: () => false,
  extractUserFromToken: () => null,
} as any;

export const cognitoService = cognitoServiceInstance || mockCognitoService;

// Initialize template and email services
export const templateService = new TemplateService();
export const emailService = new EmailService();

// Initialize user service (depends on other services)
export const userService = new UserService();

// Initialize content management services
export const siteConfigService = new SiteConfigService();
export const leadershipService = new LeadershipService();
export const shieldService = new ShieldService();
export const galleryCategoryService = new GalleryCategoryService();
export const galleryService = new GalleryService();
export const historyService = new HistoryService();

console.log('Dependency injection container initialized');
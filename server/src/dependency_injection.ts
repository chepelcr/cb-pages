import { CognitoService, createCognitoService } from './services/CognitoService';
import { TemplateService } from './services/TemplateService';
import { EmailService } from './services/EmailService';
import { UserService } from './services/UserService';
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

console.log('Dependency injection container initialized');
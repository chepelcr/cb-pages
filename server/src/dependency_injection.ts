import { UserService } from './services/UserService';

// Initialize services
export const userService = new UserService();

// TODO: Add other services as they are implemented
// export const cognitoService = new CognitoService();
// export const configurationService = new ConfigurationService();
// export const emailService = new EmailService();

console.log('Dependency injection container initialized');
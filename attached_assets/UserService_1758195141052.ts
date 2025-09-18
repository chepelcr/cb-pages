import { userRepository, cognitoService, emailService } from '../dependency_injection';
import { UserMapper } from '../mappers';
import type { UserEntity } from '../entities';
import type { User, InsertUser, UpdateUser } from '../models';

export class UserService {
  private userRepo = userRepository;

  async getUser(id: string): Promise<User | undefined> {
    const entity = await this.userRepo.getUser(id);
    if (entity) {
      return UserMapper.entityToModel(entity);
    }

    // If user not found in DB, check Cognito and sync
    const cognitoUser = await cognitoService.getUser(id);
    if (cognitoUser) {
      const newUser = await this.createUser({
        id: cognitoUser.sub,
        email: cognitoUser.email,
        userName: cognitoUser.username,
        firstName: cognitoUser.firstName,
        lastName: cognitoUser.lastName,
        company: cognitoUser.company,
      });
      return newUser;
    }

    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const entity = await this.userRepo.getUserByEmail(email);
    return entity ? UserMapper.entityToModel(entity) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const entity = await this.userRepo.createUser(UserMapper.modelToEntity(user));
    return UserMapper.entityToModel(entity);
  }

  async updateUser(id: string, user: UpdateUser): Promise<User | undefined> {
    const updateData: Partial<UserEntity> = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      configStep: user.configStep?.toString(),
      isActive: user.isActive,
    };
    
    // Update in database
    const entity = await this.userRepo.updateUser(id, updateData);
    if (!entity) return undefined;
    
    // Update in Cognito
    const cognitoAttributes: { [key: string]: string } = {};
    if (user.firstName) cognitoAttributes['given_name'] = user.firstName;
    if (user.lastName) cognitoAttributes['family_name'] = user.lastName;
    if (user.company) cognitoAttributes['custom:company_name'] = user.company;
    
    if (Object.keys(cognitoAttributes).length > 0) {
      await cognitoService.updateUserAttributes(id, cognitoAttributes);
    }
    
    return UserMapper.entityToModel(entity);
  }

  async verifyEmailComplete(userId: string, language: string = 'es'): Promise<{ user: User; message: string }> {
    console.log('📧 Processing email verification completion');
    console.log(`🔍 Finding user by ID: ${userId.substring(0, 8)}...`);

    // Check if user exists in our database
    let user = await this.getUser(userId);

    if (!user) {
      console.log('User not found in database, syncing from Cognito...');

      // Get user data from Cognito using the user ID
      const cognitoUserData = await cognitoService.getUser(userId);

      if (!cognitoUserData) {
        throw new Error('User not found in Cognito');
      }

      // Create user in our database using Cognito data
      user = await this.createUser({
        id: cognitoUserData.sub,
        email: cognitoUserData.email,
        userName: cognitoUserData.username,
        firstName: cognitoUserData.firstName,
        lastName: cognitoUserData.lastName,
        company: cognitoUserData.company,
      });

      console.log(`✅ User synced from Cognito: ${user.userName} (${user.email})`);
    }

    console.log(`✅ Found existing user: ${user.userName} (${user.email})`);

    try {
      console.log(`🎉 Processing welcome materials for verified user: ${user.email}`);

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.firstName, user.lastName, language);

      console.log(`✅ Welcome materials processed for verified user: ${user.userName} (${language})`);

      return {
        user,
        message: 'Welcome materials processed successfully'
      };

    } catch (error) {
      console.error('Failed to process welcome materials:', error);
      throw new Error('Failed to process welcome materials');
    }
  }
}


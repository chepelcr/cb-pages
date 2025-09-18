import type { User, InsertUser } from '../models/User';
import type { UserEntity } from '../entities/UserEntity';

export class UserMapper {
  /**
   * Convert User model to UserEntity
   */
  static modelToEntity(user: InsertUser): Omit<UserEntity, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      configStep: user.configStep?.toString() || '0',
      isActive: user.isActive ?? true,
    };
  }

  /**
   * Convert UserEntity to User model
   */
  static entityToModel(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      firstName: entity.firstName,
      lastName: entity.lastName,
      company: entity.company,
      configStep: parseInt(entity.configStep) || 0,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
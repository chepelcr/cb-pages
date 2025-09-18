import type { UserEntity, InsertUserEntity } from '../entities';
import type { User, InsertUser } from '../models';

export class UserMapper {
  static entityToModel(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      firstName: entity.firstName,
      lastName: entity.lastName,
      company: entity.company,
      configStep: parseInt(entity.configStep),
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static modelToEntity(model: InsertUser): InsertUserEntity {
    return {
      id: model.id,
      email: model.email,
      userName: model.userName,
      firstName: model.firstName,
      lastName: model.lastName,
      company: model.company,
      configStep: model.configStep?.toString() || '0'
    } as InsertUserEntity;
  }
}
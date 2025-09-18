import type { UserEntity, PartialUserEntity } from '../entities/UserEntity';

// User repository interface for data access layer
export interface IUserRepository {
  getUser(id: string): Promise<UserEntity | undefined>;
  getUserByEmail(email: string): Promise<UserEntity | undefined>;
  createUser(user: Omit<UserEntity, 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
  updateUser(id: string, user: PartialUserEntity): Promise<UserEntity | undefined>;
  deleteUser(id: string): Promise<boolean>;
}

// In-memory implementation for development
export class MemoryUserRepository implements IUserRepository {
  private users: Map<string, UserEntity> = new Map();

  async getUser(id: string): Promise<UserEntity | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    const usersArray = Array.from(this.users.values());
    return usersArray.find(user => user.email === email);
  }

  async createUser(userData: Omit<UserEntity, 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const now = new Date();
    const user: UserEntity = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updateData: PartialUserEntity): Promise<UserEntity | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: UserEntity = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
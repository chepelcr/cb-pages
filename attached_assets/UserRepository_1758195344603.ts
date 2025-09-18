import { db } from '../config/database';
import { users } from '../entities';
import { eq } from 'drizzle-orm';
import { IUserRepository } from '../types/repositories';
import type { UserEntity, InsertUserEntity } from '../entities';

export class UserRepository implements IUserRepository {
  async getUser(id: string): Promise<UserEntity | undefined> {
    const [entity] = await db.select().from(users).where(eq(users.id, id));
    return entity || undefined;
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    const [entity] = await db.select().from(users).where(eq(users.email, email));
    return entity || undefined;
  }

  async createUser(insertUser: InsertUserEntity): Promise<UserEntity> {
    const existingUser = await this.getUserByEmail(insertUser.email);
    if (existingUser) {
      return existingUser;
    }

    const [entity] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return entity;
  }

  async updateUser(id: string, userData: Partial<UserEntity>): Promise<UserEntity | undefined> {
    const [entity] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return entity || undefined;
  }

  async updateUserByEmail(email: string, userData: Partial<UserEntity>): Promise<UserEntity | undefined> {
    const [entity] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();
    return entity || undefined;
  }
}
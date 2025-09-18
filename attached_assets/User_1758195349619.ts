import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  userName: text('user_name').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  company: text('company'),
  configStep: text('config_step').notNull().default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserEntity = typeof users.$inferSelect;
export type InsertUserEntity = typeof users.$inferInsert;
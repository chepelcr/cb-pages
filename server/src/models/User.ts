import { z } from 'zod';

// User model for application layer
export interface User {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  configStep: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Insert user schema and type
export const insertUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  userName: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  configStep: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Update user schema and type
export const updateUserSchema = z.object({
  userName: z.string().min(1).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  configStep: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;


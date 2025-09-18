import {z} from 'zod';

export interface User {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    company?: string | null;
    configStep: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface InsertUser {
    id: string;
    email: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    company?: string | null;
    configStep?: number;
}

export interface UpdateUser {
    userName?: string;
    firstName?: string;
    lastName?: string;
    company?: string | null;
    configStep?: number;
    isActive?: boolean;
}

export const insertUserSchema = z.object({
    email: z.string().email(),
    userName: z.string().min(1),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    configStep: z.number().optional(),
});

export const updateUserSchema = z.object({
    userName: z.string().min(1).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    configStep: z.number().optional(),
    isActive: z.boolean().optional(),
});
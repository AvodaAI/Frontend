import { z } from 'zod';
import { users } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

// User type from database schema
export type User = InferModel<typeof users>;

// User type for creating new users
export type NewUser = InferModel<typeof users, 'insert'>;

// Zod validation schema for user creation
export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional().default('user'),
});

// Type for user authentication
export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

// Type for user session
export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

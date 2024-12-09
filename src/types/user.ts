//src/types/user.ts
import { z } from 'zod';
import { users } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

// User type from database schema
export type User = InferModel<typeof users>;

// User type for creating new users
export type NewUser = InferModel<typeof users, 'insert'> & {
  hire_date?: Date | string | null;
}

// Zod validation schema for user creation
export const UserSchema = z.object({
  email: z.string().email(),
  role: z.string().optional().default('user'),
  auth_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().min(1),
  position: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  hire_date: z.date().optional(),
});

// Type for user authentication
export interface AuthUser {
  id: number;
  email: string;
  role: string;
  auth_id?: string | null;
  first_name?: string | null;
  last_name?: string;
  position?: string | null;
  city?: string | null;
  country?: string | null;
  hire_date?: Date | string | null;
}

// Type for user session
export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

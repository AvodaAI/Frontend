//src/types/user.ts
import { z } from "zod";

// Zod validation schema for user creation
export const UserSchema = z.object({
  email: z.string().email(),
  role: z.string().optional().default("user"),
  auth_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().min(1),
  position: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  hire_date: z.date().optional(),
});

// Type for new user
export interface NewUser {
  id?: number;
  email: string;
  password?: string;
  role: string;
  last_name: string;
  first_name: string;
  position?: string;
  city?: string;
  status?: string;
  country?: string;
  isFromDashboard?: boolean;
  organization_id?: string;
  action?: string;
  is_invite?: boolean;
  hire_date?: Date | string | null;
  auth_id?: string;
}

export interface SupabaseUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  created_at: string;
  last_login: string | null;
}

// Type for user authentication
export interface AuthUser {
  uid: number;
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

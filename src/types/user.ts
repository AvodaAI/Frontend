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
  country?: string;
  hire_date?: Date | string | null;
  auth_id?: string;
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

export interface UserOrganization {
  organization_description: string;
  organization_id: number;
  organization_name: string;
  user_city: string;
  user_country: string;
  user_email: string;
  user_first_name: string;
  user_id: number;
  user_last_name: string;
  user_position: string;
}

// Type for user session
export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

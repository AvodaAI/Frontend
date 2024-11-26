import { z } from 'zod';
import { employees } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

// Employee type from database schema
export type Employee = InferModel<typeof employees>;

// Employee type for creating new employees
export type NewEmployee = InferModel<typeof employees, 'insert'>;

// Zod validation schema for employee creation
export const EmployeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  position: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  hire_date: z.date(),
});

// Employee form data type
export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  city?: string;
  country?: string;
  hire_date: Date;
}

// Employee search/filter type
export interface EmployeeFilter {
  name?: string;
  position?: string;
  city?: string;
  country?: string;
  hire_date_from?: Date;
  hire_date_to?: Date;
}

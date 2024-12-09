// src/app/actions/getEmployees.ts
//FIXME: Types and More. Align with Supabase Config
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

interface GetEmployeesParams {
  limit?: number;
  offset?: number;
  status?: "active" | "inactive" | undefined;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  position: string;
  createdAt: number;
  updatedAt: number;
}

interface GetEmployeesResponse {
  success: boolean;
  data?: Employee[];
  error?: string;
  total?: number;
}

export async function getEmployees(
  params?: GetEmployeesParams
): Promise<GetEmployeesResponse> {
  try {
    const { limit = 10, offset = 0, status } = params || {};

    // Build query
    let query = supabase
      .from("users") // Assuming you have an "employees" table in Supabase
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Map the results to match the expected structure
    const employees = data.map((employee) => ({
      id: employee.id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      status: employee.status,
      position: employee.position,
      createdAt: new Date(employee.created_at).getTime(),
      updatedAt: new Date(employee.updated_at).getTime(),
    }));

    return {
      success: true,
      data: employees,
      total: count || employees.length,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch employees",
    };
  }
}

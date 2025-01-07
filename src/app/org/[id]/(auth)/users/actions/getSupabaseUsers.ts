// src/app/org/[id]/(auth)/users/actions/getSupabaseUsers.ts
// FIXME: Types and More. Align with Supabase Config
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

interface GetSupabaseUsersParams {
  emailAddress?: string;
  emailAddressQuery?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

interface SupabaseUser {
  id: number;
  auth_id: string | null; 
  email: string;
  password: string;
  first_name: string | null; 
  last_name: string | null; 
  email_verified: Date | null; 
  last_login: number | null; 
  lastActiveAt: number | null; 
  role: string; 
  status: string; 
  position: string | null; 
  city: string | null; 
  country: string | null; 
  hire_date: Date | null; 
  updated_at: number;
  created_at: number;
}


export interface GetSupabaseUsersResponse {
  data: SupabaseUser[];
  success?: boolean;
  error?: string;
}

export async function getSupabaseUsers(
  params?: GetSupabaseUsersParams
): Promise<GetSupabaseUsersResponse> {
  try {
    const { emailAddress, emailAddressQuery, userId, limit = 10, offset = 0 } =
      params || {};

    let query = supabase.from("users").select("*");

    // Filter by emailAddress if provided
    if (emailAddress) {
      query = query.eq("email", emailAddress);
    }

    // Filter by emailAddressQuery if provided (partial match)
    if (emailAddressQuery) {
      query = query.ilike("email", `%${emailAddressQuery}%`);
    }

    // Filter by userId if provided
    if (userId) {
      query = query.eq("id", userId);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Map users to match the original response format
    const serializedUsers = data.map((user) => ({
      id: user.id, 
      externalId: user.auth_id || null, 
      primaryEmailAddress: user.email || null,
      username: user.username || null,
      firstName: user.first_name || null, 
      lastName: user.last_name || null, 
      publicMetadata: user.public_metadata || {}, 
      privateMetadata: user.private_metadata || {}, 
      lastSignInAt: user.last_login
        ? new Date(user.last_login).getTime()
        : null,
      lastActiveAt: user.lastActiveAt || null, 
      updatedAt: new Date(user.updated_at).getTime(), 
      createdAt: new Date(user.created_at).getTime(), 
      role: user.role, 
      status: user.status, 
      position: user.position || null, 
      city: user.city || null, 
      country: user.country || null, 
      hireDate: user.hire_date ? new Date(user.hire_date).getTime() : null, 
    }));
    

    return {
      data: serializedUsers,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

// src/app/actions/getSupabaseUsers.ts
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
  id: string;
  externalId: string | null;
  primaryEmailAddress: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
  lastSignInAt: number | null;
  lastActiveAt: number | null;
  updatedAt: number;
  createdAt: number;
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
      externalId: user.external_id || null,
      primaryEmailAddress: user.email || null,
      username: user.username || null,
      firstName: user.first_name || null,
      lastName: user.last_name || null,
      publicMetadata: user.public_metadata || {},
      privateMetadata: user.private_metadata || {},
      lastSignInAt: user.last_sign_in_at
        ? new Date(user.last_sign_in_at).getTime()
        : null,
      lastActiveAt: user.last_active_at
        ? new Date(user.last_active_at).getTime()
        : null,
      updatedAt: new Date(user.updated_at).getTime(),
      createdAt: new Date(user.created_at).getTime(),
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

// src/app/actions/getInvitations.ts
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

interface GetInvitationsParams {
  limit?: number;
  offset?: number;
  status?: "pending" | "accepted" | "revoked" | "expired";
}

interface InvitationResponse {
  success: boolean;
  data?: Array<{
    id: string;
    email_address: string;
    public_metadata: object;
    revoked: boolean;
    status: string;
    url: string | null;
    expires_at: number | null;
    created_at: number;
    updated_at: number;
  }>;
  error?: string;
  total?: number;
}

export async function getInvitations(
  params?: GetInvitationsParams
): Promise<InvitationResponse> {
  try {
    const { limit = 10, offset = 0, status } = params || {};

    // Define base query
    let query = supabase
      .from("invitations")
      .select("*")
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Fetch invitations
    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Map invitations to match the API response format
    const mappedInvitations = data.map((inv) => ({
      id: inv.id,
      email_address: inv.email_address,
      public_metadata: inv.public_metadata || {},
      revoked: inv.revoked || false,
      status: inv.status,
      url: inv.url || null,
      expires_at: inv.expires_at || null,
      created_at: new Date(inv.created_at).getTime(),
      updated_at: new Date(inv.updated_at).getTime(),
    }));

    return {
      success: true,
      data: mappedInvitations,
      total: count || mappedInvitations.length,
    };
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invitations",
    };
  }
}

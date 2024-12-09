// src/app/actions/revokeInvitation.ts
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

interface RevokeInvitationResponse {
  success: boolean;
  error?: string;
}

export async function revokeInvitation(
  invitationId: string
): Promise<RevokeInvitationResponse> {
  try {
    // Update the invitation in the Supabase table to mark it as revoked
    const { error } = await supabase
      .from("invitations") // Assuming the table is named "invitations"
      .update({ revoked: true, status: "revoked" }) // Set revoked and update status
      .eq("id", invitationId); // Match the invitation by ID

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to revoke invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke invitation",
    };
  }
}

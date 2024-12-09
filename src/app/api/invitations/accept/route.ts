// src/app/api/invitations/accept/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    const { invitationId } = await request.json();

    // Fetch the invitation from Supabase
    const { data: invitation, error: fetchError } = await supabase
      .from("invitations") // Assuming the table is named "invitations"
      .select("*")
      .eq("id", invitationId)
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    // Verify if the email exists in the `users` table
    const { data: user, error: userError } = await supabase
      .from("users") // Assuming the table is named "users"
      .select("id, email")
      .eq("email", invitation.email_address)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Update the user's role and email verification status in the `users` table
    const { error: updateError } = await supabase
      .from("users")
      .update({
        role: "employee",
        email_verified: new Date(),
      })
      .eq("email", invitation.email_address);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Update the invitation status to "accepted"
    const { error: invitationUpdateError } = await supabase
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitationId);

    if (invitationUpdateError) {
      throw new Error(invitationUpdateError.message);
    }

    return NextResponse.json(
      {
        message: "Invitation accepted successfully",
        user: {
          email: invitation.email_address,
          role: "employee",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

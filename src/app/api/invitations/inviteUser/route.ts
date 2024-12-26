// src/app/api/invitations/inviteUser/route.ts
import { supabase } from "@/utils/supabase/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: "http://localhost:3000/inviteUser",
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Magic link generated successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

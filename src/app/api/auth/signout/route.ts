// src/app/api/auth/signout.ts
import { supabase } from "@/utils/supabase/supabaseClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }

  // Clear all cookies
  const response = NextResponse.json({ success: true, message: "Signed out and cookies cleared" });

  // Clear all cookies
  cookieStore.getAll().forEach(({ name }) => {
    cookieStore.delete(name);
  });

  return response;
}

// src/app/api/auth/signin.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/utils/supabase/supabaseClient";

// Validation schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = signInSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Attempt to sign in using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Sign-in failed" },
        { status: 401 }
      );
    }

    // Return success response
    const token = data.session?.access_token;
    if (token) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("supabase-auth-token", token, {
        path: "/",
        httpOnly: true,
      });
      return response;
    }

    return NextResponse.json({ error: "Sign-in failed" }, { status: 401 });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sign-in failed" },
      { status: 500 }
    );
  }
}

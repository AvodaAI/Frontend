//src/app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/utils/supabase/supabaseClient";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";

// Validation schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  position: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = signUpSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      first_name,
      last_name,
      position,
      city,
      country,
      status,
    } = validatedFields.data;

    // Check if user already exists in the database
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Sign up the user using Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Sign-up failed" },
        { status: 400 }
      );
    }

    // Hash password for storing in your database (optional for Supabase)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user details to your local database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role: "admin", // Default role
        first_name: first_name || null,
        last_name: last_name || null,
        position: position || null,
        city: city || null,
        country: country || null,
        hire_date: new Date(),
        last_login: new Date(),
        created_at: new Date(),
        status: status || "active",
      })
      .returning();

    // Return user information without sensitive data
    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        position: newUser.position,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sign-up failed" },
      { status: 500 }
    );
  }
}

// src/app/api/employee/add/route.ts
//FIXME: Types and More. Align with Supabase Config
//TODO: Use server?
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    const {
      first_name,
      last_name,
      email,
      position,
      hire_date,
      city,
      country,
      password,
      isFromDashboard,
    } = await request.json();

    // Validate required fields
    if (!last_name || !email || !hire_date) {
      return NextResponse.json(
        { error: "Last name, email, and hire date are required" },
        { status: 400 }
      );
    }

    // Generate password if from dashboard, otherwise require password
    let userPassword: string;
    if (isFromDashboard) {
      // Generate a random 16-character password
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      userPassword = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((byte) => chars[byte % chars.length])
        .join("");
    } else if (!password) {
      return NextResponse.json(
        { error: "Password is required for non-dashboard user creation" },
        { status: 400 }
      );
    } else {
      userPassword = password;
    }

    // Insert new employee in Supabase
    const { data: newEmployee, error: insertError } = await supabase
      .from("users") // Assuming the table is named "employees"
      .insert({
        first_name: first_name || null,
        last_name,
        email,
        password: userPassword,
        position: position || null,
        city: city || null,
        country: country || null,
        hire_date: new Date(hire_date),
        created_at: new Date(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Send invitation via Supabase (if applicable)
    try {
      const { error: invitationError } = await supabase
        .from("invitations") // Assuming the table is named "invitations"
        .insert({
          email_address: email,
          public_metadata: {
            type: "employee",
            employee_id: newEmployee.id,
            first_name,
            last_name,
          },
          status: "sent",
          created_at: new Date(),
        });

      if (invitationError) {
        throw new Error(invitationError.message);
      }

      return NextResponse.json(
        {
          employee: newEmployee,
          invitation: {
            status: "sent",
            emailAddress: email,
          },
        },
        { status: 201 }
      );
    } catch (inviteError) {
      console.error("Error sending invitation:", inviteError);
      return NextResponse.json(
        {
          employee: newEmployee,
          invitation: {
            status: "failed",
            error:
              inviteError instanceof Error
                ? inviteError.message
                : "Failed to send invitation",
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add employee",
      },
      { status: 500 }
    );
  }
}

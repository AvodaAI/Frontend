// src/app/api/timer/start/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";
import { z } from "zod";

// Input validation schema
const startTimerSchema = z.object({
  taskId: z.string(),
  organizationId: z.string().optional(), // Optional org ID if task is org-specific
});

export async function POST(request: Request) {
  try {
    // Verify user authentication using Supabase
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = startTimerSchema.parse(body);

    // Check for existing active timer
    const { data: existingTimer, error: existingTimerError } = await supabase
      .from("time_logs") // Assuming the table is named "time_logs"
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null)
      .single();

    if (existingTimerError && existingTimerError.code !== "PGRST116") {
      // Ignore "No Rows Found" error (PGRST116) but handle others
      throw new Error(existingTimerError.message);
    }

    if (existingTimer) {
      return NextResponse.json(
        {
          error: "Active timer exists",
          message: "Please stop the current timer before starting a new one",
          activeTimer: existingTimer,
        },
        { status: 409 }
      );
    }

    // If organization ID is provided, verify user's access
    if (validatedData.organizationId) {
      const { data: userOrg } = await supabase
        .from("organizations") // Assuming an "organizations" table
        .select("id")
        .eq("id", validatedData.organizationId)
        .eq("user_id", user.id)
        .single();

      if (!userOrg) {
        return NextResponse.json(
          { error: "Invalid organization access" },
          { status: 403 }
        );
      }
    }

    // Create a new time log entry
    const { data: newTimeLog, error: insertError } = await supabase
      .from("time_logs") // Assuming the table is named "time_logs"
      .insert({
        user_id: user.id,
        task_id: validatedData.taskId,
        organization_id: validatedData.organizationId || null,
        start_time: new Date(),
        end_time: null,
        created_by: user.email, // Use the authenticated user's email
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({
      message: "Timer started successfully",
      timeLog: newTimeLog,
      user: {
        id: user.id,
        name: user.email,
        organization: validatedData.organizationId
          ? { id: validatedData.organizationId }
          : null,
      },
    });
  } catch (error) {
    console.error("Error starting timer:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: "Failed to start timer" },
      { status: 500 }
    );
  }
}

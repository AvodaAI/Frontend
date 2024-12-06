// src/app/api/timer/stop/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";
import { z } from "zod";

// Input validation schema
const stopTimerSchema = z.object({
  taskId: z.string(),
  organizationId: z.string().optional(),
});

// Helper function to calculate duration in minutes
function calculateDuration(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  return Math.round(durationMs / (1000 * 60)); // Convert to minutes and round
}

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
    const validatedData = stopTimerSchema.parse(body);

    // Find the active time log for this task and user
    const { data: activeTimeLog, error: activeTimerError } = await supabase
      .from("time_logs") // Assuming the table is named "time_logs"
      .select("*")
      .eq("user_id", user.id)
      .eq("task_id", validatedData.taskId)
      .is("end_time", null)
      .single();

    if (activeTimerError) {
      return NextResponse.json(
        { error: "No active timer found for this task" },
        { status: 404 }
      );
    }

    // Verify organization access if org ID is provided
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

    const endTime = new Date();
    const duration = calculateDuration(
      new Date(activeTimeLog.start_time),
      endTime
    );

    // Update the time log with end time and duration
    const { data: updatedTimeLog, error: updateError } = await supabase
      .from("time_logs") // Assuming the table is named "time_logs"
      .update({
        end_time: endTime,
        duration_minutes: duration,
        updated_at: endTime,
        updated_by: user.email, // Use the authenticated user's email
      })
      .eq("id", activeTimeLog.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      message: "Timer stopped successfully",
      timeLog: updatedTimeLog,
      user: {
        id: user.id,
        name: user.email,
        organization: validatedData.organizationId
          ? { id: validatedData.organizationId }
          : null,
      },
      duration: {
        minutes: duration,
        formatted: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      },
    });
  } catch (error) {
    console.error("Error stopping timer:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: "Failed to stop timer" },
      { status: 500 }
    );
  }
}

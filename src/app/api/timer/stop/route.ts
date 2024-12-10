// src/app/api/timer/stop/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';

// Comprehensive input validation schema
const stopTimerSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  organizationId: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
});

// Helper function to calculate duration with more robust handling
function calculateDuration(startTime: Date, endTime: Date): { 
  minutes: number, 
  hours: number, 
  formattedDuration: string 
} {
  const durationMs = endTime.getTime() - startTime.getTime();
  const totalMinutes = Math.round(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    minutes: totalMinutes,
    hours,
    formattedDuration: `${hours}h ${minutes}m`
  };
}

export async function POST(request: Request) {
  try {
    // Robust authentication check
    const supabase = createClient();
    const { data: { user }, error } = await (await supabase).auth.getUser();
    const userId = user?.id;
    const orgId = user?.organizationId;

    if (!userId || !user) {
      return NextResponse.json(
        { 
          error: 'Authentication required', 
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = stopTimerSchema.parse(body);

    // Database transaction for atomicity
    const stoppedTimeLog = await db.transaction(async (tx) => {
      // Find the active time log
      const activeTimeLog = await tx.query.timeLogs.findFirst({
        where: and(
          eq(timeLogs.user_id, Number(userId)),
          eq(timeLogs.task_id, validatedData.taskId),
          isNull(timeLogs.end_time)
        ),
      });

      // Validate active timer exists
      if (!activeTimeLog) {
        throw new Error('NO_ACTIVE_TIMER');
      }

      const endTime = new Date();
      const duration = calculateDuration(activeTimeLog.start_time, endTime);

      // Update the time log with end time and duration
      const [updatedTimeLog] = await tx
        .update(timeLogs)
        .set({
          end_time: endTime,
          duration_minutes: duration.minutes,
          description: validatedData.description,
          updated_at: endTime,
          updated_by: user.firstName 
            ? `${user.firstName} ${user.lastName || ''}`.trim() 
            : user.username || userId,
        })
        .where(eq(timeLogs.id, activeTimeLog.id))
        .returning();

      return { 
        timeLog: updatedTimeLog, 
        duration 
      };
    });

    return NextResponse.json({
      message: 'Timer stopped successfully',
      timeLog: stoppedTimeLog.timeLog,
      user: {
        id: userId,
        name: user.firstName 
          ? `${user.firstName} ${user.lastName || ''}`.trim() 
          : user.username,
        organization: orgId ? { id: orgId } : null
      },
      duration: {
        total: stoppedTimeLog.duration.minutes,
        hours: stoppedTimeLog.duration.hours,
        formatted: stoppedTimeLog.duration.formattedDuration
      }
    });
  } catch (error) {
    console.error('Error stopping timer:', error);
    
    // Detailed error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'NO_ACTIVE_TIMER') {
      return NextResponse.json(
        { 
          error: 'No active timer found',
          message: 'Cannot stop a timer that is not running',
          code: 'NO_ACTIVE_TIMER'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to stop timer',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
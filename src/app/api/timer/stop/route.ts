import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';

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
    // Verify user authentication and get user details
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = stopTimerSchema.parse(body);

    // Find the active time log for this task and user
    const activeTimeLog = await db.query.timeLogs.findFirst({
      where: and(
        eq(timeLogs.user_id, Number(userId)),
        eq(timeLogs.task_id, validatedData.taskId),
        isNull(timeLogs.end_time)
      ),
    });

    if (!activeTimeLog) {
      return NextResponse.json(
        { error: 'No active timer found for this task' },
        { status: 404 }
      );
    }

    // Verify organization access if org ID is provided
    if (validatedData.organizationId) {
      if (!orgId || orgId !== validatedData.organizationId) {
        return NextResponse.json(
          { error: 'Invalid organization access' },
          { status: 403 }
        );
      }
    }

    const endTime = new Date();
    const duration = calculateDuration(activeTimeLog.start_time, endTime);

    // Update the time log with end time and duration
    const updatedTimeLog = await db
      .update(timeLogs)
      .set({
        end_time: endTime,
        duration_minutes: duration,
        updated_at: endTime,
        updated_by: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || userId,
      })
      .where(eq(timeLogs.id, activeTimeLog.id))
      .returning();

    return NextResponse.json({
      message: 'Timer stopped successfully',
      timeLog: updatedTimeLog[0],
      user: {
        id: userId,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
        organization: orgId ? { id: orgId } : null
      },
      duration: {
        minutes: duration,
        formatted: `${Math.floor(duration / 60)}h ${duration % 60}m`
      }
    });

  } catch (error) {
    console.error('Error stopping timer:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to stop timer' },
      { status: 500 }
    );
  }
}

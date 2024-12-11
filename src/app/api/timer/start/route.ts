// src/app/api/timer/start/route.ts
// FIXED: wrap in a database transaction to prevent race conditions where multiple timers could be started simultaneously.
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';

// Comprehensive input validation schema
const startTimerSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  organizationId: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
});

export async function POST(request: Request) {
  try {
    // Robust authentication check
    const supabase = createClient();
    const { data: { user }, error } = await (await supabase).auth.getUser();
    const userId = user?.id;

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
    const validatedData = startTimerSchema.parse(body);

    // Database transaction to prevent race conditions
    const existingActiveTimer = await db.transaction(async (tx) => {
      // Check for existing active timer
      const activeTimer = await tx.query.timeLogs.findFirst({
        where: and(
          eq(timeLogs.user_id, Number(userId)),
          isNull(timeLogs.end_time)
        ),
      });

      // Prevent multiple active timers
      if (activeTimer) {
        throw new Error('ACTIVE_TIMER_EXISTS');
      }

      // Create new time log entry
      const [newTimeLog] = await tx.insert(timeLogs).values({
        user_id: Number(userId),
        task_id: validatedData.taskId,
        organization_id: validatedData.organizationId || null,
        description: validatedData.description,
        start_time: new Date(),
        end_time: null,
        created_by: user.firstName 
          ? `${user.firstName} ${user.lastName || ''}`.trim() 
          : user.username || userId,
      }).returning();

      return newTimeLog;
    });

    return NextResponse.json({
      message: 'Timer started successfully',
      timeLog: existingActiveTimer,
      user: {
        id: userId,
        name: user.firstName 
          ? `${user.firstName} ${user.lastName || ''}`.trim() 
          : user.username,
        organization: orgId ? { id: orgId } : null
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error starting timer:', error);
    
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

    if (error instanceof Error && error.message === 'ACTIVE_TIMER_EXISTS') {
      return NextResponse.json(
        { 
          error: 'Active timer already exists',
          message: 'Please stop the current timer before starting a new one',
          code: 'TIMER_CONFLICT'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to start timer',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
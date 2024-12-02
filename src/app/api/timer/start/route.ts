import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';


// Input validation schema
const startTimerSchema = z.object({
  taskId: z.string(),
  organizationId: z.string().optional(), // Optional org ID if task is org-specific
});

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
    const validatedData = startTimerSchema.parse(body);

    // Check for existing active timer
    const existingTimer = await db.query.timeLogs.findFirst({
      where: and(
        eq(timeLogs.user_id, Number(userId)),
        isNull(timeLogs.end_time)
      ),
    });

    if (existingTimer) {
      return NextResponse.json(
        { 
          error: 'Active timer exists',
          message: 'Please stop the current timer before starting a new one',
          activeTimer: existingTimer
        },
        { status: 409 }
      );
    }

    // If organization ID is provided, verify user's access
    if (validatedData.organizationId) {
      if (!orgId || orgId !== validatedData.organizationId) {
        return NextResponse.json(
          { error: 'Invalid organization access' },
          { status: 403 }
        );
      }
    }

    // Create new time log entry
    const newTimeLog = await db.insert(timeLogs).values({
      user_id: Number(userId),
      task_id: validatedData.taskId,
      organization_id: validatedData.organizationId || null,
      start_time: new Date(),
      end_time: null,
      created_by: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || userId,
    }).returning();

    return NextResponse.json({
      message: 'Timer started successfully',
      timeLog: newTimeLog[0],
      user: {
        id: userId,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
        organization: orgId ? { id: orgId } : null
      }
    });

  } catch (error) {
    console.error('Error starting timer:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to start timer' },
      { status: 500 }
    );
  }
}

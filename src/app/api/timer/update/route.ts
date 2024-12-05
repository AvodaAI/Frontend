// src/app/api/timer/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';

// Comprehensive input validation schema
const updateTimeLogSchema = z.object({
  taskId: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(0).optional(),
  description: z.string().max(500, "Description too long").optional(),
  organizationId: z.string().optional()
});

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Extract ID from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Time log ID is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = updateTimeLogSchema.parse(body);

    // Database transaction for atomic update
    const [updatedTimeLog] = await db.transaction(async (tx) => {
      // First, verify the time log exists and belongs to the user
      const [existingTimeLog] = await tx
        .select()
        .from(timeLogs)
        .where(
          and(
            eq(timeLogs.id, Number(id)),
            eq(timeLogs.user_id, Number(userId))
          )
        )
        .limit(1);

      if (!existingTimeLog) {
        throw new Error('Time log not found');
      }

      // Perform the update
      return tx
        .update(timeLogs)
        .set({
          ...validatedData,
          updated_at: sql`now()`,
          updated_by: userId
        })
        .where(
          and(
            eq(timeLogs.id, Number(id)),
            eq(timeLogs.user_id, Number(userId))
          )
        )
        .returning();
    });

    return NextResponse.json(updatedTimeLog, { status: 200 });
  } catch (error) {
    console.error('Error updating time log:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors,
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update time log', 
        code: 'SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}
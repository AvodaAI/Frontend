// src/app/api/timer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Database transaction for atomic deletion
    const result = await db.transaction(async (tx) => {
      // First, verify the time log exists and belongs to the user
      const [existingTimeLog] = await tx
        .select({ id: timeLogs.id })
        .from(timeLogs)
        .where(
          and(
            eq(timeLogs.id, Number(params.id)),
            eq(timeLogs.user_id, Number(userId))
          )
        )
        .limit(1);

      if (!existingTimeLog) {
        throw new Error('Time log not found');
      }

      // Perform the deletion
      const deletedTimeLogs = await tx
        .delete(timeLogs)
        .where(
          and(
            eq(timeLogs.id, Number(params.id)),
            eq(timeLogs.user_id, Number(userId))
          )
        )
        .returning({ deletedId: timeLogs.id });

      return deletedTimeLogs;
    });

    return NextResponse.json(
      { 
        message: 'Time log deleted successfully', 
        deletedId: result[0]?.deletedId 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting time log:', error);

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete time log', 
        code: 'SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}
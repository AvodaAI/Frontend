// src/app/api/timer/get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { timeLogs } from '@/db/schema';
import { TimeLog } from '@/types/timeLog';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { eq, and, isNotNull, gte, lte, sql, desc } from 'drizzle-orm';

// Comprehensive input validation schema
const getTimeLogsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  taskId: z.string().optional(),
  minDuration: z.number().int().min(0).optional(),
  maxDuration: z.number().int().min(0).optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['startTime', 'endTime', 'duration']).optional().default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await (await supabase).auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate and transform input
    const validatedParams = getTimeLogsSchema.parse({
      ...queryParams,
      page: queryParams.page ? Number(queryParams.page) : undefined,
      limit: queryParams.limit ? Number(queryParams.limit) : undefined,
      minDuration: queryParams.minDuration ? Number(queryParams.minDuration) : undefined,
      maxDuration: queryParams.maxDuration ? Number(queryParams.maxDuration) : undefined
    });

    // Construct dynamic where conditions
    const whereConditions = and(
      eq(timeLogs.user_id, Number(userId)),
      
      // Start date filter
      validatedParams.startDate 
        ? gte(timeLogs.start_time, new Date(validatedParams.startDate)) 
        : undefined,
      
      // End date filter
      validatedParams.endDate 
        ? lte(timeLogs.end_time, new Date(validatedParams.endDate)) 
        : undefined,
      
      // Task ID filter
      validatedParams.taskId 
        ? eq(timeLogs.task_id, validatedParams.taskId) 
        : undefined,
      
      // Minimum duration filter
      validatedParams.minDuration 
        ? gte(timeLogs.duration_minutes, validatedParams.minDuration) 
        : undefined,
      
      // Maximum duration filter
      validatedParams.maxDuration 
        ? lte(timeLogs.duration_minutes, validatedParams.maxDuration) 
        : undefined,
      
      // Ensure end time is not null (completed logs)
      isNotNull(timeLogs.end_time)
    );

    // Calculate pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;

    // Determine sorting
    const orderByClause = 
      validatedParams.sortBy === 'startTime' 
        ? validatedParams.sortOrder === 'asc' 
          ? timeLogs.start_time 
          : desc(timeLogs.start_time)
        : validatedParams.sortBy === 'endTime'
          ? validatedParams.sortOrder === 'asc'
            ? timeLogs.end_time
            : desc(timeLogs.end_time)
          : validatedParams.sortOrder === 'asc'
            ? timeLogs.duration_minutes
            : desc(timeLogs.duration_minutes);

    // Perform database transaction for consistent read and explicitly type the transaction result
    const [logs, countResult] = await db.transaction(async (tx): Promise<[TimeLog[], { count: number }[]]> => {
      const retrievedLogs = await tx.select().from(timeLogs)
        .where(whereConditions)
        .limit(validatedParams.limit)
        .offset(offset)
        .orderBy(orderByClause);
      
      const totalCount = await tx.select({ count: sql<number>`count(*)` })
        .from(timeLogs)
        .where(whereConditions);

      return [retrievedLogs, totalCount];
    });

    // Extract total count
    const totalCount = countResult[0].count;
    const totalPages = Math.ceil(totalCount / validatedParams.limit);

    // Prepare response
    return NextResponse.json({
      data: logs,
      meta: {
        pagination: {
          currentPage: validatedParams.page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: validatedParams.limit
        },
        filters: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
          taskId: validatedParams.taskId,
          minDuration: validatedParams.minDuration,
          maxDuration: validatedParams.maxDuration
        },
        sorting: {
          sortBy: validatedParams.sortBy,
          sortOrder: validatedParams.sortOrder
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving time logs:', error);

    // Detailed error handling
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
        error: error instanceof Error ? error.message : 'Failed to retrieve time logs', 
        code: 'SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}
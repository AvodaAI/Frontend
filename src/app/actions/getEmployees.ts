// src/app/actions/getEmployees.ts
'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { User } from '@/db/types'
import { eq } from 'drizzle-orm'

const clerk = clerkClient()

interface GetEmployeesParams {
  limit?: number
  offset?: number
  status?: 'active' | 'inactive' | undefined
}

interface GetEmployeesResponse {
  success: boolean
  data?: User[]
  error?: string
  total?: number
}

export async function getEmployees(params?: GetEmployeesParams): Promise<GetEmployeesResponse> {
  try {
    const { limit = 10, offset = 0, status } = params || {}

    // Fetch users from the database with optional status filtering
    const query = status 
      ? db.select().from(users).where(eq(users.status, status)).limit(limit).offset(offset)
      : db.select().from(users).limit(limit).offset(offset)

    const employeesFromDb = await query

    return {
      success: true,
      data: employeesFromDb,
      total: employeesFromDb.length
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch employees'
    }
  }
}

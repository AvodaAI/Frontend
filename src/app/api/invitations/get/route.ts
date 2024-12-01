// src/app/invitations/get/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getInvitations } from '@/app/actions/getInvitations'
import { auth } from '@clerk/nextjs/server'

const MAX_LIMIT = 500

export async function GET(request: NextRequest) {
  try {
    const authResult = await auth()
    const { userId } = authResult
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    
    // Parse and validate limit
    let limit: number | undefined
    const limitParam = searchParams.get('limit')
    if (limitParam) {
      limit = Math.min(Math.max(parseInt(limitParam), 1), MAX_LIMIT)
    }

    // Parse and validate offset
    let offset: number | undefined
    const offsetParam = searchParams.get('offset')
    if (offsetParam) {
      offset = Math.max(parseInt(offsetParam), 0)
    }

    // Validate status
    const statusParam = searchParams.get('status')
    const validStatuses = ['pending', 'accepted', 'revoked', undefined] as const
    const status = statusParam && validStatuses.includes(statusParam as any) 
      ? statusParam as typeof validStatuses[number]
      : undefined

    const result = await getInvitations({ limit, offset, status })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch invitations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    })
  } catch (error) {
    console.error('Error in GET /invitations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
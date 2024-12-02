// src/app/api/invitations/accept/route.ts
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

const client = clerkClient()

export async function POST(request: Request) {
  try {
    const { invitationId } = await request.json()

    // Verify the invitation
    const invitationList = await (await client).invitations.getInvitationList(invitationId)

    if (!invitationList.data || invitationList.data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      )
    }

    const invitation = invitationList.data[0]

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      )
    }

    // Get the user's Clerk ID 
    const { id:userId } = await (await client).users.getUser(invitation.emailAddress)

    // Update user in database
    await db.update(users)
      .set({ 
        role: 'employee',
        email_verified: new Date() 
      })
      .where(eq(users.email, invitation.emailAddress))

    // Update Clerk metadata
    await (await client).users.updateUserMetadata(userId, {
      publicMetadata: {
        type: 'employee'
      }
    })

    return NextResponse.json({ 
      message: 'Invitation accepted successfully',
      user: { 
        email: invitation.emailAddress,
        role: 'employee' 
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error accepting invitation:', error)
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}

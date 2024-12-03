// src/app/actions/revokeInvitation.ts
'use server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

import { Invitation } from '@/types/invitation'

interface RevokeInvitationResponse {
  success: boolean
  data?: Invitation
  error?: string
}

export async function revokeInvitation(invitationId: string): Promise<RevokeInvitationResponse> {
  try {
    // Verify user is authenticated
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Revoke the invitation via Clerk's API
    const client = await clerkClient()
    await client.invitations.revokeInvitation(invitationId)

    return { success: true }
  } catch (error) {
    console.error('Failed to revoke invitation:', error)
    return { 
      success: false, 
      error: 'Failed to revoke invitation' 
    }
  }
}

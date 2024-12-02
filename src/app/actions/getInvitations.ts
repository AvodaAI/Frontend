// src/app/actions/getInvitations.ts
// DONE fix type regarding api (specifically expires_at )
'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { Invitation } from '@/types/invitation'

const clerk = clerkClient()

interface GetInvitationsParams {
  limit?: number
  offset?: number
  status?: 'pending' | 'accepted' | 'revoked'
}

interface GetInvitationsResponse {
  success: boolean
  data?: Invitation[]
  error?: string
  total?: number
}

// Updated getInvitations function
export async function getInvitations(params?: GetInvitationsParams): Promise<GetInvitationsResponse> {
    try {
      const { limit = 10, offset = 0, status } = params || {}
  
      // Call Clerk API to fetch invitations with provided filters
      const invitations = await (await clerk).invitations.getInvitationList({ 
        limit, 
        offset, 
        status 
      })
  
      // Map invitations to match the API response format
      const mappedInvitations = Array.isArray(invitations)
        ? invitations.map(inv => ({
          object: 'invitation',
          id: inv.id,
          email_address: inv.emailAddress,
          public_metadata: inv.publicMetadata,
          revoked: inv.revoked,
          status: inv.status,
          url: inv.url || null,
          expires_at: Number(inv.expiresAt),
          created_at: Number(inv.createdAt),
          updated_at: Number(inv.updatedAt),
        }))
        : []

      return { 
        success: true, 
        data: mappedInvitations, 
        total: mappedInvitations.length 
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
      return { success: false, error: 'Failed to fetch invitations' }
    }
  }
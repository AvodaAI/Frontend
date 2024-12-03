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
      const response = await (await clerk).invitations.getInvitationList({ 
        limit, 
        offset,
        ...(status && { status })
      })

      console.log('Fetched invitations:', response)
      
      // Extract invitations from the response data array
      const invitations = response.data || []
      
      // Map invitations to match the API response format
      const mappedInvitations = invitations.map(inv => ({
        id: inv.id,
        email_address: inv.emailAddress,
        public_metadata: inv.publicMetadata || {},
        revoked: inv.revoked || false,
        status: inv.status,
        url: inv.url,
        expires_at: null, // Clerk doesn't seem to provide this
        created_at: new Date(inv.createdAt).getTime(),
        updated_at: new Date(inv.updatedAt).getTime(),
      }))

      console.log('Mapped invitations:', mappedInvitations)

      return { 
        success: true, 
        data: mappedInvitations, 
        total: response.totalCount 
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch invitations' }
    }
}
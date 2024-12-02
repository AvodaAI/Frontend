// src/app/actions/getInvitations.ts
//FIXME fix type re api (specifically expires_at )
'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { Invitation } from '@/types/invitation'

const clerk = clerkClient()

interface GetInvitationsParams {
  limit?: number
  offset?: number
  status?: 'pending' | 'accepted' | 'revoked' | undefined
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
      const invitations = await (await clerk).invitations.getInvitationList({ limit, offset, status })
  
      // Map invitations to match the API response format
      const mappedInvitations = Array.isArray(invitations.data)
        ? invitations.data.map(inv => {
            console.log(`Invitation ${inv.id} expires_at:`, inv.expires_at);
            return {
          object: 'invitation',  // Consistent object field
          id: inv.id,  // Invitation ID
          email_address: inv.emailAddress,  // Email Address
          public_metadata: inv.publicMetadata,  // Public Metadata
          revoked: inv.revoked,  // Determine revoked status
          status: inv.status,  // Status of the invitation
          url: inv.url || null,  // Invitation URL, null if not provided
          expires_at:  inv.expiresAt ? Number(inv.expiresAt) : null,  // Expires at timestamp (if available)
          created_at: Number(inv.createdAt),  // Created at timestamp
          updated_at: Number(inv.updatedAt),  // Updated at timestamp
        }
      })    
        : []
    

      console.log(invitations.data);
      // Log the result to ensure it matches Postman format
      console.log({
        object: 'invitation',
        data: mappedInvitations,
        total: invitations.totalCount,

      })
      console.log("Expires At:", invitations.data[0].expiresAt);
  
      return { success: true, data: mappedInvitations, total: invitations.totalCount }
    } catch (error) {
      console.error('Error fetching invitations:', error)
      return { success: false, error: 'Failed to fetch invitations' }
    }
  }
  
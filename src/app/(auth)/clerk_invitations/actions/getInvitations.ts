// src/app/actions/getInvitations.ts
//DONE: fix type regarding api (specifically expires_at )
'use server'

import { clerkClient } from '@clerk/nextjs/server'

const clerk = clerkClient()

interface GetInvitationsParams {
  limit?: number
  offset?: number
  status?: 'pending' | 'accepted' | 'revoked' | 'expired'
}

interface InvitationResponse {
  success: boolean
  data?: Array<{
    id: string
    email_address: string
    public_metadata: object
    revoked: boolean
    status: string
    url: string | null
    expires_at: number | null
    created_at: number
    updated_at: number
  }>
  error?: string
  total?: number
}

// Updated getInvitations function
export async function getInvitations(params?: GetInvitationsParams): Promise<InvitationResponse> {
  try {
    const { limit = 10, offset = 0 } = params || {}
    
    // First get pending and accepted invitations
    const activeResponse = await (await clerk).invitations.getInvitationList({ 
      limit, 
      offset,
    })

    // Then get revoked invitations
    const revokedResponse = await (await clerk).invitations.getInvitationList({ 
      limit, 
      offset,
      status: 'revoked'
    })
    
    // Combine and map all invitations
    const allInvitations = [...activeResponse.data, ...revokedResponse.data]
    
    // Map invitations to match the API response format
    const mappedInvitations = allInvitations.map(inv => {
      if (!inv.emailAddress) {
        throw new Error(`Invitation ${inv.id} is missing required email address`);
      }
      return {
        id: inv.id,
        email_address: inv.emailAddress,
        public_metadata: inv.publicMetadata || {},
        revoked: inv.revoked || false,
        status: inv.status,
        url: inv.url || null,
        expires_at: null, // data should come from our end via calculation
        created_at: new Date(inv.createdAt).getTime(),
        updated_at: new Date(inv.updatedAt).getTime(),
      };
    })

    return {
      success: true,
      data: mappedInvitations,
      total: mappedInvitations.length
    }
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch invitations'
    }
  }
}
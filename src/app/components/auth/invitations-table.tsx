// src/app/components/auth/invitations-table.tsx
// TODO: Add pagination
// TODO: Add search functionality
// FIXED: fix expires_at *type* error
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getInvitations } from '../../actions/getInvitations'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Loader2 } from 'lucide-react'
import { Invitation } from '@/types/invitation'
import { cn } from '@/lib/utils'

export default function InvitationsTable() {
  const { isLoaded, isSignedIn } = useAuth()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchInvitations()
    }
  }, [isLoaded, isSignedIn])

  const fetchInvitations = async () => {
    setLoading(true)
    setError(null)
    const result = await getInvitations({ limit: 500, offset: 0 })
    if (result.success && result.data) {
      setInvitations(result.data)
    } else {
      setError(result.error || 'Failed to fetch invitations')
    }
    setLoading(false)
  }

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const formattedDate = (unixDate: number | null | undefined) => {
    if (unixDate === null || unixDate === undefined) return 'N/A';
    const date = new Date(unixDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return date
  }

  return (
    <div className="w-full space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block overflow-hidden">
        <Table className='border'>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px] font-semibold">Email</TableHead>
              <TableHead className="w-[120px] font-semibold">Status</TableHead>
              <TableHead className="w-[150px] font-semibold">Invited At</TableHead>
              <TableHead className="w-[150px] font-semibold">Expires At</TableHead>
              <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{invitation.email_address}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                    {
                      "bg-green-100 text-green-700": invitation.status === "accepted",
                      "bg-yellow-100 text-yellow-700": invitation.status === "pending",
                      "bg-red-100 text-red-700": invitation.status === "expired" || invitation.status === "revoked"
                    }
                  )}>
                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formattedDate(invitation.created_at)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formattedDate(invitation.expires_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={invitation.status !== 'pending' ? 'ghost' : 'destructive'}
                    size="sm"
                    className={cn(
                      'cursor-pointer',
                      invitation.status !== 'pending' && 'opacity-50'
                    )}
                    disabled={invitation.status !== 'pending'}
                    onClick={() => {/* TODO: Add revoke action */}}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-card p-4 rounded-lg border shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{invitation.email_address}</div>
              <span className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                {
                  "bg-green-100 text-green-700": invitation.status === "accepted",
                  "bg-yellow-100 text-yellow-700": invitation.status === "pending",
                  "bg-red-100 text-red-700":  invitation.status === "revoked"
                }
              )}>
                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Invited At</div>
                <div>{formattedDate(invitation.created_at)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Expires At</div>
                <div>{formattedDate(invitation.expires_at)}</div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                hidden={invitation.status !== 'pending'}
                variant={invitation.status !== 'pending' ? 'ghost' : 'destructive'}
                size="sm"
                className={cn(
                  'w-full cursor-pointer',
                  invitation.status !== 'pending' && 'opacity-50'
                )}
                disabled={invitation.status !== 'pending'}
                onClick={() => {/* TODO: Add revoke action */}}
              >
                Revoke
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// src/app/components/auth/invitations-table.tsx
// TODO: Add revoke action
// TODO: Add pagination
// TODO: Add search
// TODO: fix format/date api
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getInvitations } from '../../actions/getInvitations'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Loader2 } from 'lucide-react'
import { Invitation } from '@/types/invitation'
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

  const formattedDate = (unixDate: number) => {
    const date = new Date(unixDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return date
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Invited At</TableHead>
          <TableHead>Expires At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email_address}</TableCell>
            <TableCell>{invitation.status}</TableCell>
            <TableCell>
              {formattedDate(invitation.created_at)}
            </TableCell>
            <TableCell>
              {formattedDate(invitation.expires_at)}
            </TableCell>
            <TableCell>
              <Button
                variant={invitation.status !== 'pending' ? 'default' : 'destructive'}
                size="sm"
                className='cursor-pointer'
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
  )
}

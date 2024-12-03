// src/app/(auth)/clerkusers/components/clerkusers-table.tsx
//TODO: Make Add User Modal
//TODO: Update & Delete User Modal
//TODO: Link to view details page
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getClerkUsers } from '../actions/getClerkUsers'
import { getClerkEmail } from '../actions/getClerkEmail'
import { GetClerkUsersResponse } from '../actions/getClerkUsers'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUnixDate } from '@/utils/unixdate'
import { dataFallback } from '@/utils/datafallback'

export default function ClerkUsersTable() {
  const { isLoaded, isSignedIn } = useAuth()
  const [users, setUsers] = useState<GetClerkUsersResponse['data']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emails, setEmails] = useState<Record<string, string>>({})

  const fetchClerkUsers = async (params: { limit: number; offset: number }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getClerkUsers(params)
      setUsers(result.data)
      if (!result.success) {
        setError(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmail = async (emailAddressId: string) => {
    if (!emailAddressId || emails[emailAddressId]) return
    
    const email = await getClerkEmail(emailAddressId)
    if (email) {
      setEmails(prev => ({ ...prev, [emailAddressId]: email }))
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchClerkUsers({ limit: 500, offset: 0 })
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    let mounted = true;
    users.forEach(user => {
      if (user.primaryEmailAddressId && mounted) {
        fetchEmail(user.primaryEmailAddressId)
      }
    });
    return () => { mounted = false };
  }, [users])

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clerk ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((clerkuser) => (
            <TableRow key={clerkuser.id}>
              <TableCell>{clerkuser.id}</TableCell>
              <TableCell>{dataFallback(clerkuser.firstName) || dataFallback(clerkuser.lastName) || 'N/A'}</TableCell>
              <TableCell>
                {clerkuser.primaryEmailAddressId ? 
                  (emails[clerkuser.primaryEmailAddressId] || 'Loading...') 
                  : 'N/A'}
              </TableCell>
              <TableCell>{dataFallback(formatUnixDate(clerkuser.createdAt)) || 'N/A'}</TableCell>
              <TableCell>{dataFallback(clerkuser.lastSignInAt ? formatUnixDate(clerkuser.lastSignInAt) : 'Never')}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

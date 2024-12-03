// src/app/(auth)/clerkusers/components/clerkusers-table.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getClerkUsers } from '../actions/getClerkUsers'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUnixDate } from '@/utils/unixdate'
import { dataFallback } from '@/utils/datafallback'

export default function ClerkUsersTable() {
  const { isLoaded, isSignedIn } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUsers()
    }
  }, [isLoaded, isSignedIn])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getClerkUsers({ limit: 500, offset: 0 })
      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        setError(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{dataFallback(user.first_name) || dataFallback(user.last_name) || 'N/A'}</TableCell>
              <TableCell>{dataFallback(user.email_addresses && user.email_addresses[0]?.email_address) || 'N/A'}</TableCell>
              <TableCell>{dataFallback(formatUnixDate(user.created_at)) || 'N/A'}</TableCell>
              <TableCell>{dataFallback(user.last_sign_in_at ? formatUnixDate(user.last_sign_in_at) : 'Never')}</TableCell>
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

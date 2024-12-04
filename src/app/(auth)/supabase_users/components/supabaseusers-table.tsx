// src/app/(auth)/supabase_users/components/supabaseusers-table.tsx
//TODO: Add pagination
//TODO: Search functionality
//TODO: Add edit functionality
//TODO: Add delete functionality
//TODO: Extract interface and types
'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Button } from "@components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface User {
  id: string
  email?: string
  created_at: string
  last_sign_in_at?: string | undefined
  role?: string 
}

export default function SupabaseUsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, created_at, last_sign_in_at, role')
      
      if (error) {
        console.error('Error fetching users:', error)
        return
      }
      setUsers(data || [])
    }

    fetchUsers()
  }, [supabase])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{user.role || 'N/A'}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString()
                  : 'Never'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

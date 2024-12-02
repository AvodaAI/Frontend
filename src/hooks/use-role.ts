'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function useUserRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      // Fetch user role from metadata
      const userRole = user.publicMetadata?.type as string || 'admin'
      setRole(userRole)
    }
  }, [user, isLoaded])

  return {
    role,
    isAdmin: role === 'admin',
    isEmployee: role === 'employee',
    isLoaded
  }
}

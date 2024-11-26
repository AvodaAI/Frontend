'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/app/components/ui/button'

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ 
      redirect: true, 
      callbackUrl: '/signin' 
    })
  }

  return (
    <Button 
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
}

//src/app/components/auth/SignUp.tsx
'use client'

import { useActionState } from 'react'
import { signUp } from '@/app/actions/auth'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'

export function SignUp() {
  const [error, action, isPending] = useActionState(signUp, null)
  const success = error === null
  
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Signing up...' : 'Sign Up'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Account created successfully. You can now sign in.
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}

//src/app/components/auth/SignIn.tsx
'use client'

import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'

export function SignIn() {
  const [error, action, isPending] = useActionState(signIn, null)
  const success = error === null && !isPending && action.hasBeenSubmitted

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
        {isPending ? 'Signing in...' : 'Sign In'}
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
            Successfully signed in!
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}

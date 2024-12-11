// src/app/(auth)/forgot-password/page.tsx
//FIXME: useActionState
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useActionState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { forgotPasswordAction } from './actions'

export default function ForgotPasswordPage() {
  // useActionState returns: [result, wrappedAction, pending]
  // result: { error?: string, message?: string }
  // wrappedAction: function to call as the form action
  // pending: boolean while waiting for result
  const [result, wrappedAction, pending] = useActionState(forgotPasswordAction, {})

  // Clear messages and errors after 2 seconds
  useEffect(() => {
    if (result?.error || result?.message) {
      const timer = setTimeout(() => {
        // Calling the action with empty data to reset the state
        wrappedAction(new FormData())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [result, wrappedAction])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">Enter your email to reset your password</p>
      </div>

      <form action={wrappedAction} className="space-y-4" noValidate>
        {result?.error && <p className="text-destructive text-center">{result.error}</p>}
        {result?.message && <p className="text-success text-center">{result.message}</p>}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            name="email"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Processing...' : 'Reset Password'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

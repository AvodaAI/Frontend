// src/app/(auth)/login/page.tsx
//FIXME: useActionState
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useActionState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Icons } from '@/app/(auth)/components/icons'
import { loginAction } from './actions'

export default function LoginPage() {
  const router = useRouter()
  
  // Provide an initial state that matches the shape expected by loginAction.
  // For example, no redirect or error initially:
  const [result, wrappedAction, pending] = useActionState(loginAction, { error: '', redirect: '' })

  useEffect(() => {
    if (result?.redirect) {
      router.push(result.redirect)
    }
  }, [result, router])

  useEffect(() => {
    if (result?.error) {
      const timer = setTimeout(() => {
        // Clear the state by calling the action with empty data
        wrappedAction()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [result, wrappedAction])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <form action={wrappedAction} className="space-y-4" noValidate>
        {result?.error && <p className="text-destructive text-center">{result.error}</p>}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button variant="outline" onClick={() => wrappedAction(new FormData(), { social: 'github' })} disabled={pending}>
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" onClick={() => wrappedAction(new FormData(), { social: 'google' })} disabled={pending}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </p>
    </div>
  )
}

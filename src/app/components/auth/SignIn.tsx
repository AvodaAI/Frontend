'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { Loader2 } from 'lucide-react'
import { fetchWrapper } from '@/utils/fetchWrapper'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }

      const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        setSuccess(response.ok)
        // Add a small delay before navigation
        setTimeout(() => {
          router.replace('/dashboard')
        }, 1000)
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid email or password')
      }
    } catch (error) {
      setError('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            You have successfully signed in.
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}

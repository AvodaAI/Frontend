// src/app/actions/auth.ts
'use server'

interface SignUpData {
  email: string
  password: string
}

export async function signUp(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      return data.error || 'An error occurred during sign up'
    }

    return null // success case
  } catch (error) {
    return 'An error occurred during sign up'
  }
}

export async function signIn(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      return data.error || 'Invalid email or password'
    }

    return null // success case
  } catch (error) {
    return 'An error occurred during sign in'
  }
}

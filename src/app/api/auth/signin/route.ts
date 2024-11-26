//src/app/api/auth/signin/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { signIn } from '@/auth'

// Validation schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedFields = signInSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message }, 
        { status: 400 }
      )
    }

    const { email, password } = validatedFields.data

    // Attempt to sign in using NextAuth
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    // If sign-in is successful, return success response
    return NextResponse.json(
      { message: "Sign in successful" }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" }, 
      { status: 401 }
    )
  }
}

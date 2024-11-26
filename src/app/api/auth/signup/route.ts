import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Validation schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedFields = signUpSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message }, 
        { status: 400 }
      )
    }

    const { email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" }, 
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'user', // Default role
      last_login: new Date(),
      created_at: new Date()
    }).returning()

    // Return user info without password
    const { password: _, ...userWithoutPassword } = newUser[0]

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: userWithoutPassword 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Validation schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  clerk_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  position: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
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

    const { 
      email, 
      password, 
      clerk_id, 
      first_name,
      last_name,
      position,
      city,
      country
    } = validatedFields.data

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

    // Create the user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'user', // Default role
      clerk_id: clerk_id, 
      first_name: first_name,
      last_name: last_name,
      position: position,
      city: city,
      country: country,
      hire_date: new Date(),
      last_login: new Date(),
      created_at: new Date()
    }).returning()

    // Return user info without password
    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      clerk_id: newUser.clerk_id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      position: newUser.position
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" }, 
      { status: 500 }
    )
  }
}

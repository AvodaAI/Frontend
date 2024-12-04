//src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'
import { clerkClient } from '@clerk/nextjs/server'
import bcrypt from 'bcrypt'

const client = clerkClient()

// Validation schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  auth_id: z.string().optional(),
  status: z.string().optional(),
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
      auth_id, 
      first_name,
      last_name,
      position,
      city,
      country,
      status
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
      role: 'admin', // Default role
      auth_id: auth_id, 
      first_name: first_name,
      last_name: last_name,
      position: position,
      city: city,
      country: country,
      hire_date: new Date(),
      last_login: new Date(),
      created_at: new Date(),
      status: status
    }).returning()

    // Update clerk metadata with role
    if (auth_id) {
      await (await client).users.updateUserMetadata(auth_id, {
        publicMetadata: {
          type: 'employee' // Default to employee
        }
      })
    }

    // Return user info without password
    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      auth_id: newUser.auth_id,
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

// src/app/api/webhooks/clerk/newuser/route.ts
//TODO: configure webhook for new users
//TODO: validate the svix-id, svix-timestamp, and svix-signature headers specifically
//TODO: Change All to Supabase
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Dynamically get the webhook secret from environment variables
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  // Verify the webhook is from Clerk
  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  // Verify webhook signature
  if (!CLERK_WEBHOOK_SECRET) {
    console.error('Clerk webhook secret is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET)
    const evt = wh.verify(payload, headers) as {
      type: string
      data: {
        id: string  // External Auth ID
        email_addresses: { email_address: string }[]
        first_name?: string
        last_name?: string
        image_url?: string
        username?: string
      }
    }

    // Only process user.created events
    if (evt.type !== 'user.created') {
      return NextResponse.json({ message: 'Event not processed' }, { status: 200 })
    }

    const { 
      id: auth_id, 
      email_addresses, 
      first_name, 
      last_name, 
      image_url,
      username
    } = evt.data

    // Ensure we have an email
    const primaryEmail = email_addresses[0]?.email_address
    if (!primaryEmail) {
      console.error('No email address found for user')
      return NextResponse.json({ error: 'No email address' }, { status: 400 })
    }

    // Check if user already exists in our database by email or Clerk ID
    const existingUser = await db.select().from(users)
      .where(
        eq(users.email, primaryEmail) || 
        eq(users.auth_id, auth_id)
      )
      .limit(1)

    // Only insert if user doesn't already exist
    if (existingUser.length === 0) {
      await db.insert(users).values({
        email: primaryEmail,
        auth_id: auth_id,
        first_name: first_name || null,
        last_name: last_name || null,
        // Generate a temporary password for Clerk users
        password: auth_id, 
        email_verified: new Date(),
        role: 'employee', // Default role for new users
      })
    } else {
      // Update existing user with Clerk ID if not already set
      if (!existingUser[0].auth_id) {
        await db.update(users)
          .set({ auth_id: auth_id })
          .where(eq(users.email, primaryEmail))
      }
    }

    return NextResponse.json({ message: 'User processed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Webhook verification failed', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}

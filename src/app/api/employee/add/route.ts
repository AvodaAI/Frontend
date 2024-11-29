//src/app/api/employee/add/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { clerkClient } from '@clerk/nextjs/server';

const clerk = clerkClient();

export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, position, hire_date, city, country, password, isFromDashboard } = await request.json();

    // Validate required fields
    if (!last_name || !email || !hire_date) {
      return NextResponse.json(
        { error: 'Last name, email, and hire date are required' },
        { status: 400 }
      );
    }

    // Generate password if from dashboard, otherwise require password
    let userPassword: string;
    if (isFromDashboard) {
      // Generate a random 16-character password with letters, numbers, and special characters
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      userPassword = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(byte => chars[byte % chars.length])
        .join('');
    } else if (!password) {
      return NextResponse.json(
        { error: 'Password is required for non-dashboard user creation' },
        { status: 400 }
      );
    } else {
      userPassword = password;
    }

    // Insert new employee using Drizzle
    const [newEmployee] = await db.insert(users).values({
      first_name: first_name || null,
      last_name: last_name,
      email,
      password: userPassword,
      position: position || null,
      city: city || null,
      country: country || null,
      hire_date: new Date(hire_date),
    }).returning();

    // Send invitation via Clerk
    try {
      const invitation = await (await clerk).invitations.createInvitation({
        emailAddress: email,
        publicMetadata: {
          role: 'employee',
          employeeId: newEmployee.id,
          firstName: first_name,
          lastName: last_name
        },
        ignoreExisting: false,
        redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
      });

      return NextResponse.json({ 
        employee: newEmployee, 
        invitation: { 
          status: 'sent',
          emailAddress: invitation.emailAddress 
        }
      }, { status: 201 });

    } catch (inviteError) {
      // If invitation fails, still return success for employee creation
      console.error('Error sending invitation:', inviteError);
      return NextResponse.json({ 
        employee: newEmployee, 
        invitation: { 
          status: 'failed',
          error: inviteError instanceof Error ? inviteError.message : 'Failed to send invitation'
        }
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add employee' },
      { status: 500 }
    );
  }
}

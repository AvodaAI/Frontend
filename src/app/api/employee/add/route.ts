//src/app/api/employee/add/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, position, hire_date, city, country } = await request.json();

    // Validate required fields
    if (!first_name || !last_name || !email || !hire_date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert new employee using Drizzle
    const [newEmployee] = await db.insert(employees).values({
      first_name: first_name,
      last_name: last_name,
      email,
      position,
      city: city || null,
      country: country || null,
      hire_date: new Date(hire_date),
    }).returning();
    
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}

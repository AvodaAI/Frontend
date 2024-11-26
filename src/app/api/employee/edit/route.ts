//src/app/api/employee/edit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request) {
  try {
    const { id, first_name, last_name, email, position, hire_date, city, country } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Build update object dynamically based on provided fields
    const updateData: any = {};
    if (first_name) updateData.firstName = first_name;
    if (last_name) updateData.lastName = last_name;
    if (email) updateData.email = email;
    if (position) updateData.position = position;
    if (hire_date) updateData.hireDate = new Date(hire_date);
    if (city !== undefined) updateData.city = city || null;
    if (country !== undefined) updateData.country = country || null;
    updateData.updatedAt = new Date();

    const [updatedEmployee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, id))
      .returning();

    if (!updatedEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

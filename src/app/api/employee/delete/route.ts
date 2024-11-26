//src/app/api/employee/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const [deletedEmployee] = await db
      .delete(employees)
      .where(eq(employees.id, id))
      .returning();

    if (!deletedEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedEmployee, { status: 200 });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}

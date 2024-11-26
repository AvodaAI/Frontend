//src/app/dashboard/page.tsx
'use client'

import { auth } from '@/auth'
import { SignOutButton } from '@/app/components/auth/signout-button'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { EmployeeTable } from '../components/employees/EmployeeTabls'
import { AddEmployeeForm } from '../components/employees/AddEmployeeForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <SignOutButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.email}</h2>
            <p className="text-gray-600">Role: {session.user.role || 'Employee'}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <Link href="/employees/add" className="block">
                <Button variant="outline" className="w-full">
                  Add New Employee
                </Button>
              </Link>
              <Link href="/employees" className="block">
                <Button variant="outline" className="w-full">
                  View Employees
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 mt-6">Add New Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm />
          </DialogContent>
        </Dialog>

        <EmployeeTable />
      </div>
    </div>
  )
}

//src/app/dashboard/page.tsx
'use client'

import { Button } from '@components/ui/button'
import Link from 'next/link'
import { EmployeeTable } from '@components/employees/EmployeeTable'
import { AddEmployeeForm } from '@components/employees/AddEmployeeForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { useState } from 'react'
import { ErrorBoundary } from '@components/ui/error-boundary'
import { Suspense } from 'react'
import { useUserRole } from '@/hooks/use-role'
import { useUser } from '@clerk/nextjs'

export default function Page() {
  const { isAdmin } = useUserRole()
  const { user } = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50/50 p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Welcome</h2>
            <p className="text-muted-foreground">
              Name: {user?.fullName || 'Employee'}
            </p>
            <p className="text-muted-foreground">
              Role: {isAdmin ? 'Administrator' : 'Employee'}
            </p>
          </div>

          <div className="bg-green-50/50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/time-tracking" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Time Tracking
                </Button>
              </Link>
              
              {isAdmin && (
                <>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        Add New Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                      </DialogHeader>
                      <AddEmployeeForm onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Link href="/employees" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      View Employees
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Employees</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    Add New Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                  </DialogHeader>
                  <AddEmployeeForm />
                </DialogContent>
              </Dialog>
            </div>
            <div className="border rounded-lg">
              <ErrorBoundary fallback={<div>Error loading employee table. Please try refreshing the page.</div>}>
                <Suspense fallback={<div>Loading employees...</div>}>
                  <EmployeeTable />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

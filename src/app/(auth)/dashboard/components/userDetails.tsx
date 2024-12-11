'use client'
import React, { useState, Suspense } from 'react'
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { EmployeeTable } from '@/app/(auth)/employees/components/EmployeeTable';
import { AddEmployeeForm } from '@/app/(auth)/employees/components/AddEmployeeForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { ErrorBoundary } from '@components/ui/error-boundary';
import { User } from '@supabase/supabase-js'

interface UserDetailsProps {
  user: User | null;
}

const UserDetails = ({ user }: UserDetailsProps) => {


  const [userName] = useState<string | null>(user?.user_metadata?.full_name || 'Employee');
  const [userRole] = useState<string | null>(user?.user_metadata?.role || 'employee');


  const isAdmin = userRole === 'admin';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p className="text-muted-foreground">Name: {userName}</p>
          <p className="text-muted-foreground">Role: {isAdmin ? 'Administrator' : 'Employee'}</p>
        </div>

        <div className="bg-green-50/50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/time-tracking" className="block">
              <Button variant="outline" className="w-full justify-start">
                Time Tracking
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Employees</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Employee</Button>
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
    </>
  )
}

export default UserDetails
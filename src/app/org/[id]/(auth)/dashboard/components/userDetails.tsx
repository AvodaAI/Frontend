// src/app/org/[id]/(auth)/dashboard/components/userDetails.tsx

'use client'

import React from 'react'
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { useUserRole } from '@/hooks/useRole';

const UserDetails = () => {

  const { loggedUserData } = useUserRole();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>

          <p className="text-muted-foreground">
            Name: {loggedUserData?.first_name && loggedUserData?.last_name
              ? `${loggedUserData?.first_name} ${loggedUserData?.last_name}`
              : 'Admin'}
          </p>
          {loggedUserData?.role ? (
            <>
              <p className="text-muted-foreground">
                Role: {loggedUserData?.role === 'admin' ? 'Administrator' : 'Employee'}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">Role: </p>
          )}
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
      </div >
    </>
  )
}

export default UserDetails
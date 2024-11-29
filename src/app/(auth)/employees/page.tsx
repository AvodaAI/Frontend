'use client'

import { Button } from '@components/ui/button'
import { EmployeeTable } from '@/app/components/employees/EmployeeTable'
import { AddEmployeeForm } from '@components/employees/AddEmployeeForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { useState } from 'react'

export default function EmployeesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
        </div>

        <div className="rounded-lg">
          <EmployeeTable />
        </div>
      </div>
    </div>
  )
}

//src/app/components/employees/EmployeeTabls.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button, buttonVariants } from '@components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { EditEmployeeModal } from './EditEmployeeModal'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog'
import { User } from '@/types/user'

export function EmployeeTable({
  children
}: {
  children?: (employee: User) => React.ReactNode
}) {
  const [employees, setEmployees] = useState<User[]>([])
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    const response = await fetch('/api/employee/list')
    if (response.ok) {
      const data = await response.json()
      setEmployees(data)
    } else {
      console.error('Error fetching employees')
    }
  }

  const handleDelete = async (id: number) => {
    const response = await fetch('/api/employee/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (response.ok) {
      setEmployees(employees.filter(emp => emp.id !== id))
    } else {
      console.error('Error deleting employee')
    }
  }

  const handleUpdateEmployee = (updatedEmployee: User) => {
    setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp))
    setEditingEmployee(null)
  }

  return (
    <div className="w-full space-y-5">
      {/* Desktop view */}
      <div className="border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='w-[250px] font-semibold'>Name</TableHead>
              <TableHead className='w-[350px] font-semibold'>Email</TableHead>
              <TableHead className='w-[125px] font-semibold'>Role</TableHead>
              <TableHead className='w-[150px] font-semibold'>Last Login</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>
                  {user.hire_date
                    ? new Date(user.hire_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button onClick={() => setEditingEmployee(user)} size="sm">
                    Edit
                  </Button>
                  {children && children(user)}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the employee's
                          record from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={buttonVariants({ variant: 'destructive', size: 'sm' })} onClick={() => handleDelete(user.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {employees.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-lg border shadow-sm space-y-4"
          >
            <div className="space-y-1">
              <div className="font-medium text-lg">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.email}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Role</div>
                <div className="font-medium">{user.position}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Login</div>
                <div className="font-medium">
                  {user.hire_date
                    ? new Date(user.hire_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                onClick={() => setEditingEmployee(user)} 
                size="sm"
              >
                Edit
              </Button>
              {children && children(user)}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the employee's
                      record from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className={buttonVariants({ variant: 'destructive', size: 'sm' })} 
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdate={(updatedEmployee) => handleUpdateEmployee(updatedEmployee)}
        />
      )}
    </div>
  )
}

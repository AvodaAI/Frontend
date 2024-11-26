//src/app/components/employees/EmployeeTabls.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { EditEmployeeModal } from './EditEmployeeModal'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog'

import { Employee } from '@/types/employee'

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Last Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.last_name}</TableCell>
              <TableCell>{employee.first_name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{new Date(employee.hire_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingEmployee(employee)} className="mr-2">
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the employee
                        record from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(employee.id)}>
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
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdate={(updatedEmployee) => {
            setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp))
            setEditingEmployee(null)
          }}
        />
      )}
    </div>
  )
}

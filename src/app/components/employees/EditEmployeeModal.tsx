// src/app/components/employees/EditEmployeeModal.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog'
import { Employee } from '@/types/employee'

interface EditEmployeeModalProps {
  employee: Employee
  onClose: () => void
  onUpdate: (updatedEmployee: Employee) => void
}

export function EditEmployeeModal({ employee, onClose, onUpdate }: EditEmployeeModalProps) {
  const [firstName, setFirstName] = useState(employee.first_name || '')
  const [lastName, setLastName] = useState(employee.last_name || '')
  const [email, setEmail] = useState(employee.email)
  const [position, setPosition] = useState(employee.position || '')
  const [hireDate, setHireDate] = useState<Date | string>(employee.hire_date || new Date())
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateFields = () => {
    const errors: {[key: string]: string} = {}
    
    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!email.includes('@')) errors.email = 'Please enter a valid email'
    
    const selectedDate = new Date(hireDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison
    
    if (!hireDate) errors.hireDate = 'Hire date is required'
    else if (selectedDate > today) {
      errors.hireDate = 'Hire date cannot be in the future'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!validateFields()) {
      return
    }

    try {
      const response = await fetch(`/api/employee/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: employee.id, first_name: firstName, last_name: lastName, email, position, hire_date: new Date(hireDate) }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update employee')
      }

      onUpdate({ ...employee, first_name: firstName, last_name: lastName, email, position, hire_date: new Date(hireDate) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off' noValidate>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldErrors.firstName ? 'border-red-500' : ''}
            />
            {fieldErrors.firstName && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldErrors.lastName ? 'border-red-500' : ''}
            />
            {fieldErrors.lastName && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldErrors.email ? 'border-red-500' : ''}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hireDate">Hire Date</Label>
            <Input
              id="hireDate"
              type="date"
              value={new Date(hireDate).toISOString().split('T')[0]}
              onChange={(e) => setHireDate(e.target.value)}
              className={fieldErrors.hireDate ? 'border-red-500' : ''}
            />
            {fieldErrors.hireDate && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.hireDate}</p>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

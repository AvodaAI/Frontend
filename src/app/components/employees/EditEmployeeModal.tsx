// src/app/components/employees/EditEmployeeModal.tsx
'use client'

import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog'
import { User } from '@/types'

interface EditEmployeeModalProps {
  employee: User
  onClose: () => void
  onUpdate: (updatedEmployee: User) => void
}

export function EditEmployeeModal({ employee, onClose, onUpdate }: EditEmployeeModalProps) {
  const [user, setUser] = useState<User>({
    ...employee
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateFields = () => {
    const errors: {[key: string]: string} = {}
    
    if (!user.first_name?.trim()) errors.first_name = 'First name is required'
    if (!user.last_name?.trim()) errors.last_name = 'Last name is required'
    if (!user.email?.trim()) errors.email = 'Email is required'
    else if (!user.email.includes('@')) errors.email = 'Please enter a valid email'
    if (!user.position?.trim()) errors.position = 'Position is required'
    if (!user.hire_date) errors.hire_date = 'Hire date is required'
    else {
      const selectedDate = new Date(user.hire_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate > today) {
        errors.hire_date = 'Hire date cannot be in the future'
      }
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
      const res = await fetch('/api/employee/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!res.ok) throw new Error('Failed to update employee')

      onUpdate(user)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off' noValidate>
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={user.first_name || ''}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              className={fieldErrors.first_name ? 'border-red-500' : ''}
            />
            {fieldErrors.first_name && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.first_name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={user.last_name || ''}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              className={fieldErrors.last_name ? 'border-red-500' : ''}
            />
            {fieldErrors.last_name && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.last_name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              value={user.position || ''}
              onChange={(e) => setUser({ ...user, position: e.target.value })}
              className={fieldErrors.position ? 'border-red-500' : ''}
            />
            {fieldErrors.position && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.position}</p>
            )}
          </div>
          <div>
            <Label htmlFor="hire_date">Hire Date</Label>
            <Input
              id="hire_date"
              type="date"
              value={user.hire_date ? new Date(user.hire_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setUser({ ...user, hire_date: new Date(e.target.value) })}
              className={fieldErrors.hire_date ? 'border-red-500' : ''}
            />
            {fieldErrors.hire_date && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.hire_date}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}

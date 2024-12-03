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
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../../../components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface EditEmployeeModalProps {
  employee: User
  onClose: () => void
  onUpdate: (updatedEmployee: User) => void
}

export function EditEmployeeModal({ employee, onClose, onUpdate }: EditEmployeeModalProps) {
  const [user, setUser] = useState<User>({
    ...employee
  })
  const [date, setDate] = useState<Date | undefined>(employee.hire_date ? new Date(employee.hire_date) : undefined)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateFields = () => {
    const errors: {[key: string]: string} = {}
    
    if (!user.first_name?.trim()) errors.first_name = 'First name is required'
    if (!user.last_name?.trim()) errors.last_name = 'Last name is required'
    if (!user.email?.trim()) errors.email = 'Email is required'
    else if (!user.email.includes('@')) errors.email = 'Please enter a valid email'
    if (!user.role?.trim()) errors.role = 'Role is required'
    if (!date) errors.hire_date = 'Hire date is required'
    else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (date > today) {
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
      const updatedUser = {
        ...user,
        position: user.role, // Map role to position for API compatibility
        hire_date: date ? format(date, 'yyyy-MM-dd') : null // Format date consistently
      }

      const res = await fetch('/api/employee/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update employee')
      }

      const data = await res.json()
      onUpdate(data)
      onClose() // Close immediately on success
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) => setUser({ ...user, role: value })}
              defaultValue={user.position || user.role} // Support both position and role fields
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.role && (
              <p className="text-sm text-red-500">{fieldErrors.role}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="hire_date">Hire Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="hire_date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    fieldErrors.hire_date && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a hire date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ after: new Date() }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldErrors.hire_date && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.hire_date}</p>
            )}
          </div>
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

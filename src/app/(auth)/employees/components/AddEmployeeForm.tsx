//src/app/components/employees/AddEmployeeForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { User, NewUser } from '@/types/user'
import { Calendar } from '@components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface AddEmployeeFormProps {
  onClose?: () => void;
}

export function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
  const [user, setUser] = useState<NewUser>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    hire_date: new Date(Date.now() - 86400000), // Subtract 24 hours in milliseconds
  })
  const [date, setDate] = useState<Date>()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateFields = () => {
    const errors: {[key: string]: string} = {}
  
    if (!user.last_name?.trim()) errors.last_name = 'Last name is required'
    if (!user.email?.trim()) errors.email = 'Email is required'
    else if (!user.email.includes('@')) errors.email = 'Please enter a valid email'
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
    setSuccess(false)
    setFieldErrors({})

    if (!validateFields()) return

    try {
      const res = await fetch('/api/employee/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          isFromDashboard: true,
          hire_date: date,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add employee')
      }

      const data = await res.json()
      
      // Handle invitation status
      if (data.invitation?.status === 'failed') {
        setSuccess(true)
        setError(`Employee added but invitation failed: ${data.invitation.error}`)
      } else {
        setSuccess(true)
        if (onClose) {
          setTimeout(onClose, 2000);
        }
      }

      // Reset form
      setUser({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: '',
        hire_date: new Date(Date.now() - 86400000), // Subtract 24 hours in milliseconds
      })
      setDate(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off' noValidate>
      <div className='grid grid-cols-2 gap-4'>
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          value={user.first_name ?? ''}
          onChange={(e) => setUser({ ...user, first_name: e.target.value || "" })}
          className=""
        />
      </div>
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          value={user.last_name || ''}
          onChange={(e) => setUser({ ...user, last_name: e.target.value || '' })}
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
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className={fieldErrors.email ? 'border-red-500' : ''}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div className='grid grid-cols-3 gap-2'>
      <div className='col-span-1'>
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) => setUser({ ...user, role: value })}
            defaultValue={user.role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.role && (
            <p className="text-sm text-red-500">{fieldErrors.role}</p>
          )}
      </div>
      <div className='col-span-2'>
        <Label htmlFor="hire_date">Hire Date (This can be changed later)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="hire_date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
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
      </div>
      </div>
      <Button type="submit">Add Employee</Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Employee added successfully!</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

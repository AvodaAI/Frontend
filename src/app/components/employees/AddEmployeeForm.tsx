//src/app/components/employees/AddEmployeeForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { User, NewUser } from '@/types/user'

export function AddEmployeeForm() {
  const [user, setUser] = useState<NewUser>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    position: '',
    hire_date: new Date(Date.now() - 86400000), // Subtract 24 hours in milliseconds
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
          isFromDashboard: true
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
      }

      // Reset form
      setUser({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        position: '',
        hire_date: new Date(Date.now() - 86400000), // Subtract 24 hours in milliseconds
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off' noValidate>
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
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          value={user.position ?? ''}
          onChange={(e) => setUser({ ...user, position: e.target.value})}
          className=""
        />
      </div>
      <div>
        <Label htmlFor="hire_date">Hire Date (This can be changed later)</Label>
        <Input
          id="hire_date"
          type="date"
          value={user.hire_date instanceof Date 
            ? user.hire_date.toISOString().split('T')[0] 
            : user.hire_date || ''}
          onChange={(e) => setUser({ ...user, hire_date: new Date(e.target.value) })}
          className={fieldErrors.hire_date ? 'border-red-500' : ''}
        />
        {fieldErrors.hire_date && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.hire_date}</p>
        )}
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

//src/app/components/employees/AddEmployeeForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'

export function AddEmployeeForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateFields = () => {
    const errors: {[key: string]: string} = {}
    
    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!email.includes('@')) errors.email = 'Please enter a valid email'
    if (!position.trim()) errors.position = 'Position is required'
    if (!hireDate) errors.hireDate = 'Hire date is required'
    else {
      const selectedDate = new Date(hireDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison
      
      if (selectedDate > today) {
        errors.hireDate = 'Hire date cannot be in the future'
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

    if (!validateFields()) {
      return
    }

    try {
      const response = await fetch('/api/employee/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, position, hire_date: hireDate }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'An error occurred while adding the employee')
      }

      setSuccess(true)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPosition('')
      setHireDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    }
  }

  return (
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
          className={fieldErrors.position ? 'border-red-500' : ''}
        />
        {fieldErrors.position && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.position}</p>
        )}
      </div>
      <div>
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input
          id="hireDate"
          type="date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          className={fieldErrors.hireDate ? 'border-red-500' : ''}
        />
        {fieldErrors.hireDate && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.hireDate}</p>
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

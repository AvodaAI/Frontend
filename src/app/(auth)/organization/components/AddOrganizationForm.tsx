// src/app/(auth)/organization/components/AddOrganizationForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { Organization } from '@/types'

interface AddOrganizationFormProps {
  onClose?: () => void;
  addOrganization: (organization: Organization) => void
}

export function AddOrganizationForm({ onClose, addOrganization }: AddOrganizationFormProps) {
  const [organization, setOrganization] = useState<{
    name: string, description?: string
  }>({
    name: '', description: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    if (!organization.name?.trim()) errors.name = 'Organization name is required'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setFieldErrors({})

    if (!validateFields()) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
        credentials: 'include'
      })

      if (!res.ok) {
        const data = await res.json()

        throw new Error(data.error || 'Failed to add Organization')
      }

      const { organization: resOrg } = await res.json();
      addOrganization(resOrg)
      setSuccess(true)
      if (onClose) {
        setTimeout(onClose, 2000);
      }

      setOrganization({
        name: '',
        description: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
      console.error(err)
    } finally {

    }
  }

  return (
    <form onSubmit={handleAddOrganizationSubmit}
      className="space-y-4" autoComplete='off' noValidate>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={organization.name ?? ''}
            onChange={(e) => setOrganization({ ...organization, name: e.target.value || "" })}
            className={fieldErrors.name ? 'border-red-500' : ''}
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={organization.description || ''}
            onChange={(e) => setOrganization({ ...organization, description: e.target.value || '' })}
          />
        </div>
      </div>

      <Button type="submit" disabled={!organization.name}>
        {'Add Organization'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Organization added successfully!</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
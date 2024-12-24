// src/app/(auth)/organization/components/EditOrganizationModal.tsx
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
import { Organization, } from '@/types'

interface EditOrganizationModalProps {
  org: Organization
  onClose: () => void
  onUpdate: (updateOrganization: Organization) => void
}

export function EditOrganizationModal({ org, onClose, onUpdate }: EditOrganizationModalProps) {
  const [organization, setUser] = useState<Organization>({
    ...org
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const validateFields = () => {
    const errors: { [key: string]: string } = {}

    if (!organization.name?.trim()) errors.name = 'Organization name is required'
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
      const updatedOrganization = {
        name: organization.name,
        description: organization.description
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${organization.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrganization),
        credentials: "include"
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update Organization')
      }

      const data = await res.json()
      onUpdate(data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete='off' noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={organization.name || ''}
                onChange={(e) => setUser({ ...organization, name: e.target.value })}
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
                onChange={(e) => setUser({ ...organization, description: e.target.value })}
              />
            </div>
          </div>
          <div>
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

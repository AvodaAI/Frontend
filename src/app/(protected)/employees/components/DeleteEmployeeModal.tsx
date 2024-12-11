// src/app/components/employees/DeleteEmployeeModal.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { User } from '@/types/user'

interface DeleteUserModalProps {
  user: User
  onDelete: (id: string) => void
  onClose: () => void
  open: boolean
}

export function DeleteUserModal({
  user,
  onDelete,
  onClose,
  open,
}: DeleteUserModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/employee/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id })
      })

      if (!res.ok) throw new Error('Failed to delete employee')

      onDelete(String(user.id))
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {user.first_name} {user.last_name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// src/app/(auth)/supabase-invitations/page.tsx
'use client'

import InvitationsTable from "./components/invitations-table"
import { Button } from "@components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { InviteEmployeeForm } from "./components/InviteEmployeeForm"

export default function InvitationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Employee</DialogTitle>
              </DialogHeader>
              <InviteEmployeeForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg">
          <InvitationsTable />
        </div>
      </div>
    </div>
  )
}
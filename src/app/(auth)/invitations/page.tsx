'use client'

import InvitationsTable from "@/app/components/invitations/invitations-table"
import { Button } from "@components/ui/button"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "@/app/components/ui/error-boundary"

export default function InvitationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Invitations</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Employee
        </Button>
      </div>
      <div>
        <ErrorBoundary fallback={<div>Error loading invitations. Please try refreshing the page.</div>}>
          <Suspense fallback={<div>Loading invitations...</div>}>
            <InvitationsTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

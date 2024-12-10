// src/app/(auth)/supabase-invitations/page.tsx
'use client'

import InvitationsTable from "./components/invitations-table"
import { Button } from "@components/ui/button"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "@components/ui/error-boundary"
import { Container } from "@/app/components/container"
import { Section } from "@/app/components/section"

export default function InvitationsPage() {
  return (
    <Container>
      <Section>
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
    </Section>
  </Container>
  )
}

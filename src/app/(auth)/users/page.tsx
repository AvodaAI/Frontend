//src/app/(auth)/supabase-users/page.tsx
'use client'

import SupabaseUsersTable from "./components/SupabaseUsersTable"
import { Button } from "@components/ui/button"
import { UserPlus } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "@components/ui/error-boundary"
import { Container } from "@/app/components/container"
import { Section } from "@/app/components/section"

export default function ClerkUsersPage() {
  return (
    <Section>
      <Container>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clerk Users</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div>
        <ErrorBoundary fallback={<div>Error loading users. Please try refreshing the page.</div>}>
          <Suspense fallback={<div>Loading users...</div>}>
            <SupabaseUsersTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Container>
  </Section>
  )
}

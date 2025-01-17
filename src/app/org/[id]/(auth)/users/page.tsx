// src/app/org/[id]/(auth)/users/page.tsx
'use client'

import { Container } from "@/app/components/container"
import { AddUserModal } from "@/app/org/[id]/(auth)/users/modals/AddUserModal"
import { EditUserModal } from "@/app/org/[id]/(auth)/users/modals/EditUserModal"
import { Section } from "@/app/components/section"
import { ErrorBoundary } from "@components/ui/error-boundary"
import { Suspense } from "react"
import SupabaseUsersTable from "./components/SupabaseUsersTable"

export default function ClerkUsersPage() {
  return (
    <Section>
      <Container>
        <AddUserModal />
        <EditUserModal />
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

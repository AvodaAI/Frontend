// src/app/org/[id]/(auth)/users/page.tsx
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
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-8 mx-5">
          
        </div> */}
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

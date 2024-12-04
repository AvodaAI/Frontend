//src/app/(auth)/supabase_users/page.tsx
'use client'

import SupabaseUsersTable from "./components/supabaseusers-table"
import { CreateUserDialog } from "./components/create-user-dialog"
import { Suspense } from "react"
import { ErrorBoundary } from "@components/ui/error-boundary"

export default function SupabaseUsersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Supabase Users</h1>
        <CreateUserDialog />
      </div>
      <div>
        <ErrorBoundary fallback={<div>Error loading users. Please try refreshing the page.</div>}>
          <Suspense fallback={<div>Loading users...</div>}>
            <SupabaseUsersTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

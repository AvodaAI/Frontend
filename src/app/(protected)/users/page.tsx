//src/app/(auth)/users/page.tsx
"use client";

import UsersTable from "./components/users";
import { Button } from "@components/ui/button";
import { UserPlus } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "@components/ui/error-boundary";

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Clerk Users
        </h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div>
        <ErrorBoundary
          fallback={
            <div>Error loading users. Please try refreshing the page.</div>
          }
        >
          <Suspense fallback={<div>Loading users...</div>}>
            <UsersTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

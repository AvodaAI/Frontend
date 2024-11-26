// src/app/invitations/page.tsx
import InvitationsTable from "@components/auth/invitations-table"

export default function InvitationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Employee Invitations</h1>
      <InvitationsTable />
    </div>
  )
}


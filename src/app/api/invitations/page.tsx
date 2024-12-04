// src/app/invitations/page.tsx
import InvitationsTable from "@/app/(auth)/clerk_invitations/components/invitations-table"

export default function InvitationsPage() {
  return (
    <div className=" bg-gray-100 max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-sm p-8">
        <h1 className="text-2xl font-bold mb-5">Employee Invitations</h1>
        <InvitationsTable />
      </div>
    </div>
  )
}

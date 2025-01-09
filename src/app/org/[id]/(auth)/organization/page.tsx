// src/app/org/[id]/(auth)/organization/page.tsx
'use client'

import { Button } from '@components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { useEffect, useState } from 'react'
import { OrganizationTable } from './components/OrganizationTable'
import { AddOrganizationForm } from './components/AddOrganizationForm'
import { Organization } from '@/types'
import { fetchWrapper } from '@/utils/fetchWrapper'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'
import { useParams } from 'next/navigation'
export default function OrganizationPage() {
  const { id: org_id } = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);  const addOrganization = (organization: Organization) => {
    setOrganizations((prev) => ([organization, ...prev,]))
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/organizations/by-user?organization_id=${org_id}&action=get-organization`, { credentials: "include" });
    const data = await response.json();
    if (response.ok) {
      setOrganizations(data);
    } else {
      setError(data.error || 'Error fetching organizations');
      throw new Error(data.error || 'Error fetching organizations')
    }
  };

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                Add New Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Organization</DialogTitle>
              </DialogHeader>
              <AddOrganizationForm onClose={() => setIsDialogOpen(false)} addOrganization={addOrganization} />
            </DialogContent>
          </Dialog>
        </div>

        {!error && (
          <div className="rounded-lg">
            <OrganizationTable organizations={organizations} setOrganizations={setOrganizations} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
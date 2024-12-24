// src/app/(auth)/organization/page.tsx
'use client'

import { Button } from '@components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { useEffect, useState } from 'react'
import { OrganizationTable } from './components/OrganizationTable'
import { AddOrganizationForm } from './components/AddOrganizationForm'
import { Organization } from '@/types'
export default function OrganizationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const addOrganization = (organization: Organization) => {
    setOrganizations((prev) => ([organization, ...prev,]))
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/by-owner`, { credentials: "include" });
    if (response.ok) {
      const data = await response.json();
      setOrganizations(data);
    } else {
      console.error("Error fetching organizations");
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

        <div className="rounded-lg">
          <OrganizationTable organizations={organizations} setOrganizations={setOrganizations} />
        </div>
      </div>
    </div>
  )
}
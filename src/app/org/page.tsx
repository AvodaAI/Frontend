// src/app/org/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { useRouter } from "next/navigation";

interface Organizations {
  organization_id: number;
  organization_name: string;
  organization_description: string;
}

const OrganizationsPage = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organizations[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/organizations/?action=get-organization`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setOrganizations(data);
      } else {
        setError(data.error || "Error fetching organizations");
      }
    } catch (err) {
      setError("Error fetching organizations");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-6">Organizations</h1>
      {error && <p className="text-red-500">{error}</p>}
      {organizations &&
        organizations.length > 0 &&
        organizations.map((organization) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" key={organization.organization_id} onClick={() => router.push(`/org/${organization.organization_id}/dashboard`)}>
            <Card >
              <CardHeader>
                <CardTitle>{organization.organization_name}</CardTitle>
                <CardDescription>{organization.organization_description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default OrganizationsPage;

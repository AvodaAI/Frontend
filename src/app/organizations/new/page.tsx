import { OrganizationForm } from "@/app/components/organization-form";

export default function NewOrganizationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Organization</h1>
      <OrganizationForm />
    </div>
  );
}

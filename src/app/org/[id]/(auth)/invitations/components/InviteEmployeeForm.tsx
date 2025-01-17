// src/app/org/[id]/(auth)/invitations/components/InviteEmployeeForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useParams } from "next/navigation";
import { NewUser } from "@/types";
import { user_permission } from "@/utils/user-permission";

interface AddEmployeeFormProps {
  onClose?: () => void;
}

interface Organization {
  id: number;
  name: string;
  created_by: number;
}

export function InviteEmployeeForm({ onClose }: AddEmployeeFormProps) {
  const { id: org_id } = useParams();
  const [user, setUser] = useState<NewUser>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "employee",
    hire_date: "",
  });
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const validateFields = () => {
    const errors: { [key: string]: string } = {};
    if (!user.last_name?.trim()) errors.last_name = "Last name is required";
    if (!user.email?.trim()) errors.email = "Email is required";
    else if (!user.email.includes("@")) errors.email = "Please enter a valid email";
    else if (user.hire_date) {
      const selectedDate = new Date(user.hire_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        errors.hire_date = "Hire date cannot be in the future";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchOrganizations = async () => {
    setIsLoading(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/by-user?organization_id=${org_id}&action=get-organization`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setOrganizations(data);
    } else {
      setError("Error fetching organizations");
    }
    setIsLoading(false)
  };

  const handleInviteEmployeeSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    if (!validateFields()) return;
    if (!organizationId) {
      setFieldErrors({ ...fieldErrors, organization: "Please select an organization" });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/get-by-email`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: Number(org_id),
          email: user.email,
          action: "get-user",
        }),
      });
      const { user: userData } = await response.json();

      if (userData) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addToOrg/${userData.id}`, {
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organization_id: Number(org_id),
            action: "update-user",
            add_organization_id: Number(organizationId),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to add user into organization.");
        }

        const newPermissions = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions: user_permission,
            organization_id: Number(organizationId),
            user_id: userData?.id,
            action: "create-permission",
          }),
        });

        if (!newPermissions.ok) {
          const data = await newPermissions.json();
          setError(data.error || "Failed to add an permission");
        }

        setSuccess(true);
        if (onClose) {
          setTimeout(onClose, 2000);
        }
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitation/send-invite`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          organization_id: Number(org_id),
          action: "invite-user",
        }),
      });

      const newInvitation = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitation/add-invitation`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: user?.email,
          hire_date: user.hire_date ? user.hire_date : null,
          public_metadata: {
            type: "employee",
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role.toLocaleLowerCase(),
          },
          url: "",
          revoked: false,
          status: "pending",
          organization_id: Number(org_id),
          action: "create-invitation",
        }),
      });
      if (!newInvitation.ok) {
        const data = await newInvitation.json();
        if (Array.isArray(data.error)) {
          const errorMessages = data.error
            .map((error: any) => {
              const property = error.property;
              const constraints = Object.values(error.constraints).join(", ");
              return `${property}: ${constraints}`;
            })
            .join("\n");

          throw new Error(errorMessages || "Failed to add an invitation")
        } else {
          const errorMessage = data.error?.message || "An unexpected error occurred";
          throw new Error(errorMessage || "Failed to add an invitation")
        }
      }

      setSuccess(true);
      if (onClose) {
        setTimeout(onClose, 2000);
      }
    } catch (err: any) {
      if (Array.isArray(err?.response?.data)) {
        const errorMessages = err.response.data
          .map((error: any) => {
            const property = error.property;
            const constraints = Object.values(error.constraints).join(", ");
            return `${property}: ${constraints}`;
          })
          .join("\n");

        setError(errorMessages);
      } else {
        const errorMessage = err?.message || "An unexpected error occurred";
        setError(errorMessage);
      }
      setError(err instanceof Error ? err.message : "Failed to invite an employee");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={handleInviteEmployeeSubmit} className="space-y-4" autoComplete="off" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={user.first_name ?? ""} onChange={(e) => setUser({ ...user, first_name: e.target.value || "" })} className="" />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={user.last_name || ""}
            onChange={(e) => setUser({ ...user, last_name: e.target.value || "" })}
            className={fieldErrors.last_name ? "border-red-500" : ""}
          />
          {fieldErrors.last_name && <p className="text-sm text-red-500 mt-1">{fieldErrors.last_name}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className={fieldErrors.email ? "border-red-500" : ""}
        />
        {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setUser({ ...user, role: value })} defaultValue={user.role}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.role && <p className="text-sm text-red-500">{fieldErrors.role}</p>}
        </div>
        <div className="col-span-2">
          <Label htmlFor="hire_date">Hire Date (This can be changed later)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="hire_date" variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a hire date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ after: new Date() }} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="organization">Organization</Label>
        <Select onValueChange={(value) => setOrganizationId(value)} defaultValue={organizationId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an organization" />
          </SelectTrigger>
          <SelectContent side="top">
            {organizations &&
              organizations.length > 0 &&
              organizations.map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {fieldErrors.organization && <p className="text-sm text-red-500">{fieldErrors.organization}</p>}
      </div>

      <Button type="submit" disabled={isLoading || !user.first_name || !user.last_name || !user.email || !organizationId}>
        {isLoading ? <Loader2 /> : "Invite Employee"}
      </Button>
      {error && <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Employee added successfully!</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

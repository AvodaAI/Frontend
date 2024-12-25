// src/app/components/organizations/OrganizationTable.tsx
"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Organization } from "@/types";
import { EditOrganizationModal } from "./EditOrganizationModal";
import { fetchWrapper } from "@/utils/fetchWrapper";

export function OrganizationTable({ children, organizations, setOrganizations }: {
    children?: (organization: Organization) => React.ReactNode,
    organizations: Organization[];
    setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
}) {
    const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);

    const handleDelete = async (id: number) => {
        const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
        if (response.ok) {
            setOrganizations(organizations.filter((org) => org.id !== id));
        } else {
            console.error("Error deleting organization");
        }
    };

    const handleUpdateOrganization = (updatedOrganization: Organization) => {
        setOrganizations(organizations.map((emp) => (emp.id === updatedOrganization.id ? updatedOrganization : emp)));
        setEditingOrganization(null);
    };

    return (
        <div className="w-full space-y-5">
            {/* Desktop view */}
            <div className="border hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[350px] font-semibold">Name</TableHead>
                            <TableHead className="w-[950px] font-semibold">Description</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {organizations && organizations.length > 0 && organizations.map((organization) => (
                            <TableRow key={organization?.id} className="hover:bg-muted/50">
                                <TableCell>{organization?.name}</TableCell>
                                <TableCell>{organization?.description}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button onClick={() => setEditingOrganization(organization)} size="sm">
                                        Edit
                                    </Button>
                                    {children && children(organization)}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the organization&apos;s record from the database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className={buttonVariants({ variant: "destructive", size: "sm" })}
                                                    onClick={() => handleDelete(organization.id ?? 0)}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {organizations.map((organization) => (
                    <div key={organization?.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
                        <div className="space-y-1">
                            <div className="font-medium text-lg">{organization?.name}</div>
                            <div className="text-sm text-muted-foreground">{organization?.description}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                                onClick={() => setEditingOrganization(organization)}
                                size="sm"
                            >
                                Edit
                            </Button>
                            {children && children(organization)}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the organization&apos;s record from the database.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className={buttonVariants({ variant: "destructive", size: "sm" })} onClick={() => handleDelete(organization.id ?? 0)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>

            {editingOrganization && (
                <EditOrganizationModal
                    org={editingOrganization}
                    onClose={() => setEditingOrganization(null)}
                    onUpdate={(updatedOrganization) => handleUpdateOrganization(updatedOrganization)}
                />
            )}
        </div>
    );
}
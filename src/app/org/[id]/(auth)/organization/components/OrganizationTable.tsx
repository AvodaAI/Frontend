// src/app/org/[id]/(auth)/organization/components/OrganizationTable.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { usePagination } from '@/utils/invitations-pagination';
import { useParams } from "next/navigation";

export function OrganizationTable({ children, organizations, setOrganizations }: {
    children?: (organization: Organization) => React.ReactNode,
    organizations: Organization[];
    setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
}) {
    const { id: org_id } = useParams()
    // Pagination
    const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage } = usePagination(organizations, 5);
    const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (id: number) => {
        const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}?organization_id=${org_id}&action=delete-organization`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })

        if (response.ok) {
            setOrganizations(organizations.filter((org) => org.id !== id));
        } else {
            const data = await response.json();
            setError(data.error || 'Error deleting organizations');
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
                        {paginatedItems && paginatedItems.length > 0 && paginatedItems.map((organization) => (
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

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        variant="outline"
                        onClick={goToPreviousPage}
                        disabled={paginationState.currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {paginationState.currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={goToNextPage}
                        disabled={paginationState.currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Mobile view */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedItems.map((organization) => (
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
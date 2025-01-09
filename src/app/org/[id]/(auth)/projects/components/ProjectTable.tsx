// src/app/org/[id]/(auth)/projects/components/ProjectTable.tsx
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
import { fetchWrapper } from "@/utils/fetchWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { usePagination } from "@/utils/invitations-pagination";
import { useParams } from "next/navigation";
import { deleteProjectService } from "@/utils/services/projectServices";
import { Project } from "@/types/project";

export function ProjectsTable({
  children,
  projects,
  setProjects,
  handleEditProject,
}: {
  children?: (projects: Project) => React.ReactNode;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  handleEditProject: (project: Project) => void;
}) {
  const { id: org_id } = useParams();
  // Pagination
  const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage } = usePagination(projects, 5);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const res = await deleteProjectService({ organizationId: Number(org_id), projectId: id });
    if (res.ok) {
      setProjects(projects.filter((project) => project.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || "Error deleting organizations");
    }
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
              <TableHead className="w-[950px] font-semibold">Start End</TableHead>
              <TableHead className="w-[950px] font-semibold">End End</TableHead>
              <TableHead className="w-[950px] font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems &&
              paginatedItems.length > 0 &&
              paginatedItems.map((project: Project) => (
                <TableRow key={project?.id} className="hover:bg-muted/50">
                  <TableCell>{project?.name}</TableCell>
                  <TableCell>{project?.description}</TableCell>
                  <TableCell>{project?.start_date}</TableCell>
                  <TableCell>{project?.end_date}</TableCell>
                  <TableCell>{project?.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button onClick={() => handleEditProject(project)} size="sm">
                      Edit
                    </Button>
                    {children && children(project)}
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
                            This action cannot be undone. This will permanently delete the project&apos;s record from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className={buttonVariants({ variant: "destructive", size: "sm" })} onClick={() => handleDelete(project.id)}>
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
          <Button variant="outline" onClick={goToPreviousPage} disabled={paginationState.currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {paginationState.currentPage} of {totalPages}
          </span>
          <Button variant="outline" onClick={goToNextPage} disabled={paginationState.currentPage === totalPages}>
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
        {paginatedItems.map((project: Project) => (
          <div key={project?.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="font-medium text-lg">{project?.name}</div>
              <div className="text-sm text-muted-foreground">{project?.description}</div>
              <div className="text-sm text-muted-foreground">{project?.start_date}</div>
              <div className="text-sm text-muted-foreground">{project?.end_date}</div>
              <div className="text-sm text-muted-foreground">{project?.status}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={() => handleEditProject(project)} size="sm">
                Edit
              </Button>
              {children && children(project)}
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
                      This action cannot be undone. This will permanently delete the project&apos;s record from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({ variant: "destructive", size: "sm" })} onClick={() => handleDelete(project.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

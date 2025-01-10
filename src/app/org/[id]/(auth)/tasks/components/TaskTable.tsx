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
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { usePagination } from "@/utils/invitations-pagination";
import { useParams } from "next/navigation";
import { Task } from "@/types/task";
import { deleteTaskService } from "@/utils/services/taskServices";
import { formatDate, formatTimeInHoursMinutes } from "@/utils/timeFormatHandler";

export function TasksTable({
  children,
  tasks,
  setTasks,
  handleEditTask,
}: {
  children?: (task: Task) => React.ReactNode;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  handleEditTask: (task: Task) => void;
}) {
  const { id: org_id } = useParams();
  const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage } = usePagination(tasks, 5);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const res = await deleteTaskService({ organizationId: Number(org_id), taskId: id });
    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || "Error deleting tasks");
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[350px] font-semibold">Title</TableHead>
              <TableHead className="w-[950px] font-semibold">Description</TableHead>
              <TableHead className="w-[950px] font-semibold">Due Date</TableHead>
              <TableHead className="w-[950px] font-semibold">Priority</TableHead>
              <TableHead className="w-[950px] font-semibold">Status</TableHead>
              <TableHead className="w-[950px] font-semibold">Assign To</TableHead>
              <TableHead className="w-[150px] font-semibold">Time Tracked (hrs)</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((task: Task) => {
              const { formattedDate, isPast } = formatDate(task.due_date ?? "");

              return (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <span className={isPast ? "text-red-500" : ""}>{formattedDate}</span>
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.assign_to}</TableCell>
                  <TableCell>{formatTimeInHoursMinutes(task.time_tracked ?? 0)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button onClick={() => handleEditTask(task)} size="sm">
                      Edit
                    </Button>
                    {children && children(task)}
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
                            This action cannot be undone. This will permanently delete the task&apos;s record from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className={buttonVariants({ variant: "destructive", size: "sm" })} onClick={() => handleDelete(task.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
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
    </div>
  );
}

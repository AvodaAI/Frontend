// src/app/org/[id]/(auth)/assigned-task/components/AssignedTasksTable.tsx
"use client";
import { Button } from "@components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { usePagination } from "@/utils/invitations-pagination";
import { Task } from "@/types/task";
import { formatDate, formatTimeInHoursMinutes } from "@/utils/timeFormatHandler";

export function AssignedTasksTable({ children, tasks }: { children?: (task: Task) => React.ReactNode; tasks: Task[] }) {
  const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage } = usePagination(tasks, 5);

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
              <TableHead className="w-[150px] font-semibold">Time Tracked (hrs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((task: Task) => {
                const { formattedDate, isPast } = formatDate(task.due_date ?? "") || { formattedDate: "Invalid Date", isPast: false };

                return (
                  <TableRow key={task.id} className="hover:bg-muted/50">
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <span className={isPast ? "text-red-500" : ""}>{formattedDate}</span>
                    </TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{formatTimeInHoursMinutes(task.time_tracked ?? 0)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  No Assigned Tasks for you.
                </TableCell>
              </TableRow>
            )}
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
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((task: Task) => {
            const { formattedDate, isPast } = formatDate(task.due_date ?? "");
            return (
              <div key={task.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
                <div className="space-y-1">
                  <div className="font-medium text-lg">{task.title}</div>
                  <div className="text-sm text-muted-foreground">{task.description}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className={isPast ? "text-red-500" : ""}>{formattedDate}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{task.priority}</div>
                  <div className="text-sm text-muted-foreground">{task.status}</div>
                </div>
              </div>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={6}>
              No Assigned Tasks for you.
            </TableCell>
          </TableRow>
        )}
      </div>
    </div>
  );
}

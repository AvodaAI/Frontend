// src/app/org/[id]/(auth)/assigned-task/page.tsx
"use client";
import { useEffect, useState } from "react";
import { AssignedTasksTable } from "./components/AssignedTasksTable";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useParams } from "next/navigation";
import { Task } from "@/types/task";
import { getAssignedTasksService } from "@/utils/services/taskServices";

export default function AssignedTasksPage() {
  const { id: org_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getAssignedTasksService(Number(org_id));
      const data = await res.json();
      if (res.ok) {
        setTasks(data?.tasks);
      } else {
        if (data.message === "No tasks found for the given ID") {
          setError(null)
          return
        }
        setError(data.message || "Error fetching tasks");
      }
    };
    fetchTasks();
  }, [org_id]);

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        </div>

        {!error && (
          <div className="rounded-lg">
            <AssignedTasksTable tasks={tasks} />
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
  );
}

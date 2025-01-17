// src/app/org/[id]/(auth)/tasks/page.tsx
"use client";
import { AddTaskModal } from "@/app/org/[id]/(auth)/tasks/modals/AddTaskModal";
import { EditTaskModal } from "@/app/org/[id]/(auth)/tasks/modals/EditTaskModal";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useState } from "react";
import Tasks from "./components/Tasks";


export default function ProjectsPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container max-w-7xl px-5">
      <AddTaskModal />
      <EditTaskModal />
      <div className="flex flex-col gap-6">
        {!error && (
          <div className="rounded-lg"><Tasks /></div>
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

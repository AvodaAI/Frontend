// src/app/org/[id]/(auth)/tasks/page.tsx
"use client";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { useEffect, useState } from "react";
import { TasksTable } from "./components/TaskTable";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { TaskForm } from "./components/TaskForm"; 
import { useParams } from "next/navigation";
import { Task } from "@/types/task"; 
import { getTasksService } from "@/utils/services/taskServices";

export default function TasksPage() {
  const { id: org_id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getTasksService(Number(org_id)); 
      const data = await res.json();
      if (res.ok) {
        setTasks(data?.tasks);
      } else {
        setError(data.error || "Error fetching tasks");
        throw new Error(data.error || "Error fetching tasks");
      }
    };
    fetchTasks();
  }, [org_id]);

  const handleAddTask = () => {
    setEditTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsDialogOpen(true);
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setIsDialogOpen(false);
  };

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTask}>Add New Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editTask ? "Edit Task" : "Add New Task"}</DialogTitle>
              </DialogHeader>
              <TaskForm
                addTask={addTask}
                onClose={() => setIsDialogOpen(false)}
                editTask={editTask}
                setEditTask={setEditTask}
                updateTask={handleUpdateTask}
              />
            </DialogContent>
          </Dialog>
        </div>

        {!error && (
          <div className="rounded-lg">
            <TasksTable tasks={tasks} setTasks={setTasks} handleEditTask={handleEditTask} />
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

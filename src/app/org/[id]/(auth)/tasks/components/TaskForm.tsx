"use client";

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { useParams } from "next/navigation";
import { Task, TaskFormProps } from "@/types/task";
import { addTaskService, updateTaskService } from "@/utils/services/taskServices";

export function TaskForm({ onClose, addTask, editTask, updateTask, setEditTask }: TaskFormProps) {
  const { id: org_id } = useParams();
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    due_date: "",
    status: "",
    priority: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    }
  }, [editTask]);

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!task.title?.trim()) errors.title = "Task title is required";
    if (!task.due_date) errors.due_date = "Due date is required";
    if (task.due_date && new Date(task.due_date) < new Date()) {
      errors.due_date = "Due date cannot be in the past";
    }
    if (!task.status) errors.status = "Status is required";
    if (!task.priority) errors.priority = "Priority is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    if (!validateFields()) return;

    try {
      let res;
      const taskData = {
        title: task.title,
        description: task.description ?? "",
        due_date: task.due_date ?? "",
        organizationId: Number(org_id),
        status: task.status ?? "",
        priority: task.priority ?? "",
      };

      if (editTask && updateTask) {

        res = await updateTaskService({
          ...taskData,
          taskId: task.id,
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || data.message || "Failed to update Task");
        }

        updateTask(task);
        setEditTask(null);
      } else {
        res = await addTaskService(
          taskData
        );

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || data.message || "Failed to add Task");
        }

        const { newTask } = await res.json();
        addTask(newTask);
      }

      setSuccess(true);
      setTask({
        id: "",
        title: "",
        description: "",
        due_date: "",
        status: "",
        priority: "",
      });

      if (onClose) {
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className={fieldErrors.title ? "border-red-500" : ""}
          />
          {fieldErrors.title && <p className="text-sm text-red-500 mt-1">{fieldErrors.title}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={task.description || ""}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className={fieldErrors.description ? "border-red-500" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={task.due_date ? task.due_date.split("T")[0] : ""}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            className={fieldErrors.due_date ? "border-red-500" : ""}
            min={new Date().toISOString().split("T")[0]}
          />
          {fieldErrors.due_date && <p className="text-sm text-red-500 mt-1">{fieldErrors.due_date}</p>}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={task.status || ""}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className={fieldErrors.status ? "border-red-500" : ""}
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="Not Started">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">Blocked</option>
        </select>
        {fieldErrors.status && <p className="text-sm text-red-500 mt-1">{fieldErrors.status}</p>}
      </div>

      <div className="mt-4">
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          value={task.priority || ""}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          className={fieldErrors.priority ? "border-red-500" : ""}
        >
          <option value="" disabled>
            Select priority
          </option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="High">Critical</option>
        </select>
        {fieldErrors.priority && <p className="text-sm text-red-500 mt-1">{fieldErrors.priority}</p>}
      </div>

      <Button type="submit" disabled={!task.title || !task.due_date || !task.status || !task.priority}>
        {editTask ? "Update Task" : "Add Task"}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{editTask ? "Task updated successfully!" : "Task added successfully!"}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

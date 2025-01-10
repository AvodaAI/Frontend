import { AddEditTask } from "@/types/task";
import { fetchWrapper } from "../fetchWrapper";

export const getTasksService = async (organization_id: number) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks?organization_id=${organization_id}&action=get-task`, {
    credentials: "include",
  });
};

export const updateTaskService = async ({
  taskId,
  title,
  assign_to,
  due_date,
  priority,
  time_tracked,
  description,
  status,
  organizationId,
}: AddEditTask) => {
  const body = {
    ...(title && { title }),
    ...(assign_to && { assign_to }),
    ...(due_date && { due_date }),
    ...(priority && { priority }),
    ...(time_tracked && { time_tracked }),
    ...(description && { description }),
    ...(status && { status }),
    ...(organizationId && { organization_id: organizationId }),
    action: "update-task",
  };

  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
};


export const addTaskService = async ({ title, assign_to, due_date, priority, time_tracked, description, status, organizationId }: AddEditTask) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      assign_to,
      due_date,
      priority,
      time_tracked,
      description,
      status,
      action: "create-task",
      organization_id: organizationId,
    }),
    credentials: "include",
  });
};

export const deleteTaskService = async ({ taskId, organizationId }: { taskId: string; organizationId: number }) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}?organization_id=${organizationId}&action=delete-task`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

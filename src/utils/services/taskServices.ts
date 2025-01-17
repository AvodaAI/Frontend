import { AddEditTaskPayload } from "@/types/task";
import { fetchWrapper } from "../fetchWrapper";

export const getTasksService = async (organization_id: number) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks?organization_id=${organization_id}&action=get-task`,
    {
      credentials: "include",
    }
  );
};

export const getAssignedTasksService = async (organization_id: number) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/assignedTask?organization_id=${organization_id}&action=get-task`,
    {
      credentials: "include",
    }
  );
};

export const getUsersService = async (organization_id: number) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/users/list?organization_id=${organization_id}&action=get-user`,
    {
      credentials: "include",
    }
  );
};

export const updateTaskService = async ({
  taskId,
  title,
  due_date,
  priority,
  time_tracked,
  description,
  status,
  assigned_to,
  organization_id,
}: AddEditTaskPayload) => {
  const body = {
    ...(title && { title }),
    ...(due_date && { due_date }),
    ...(priority && { priority }),
    ...(time_tracked && { time_tracked }),
    ...(description && { description }),
    ...(status && { status }),
    ...(assigned_to && { assigned_to }),
    ...(organization_id && { organization_id: organization_id }),
    action: "update-task",
  };

  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
};

export const addTaskService = async (data: AddEditTaskPayload) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
};

export const deleteTaskService = async ({
  taskId,
  organization_id,
}: {
  taskId: string;
  organization_id: number;
}) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}?organization_id=${organization_id}&action=delete-task`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
};

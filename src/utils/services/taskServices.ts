import { AddEditTaskPayload } from "@/types/task";
import { fetchWrapper } from "../fetchWrapper";

export const getTasksService = async (organization_id: number) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks?organization_id=${organization_id}&action=get-task`, {
    credentials: "include",
  });
};

export const getAssignedTasksService = async (organization_id: number) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks/assignedTask?organization_id=${organization_id}&action=get-task`, {
    credentials: "include",
  });
};

export const getUsersService = async (organization_id: number) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/users/list?organization_id=${organization_id}&action=get-user`, {
    credentials: "include",
  });
};

export const updateTaskService = async (data: AddEditTaskPayload) => {
  const { taskId, ...rest } = data;
  const body = { rest, action: "update-task" };
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
};

export const addTaskService = async (data: AddEditTaskPayload) => {
  const tasksPayload = data.tasks.map(({ project_name, ...task }) => ({ ...task, project: project_name, due_date: task.due_date ? task.due_date : null }));
  const body = { organization_id: data.organization_id, tasks: tasksPayload, action: "create-task" };
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
};

export const deleteTaskService = async ({ taskId, organization_id }: { taskId: string; organization_id: number }) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}?organization_id=${organization_id}&action=delete-task`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

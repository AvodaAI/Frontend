import { AddEditProject } from "@/types/project";
import { fetchWrapper } from "../fetchWrapper";

export const getProjects = async (organization_id: number) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/projects?organization_id=${organization_id}&action=get-project`, {
    credentials: "include",
  });
};

export const updateProjectService = async ({ name, projectId, start_date, end_date, description, status, organizationId }: AddEditProject) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date,
      end_date,
      description,
      status,
      name,
      action: "update-project",
      organization_id: organizationId,
    }),
    credentials: "include",
  });
};

export const addProjectService = async ({ name, start_date, end_date, description, status, organizationId }: AddEditProject) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      start_date,
      end_date,
      description,
      status,
      action: "create-project",
      organization_id: organizationId,
    }),
    credentials: "include",
  });
};

export const deleteProjectService = async ({ projectId, organizationId }: { projectId: string; organizationId: number }) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}?organization_id=${organizationId}&action=delete-project`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

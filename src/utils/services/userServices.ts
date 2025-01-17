import { AddEditProject } from "@/types/project";
import { fetchWrapper } from "../fetchWrapper";
import { NewUser, UpdateUser } from "@/types";

export const getUsers = async (organization_id: number) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/users/list?organization_id=${organization_id}&action=get-user`,
    {
      credentials: "include",
    }
  );
};

export const updateUserService = async (data: UpdateUser) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: data.action,
        first_name: data.first_name,
        last_name: data.last_name,
        hire_date: data.hire_date,
        role: data.role,
      }),
      credentials: "include",
    }
  );
};

export const addUserService = async (data: NewUser) => {
  return await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
};

export const deleteUserService = async ({
  userId,
  organizationId,
}: {
  userId: number;
  organizationId: number;
}) => {
  return await fetchWrapper(
    `${process.env.NEXT_PUBLIC_API_URL}/users/delete/${userId}?organization_id=${organizationId}&action=delete-user`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
};

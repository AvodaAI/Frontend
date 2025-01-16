// src/utils/services/managePermissionServices.ts
export const fetchPermissionService = async ({ organizationId, userId }: { organizationId: number; userId: number }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions/user/${userId}?organization_id=${organizationId}&action=get-permission`, {
    credentials: "include",
  });
};

export const updatePermissionService = async ({
  permissionsObject,
  permissionId,
  organizationId,
}: {
  permissionsObject: Record<string, boolean>;
  permissionId: string;
  organizationId: number;
}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      permissions: permissionsObject,
      organization_id: organizationId,
      action: "update-permission",
    }),
    credentials: "include",
  });
};

// src/app/org/[id]/(auth)/manage-permission/components/UpdatePermissionForm.tsx
"use client";

import { Permission, UpdatePermissionFormProps } from "@/types/permission";
import { defaultPermissions } from "@/utils/constant";
import { fetchPermissionService, updatePermissionService } from "@/utils/services/managePermissionServices";
import { useState, useEffect } from "react";

export default function UpdatePermissionForm({ orgId, userId }: UpdatePermissionFormProps) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [updatedPermissions, setUpdatedPermissions] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetchPermissionService({ organizationId: orgId, userId });
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        try {
          const data = await response.json();
          const userPermissions = Object.keys(data.data.permissions).filter((permission) => data.data.permissions[permission]);
          setUpdatedPermissions(userPermissions);
        } catch (parseError) {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
       setError("Error fetching permissions");
      }
    }

    fetchPermissions();
  }, [orgId, userId]);

  const handleCheckboxChange = (permissionName: string) => {
    setUpdatedPermissions((prev) => {
      if (prev.includes(permissionName)) {
        return prev.filter((perm) => perm !== permissionName);
      } else {
        return [...prev, permissionName];
      }
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    try {
      if (!permission) {
        throw new Error("Permission data not loaded");
      }

      const permissionsObject = defaultPermissions.reduce((acc, permissionName) => {
        acc[permissionName] = updatedPermissions.includes(permissionName);
        return acc;
      }, {} as Record<string, boolean>);

      const response = await updatePermissionService({
        organizationId: orgId,
        permissionId: permission.id,
        permissionsObject,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update permissions");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update permissions");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Permissions for User</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {defaultPermissions.map((permissionName) => (
          <div key={permissionName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={permissionName}
              checked={updatedPermissions.includes(permissionName)}
              onChange={() => handleCheckboxChange(permissionName)}
              className="h-4 w-4"
            />
            <label htmlFor={permissionName} className="text-sm">
              {permissionName}
            </label>
          </div>
        ))}
      </div>

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSubmit} disabled={!permission}>
        Update Permissions
      </button>

      {success && (
        <div className="mt-4 text-green-600">
          <strong>Success:</strong> Permissions updated successfully!
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

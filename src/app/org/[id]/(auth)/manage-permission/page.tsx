// src/app/org/[id]/(auth)/manage-permission/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UpdatePermissionForm from "./components/UpdatePermissionForm";
import { UserOrganization } from "@/types";
import { getUsersService } from "@/utils/services/taskServices";

export default function ManagePermissionPage() {
  const { id: org_id } = useParams();
  const [users, setUsers] = useState<UserOrganization[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const orgId = Number(org_id);
        if (isNaN(orgId)) {
          setError("Invalid organization ID");
          return;
        }
        const response = await getUsersService(orgId);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        setError("Error fetching users");
      }
    }

    fetchUsers();
  }, [org_id]);

  return (
    <div className="container mx-auto px-8 max-w-[80%]">
      <h1 className="text-2xl font-bold mb-4">Manage Permissions</h1>

      <div className="mb-6">
        <label htmlFor="user-select" className="block mb-2 font-medium">
          Select User:
        </label>
        <select
          id="user-select"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
          <option value="">-- Select a User --</option>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_first_name + " " + user.user_last_name}
              </option>
            ))}
        </select>
      </div>

      {selectedUser && <UpdatePermissionForm orgId={Number(org_id)} userId={selectedUser} />}

      {error && (
        <div className="mt-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

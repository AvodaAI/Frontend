// src/types/permission.ts
export interface Permission {
  id: string;
  permissions: Record<string, boolean>;
  organization_id: number;
  user_id: number;
  granted_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface UpdatePermissionFormProps {
  orgId: number;
  userId: number;
}
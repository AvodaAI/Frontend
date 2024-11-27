// src/types/invitation.ts
export interface Invitation {
  id: string;
  email_address: string;
  public_metadata: object;
  revoked: boolean;
  status: string;
  url: string | null;
  expires_at: number | null; // This should be included here
  created_at: number;
  updated_at: number;
}


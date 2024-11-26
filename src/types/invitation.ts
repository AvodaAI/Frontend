export interface Invitation {
  object: 'invitation';
  id: string;
  email_address: string;
  public_metadata?: Record<string, any>;
  revoked: boolean;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  url: string | null;
  expires_at: number | null;
  created_at: number;
  updated_at: number;
}

// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface PublicMetadata {
  type: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          created_at: string;
          last_sign_in_at: string | null;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          created_at?: string;
          last_sign_in_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          created_at?: string;
          last_sign_in_at?: string | null;
        };
      };
      invitations: {
        Row: {
          id: string;
          email_address: string;
          status: string;
          revoked: boolean;
          created_at: string;
          hire_date: string;
          public_metadata: PublicMetadata;
          url: string;
          expires_at: string | null;
          organization_id: number;
          created_by: number;
        };
        Insert: {
          id?: string;
          email_address: string;
          status?: string;
          revoked?: boolean;
          created_at?: string;
          hire_date: string;
          public_metadata: PublicMetadata;
          url: string;
          expires_at?: string | null;
          organization_id: number;
          created_by: number;
        };
        Update: {
          id?: string;
          email_address?: string;
          status?: string;
          revoked?: boolean;
          created_at?: string;
          hire_date: string;
          public_metadata: PublicMetadata;
          url: string;
          expires_at?: string | null;
          organization_id: number;
          created_by: number;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

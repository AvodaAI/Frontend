export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

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
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          email_address: string;
          status?: string;
          revoked?: boolean;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          email_address?: string;
          status?: string;
          revoked?: boolean;
          created_at?: string;
          expires_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

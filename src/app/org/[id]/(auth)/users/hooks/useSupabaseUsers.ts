// src/app/org/[id]/(auth)/users/hooks/useSupabaseUsers.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { Database } from '@/types/supabase';

  interface SupabaseUser {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    created_at: string;
    last_login: string | null;
  }

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const fetchSupabaseUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, created_at, last_login');

      if (error) {
        throw new Error(error.message);
      }
      setUsers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseUsers();
  }, []);

  return { users, loading, error, fetchSupabaseUsers };
};

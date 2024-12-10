// src/utils/supabase-user-operations.ts
import { supabase } from '@/utils/supabase/supabaseClient';

export const addUser = async (email: string, fetchSupabaseUsers: Function) => {
  try {
    const { error } = await supabase
      .from('users')
      .insert([{ email, created_at: new Date().toISOString() }]);
    if (error) {
      throw new Error(error.message);
    }
    fetchSupabaseUsers(); // Refresh the user list
  } catch (err) {
    alert(`Failed to add user: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

export const deleteUser = async (id: string, fetchSupabaseUsers: Function) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    fetchSupabaseUsers(); // Refresh the user list
  } catch (err) {
    alert(`Failed to delete user: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

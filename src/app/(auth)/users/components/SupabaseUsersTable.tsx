// src/app/(auth)/supabase-users/components/SupabaseUsersTable.tsx
'use client';

import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { formatUnixDate } from '@/utils/unixdate';
import { dataFallback } from '@/utils/datafallback';
import { useSupabaseUsers } from '@/app/(auth)/users/hooks/useSupabaseUsers';
import { addUser, deleteUser } from '@/utils/supabase/supabase-user-operations';

export default function SupabaseUsersTable() {
  const { users, loading, error, fetchSupabaseUsers } = useSupabaseUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-between p-4">
        <h2 className="text-lg font-bold">Users</h2>
        <Button onClick={() => {
          const email = prompt('Enter user email:');
          if (email) addUser(email, fetchSupabaseUsers);
        }} variant="default">
          Add User
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{`${dataFallback(user.first_name)} ${dataFallback(user.last_name)}` || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{dataFallback(formatUnixDate(new Date(user.created_at).getTime())) || 'N/A'}</TableCell>
              <TableCell>{dataFallback(user.last_login ? formatUnixDate(new Date(user.last_login).getTime()) : 'Never')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button onClick={() => alert(`View details for ${user.id}`)} variant="ghost" size="sm">
                    View Details
                  </Button>
                  <Button onClick={() => deleteUser(user.id, fetchSupabaseUsers)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

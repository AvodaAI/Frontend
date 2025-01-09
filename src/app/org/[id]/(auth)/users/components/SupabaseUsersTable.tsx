// src/app/org/[id]/(auth)/users/components/SupabaseUsersTable.tsx
'use client';

import { Button } from '@components/ui/button';
import { Download, Loader2, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { formatUnixDate } from '@/utils/unixdate';
import { dataFallback } from '@/utils/datafallback';
import { addUser, deleteUser } from '@/utils/supabase/supabase-user-operations';
import { useSupabaseUsers } from '../hooks/useSupabaseUsers';
import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import ExportUsersDataToExcel from './ExportUsersDataToExcel';
import { columns } from './columns';
import { SupabaseUser } from '@/types';
import { Heading } from '@/app/components/ui/heading';

export default function SupabaseUsersTable() {
  const { users, loading, error, fetchSupabaseUsers } = useSupabaseUsers();

  const deleteselectedUsers = () => { };

  const formattedUsers: SupabaseUser[] = users.map((user: any) => ({
    id: user.id,
    name: dataFallback(user.first_name) + dataFallback(user.last_name) || 'N/A',
    email: user.email,
    created_at: dataFallback(formatUnixDate(new Date(user.created_at).getTime())) || 'N/A',
    last_login: dataFallback(user.last_login ? formatUnixDate(new Date(user.last_login).getTime()) : 'Never'),
  }));

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
    <Card className="p-5">
      {/* <div className="rounded-md border">
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
                    <Button onClick={() => deleteUser(user.id.toString(), fetchSupabaseUsers)} variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
      </div>*/}
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading
          title={`Clerk Users (${formattedUsers.length})`}
          description="Manage Users"
        />
        <div></div>
        <div>
          <Button
            className={`bg-blue-600 hover:bg-blue-600`}
            onClick={() =>
              ExportUsersDataToExcel("notfiltered", formattedUsers)
            }
            title="disabled"
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      <DataTable
        searchKey="name"
        clickable={true}
        columns={columns}
        data={formattedUsers}
        onConfirmFunction={deleteselectedUsers}
        onExport={ExportUsersDataToExcel}
        buttonTitle="Delete Selection"
        ButtonIcon={Trash}
      />
    </Card>
  );
}

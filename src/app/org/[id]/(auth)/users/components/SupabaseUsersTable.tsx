// src/app/org/[id]/(auth)/users/components/SupabaseUsersTable.tsx
'use client';

import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { useAddUserModal } from '@/hooks/use-add-user-modal';
import { NewUser } from '@/types';
import { dataFallback } from '@/utils/datafallback';
import { formatUnixDate } from '@/utils/unixdate';
import { Button } from '@components/ui/button';
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useSupabaseUsers } from '../hooks/useSupabaseUsers';
import ExportUsersDataToExcel from './ExportUsersDataToExcel';
import { columns } from './columns';

export default function SupabaseUsersTable() {
  const { users, loading, error, fetchSupabaseUsers } = useSupabaseUsers();

  const deleteselectedUsers = () => { };
  const { onOpen } = useAddUserModal();
  
  const formattedUsers: NewUser[] = users.map((user: any) => ({
    id: user.id,
    first_name: dataFallback(user.first_name) || 'N/A',
    last_name: dataFallback(user.last_name) || 'N/A',
    email: user.email,
    role: 'user',
    status: 'active',
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
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading
          title={`Users (${formattedUsers.length})`}
          description="Here's a list of all users in your organization"
        />
        <div></div>
        <div className='flex space-x-2'>
          <Button
            className="bg-blue-500 hover:bg-blue-500"
            onClick={() => onOpen()}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button
            className={`bg-gray-400 hover:bg-gray-400`}
            onClick={() =>
              ExportUsersDataToExcel("notfiltered", formattedUsers)
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      <DataTable
        searchKey="first_name"
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

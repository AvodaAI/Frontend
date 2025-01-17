// src/app/org/[id]/(auth)/users/components/SupabaseUsersTable.tsx
'use client';

import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { useAddUserModal } from '@/app/org/[id]/(auth)/users/hooks/use-add-user-modal';
import { roles, userStatuses } from '@/data/data';
import { formatUsers } from '@/lib/formatter';
import { getUsers } from '@/utils/services/userServices';
import { Button } from '@components/ui/button';
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ExportUsersDataToExcel from './ExportUsersDataToExcel';
import { columns } from './columns';

export default function SupabaseUsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = orgId ? parseInt(orgId, 10) : -1

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await getUsers(id)
        const users = await res.json()
        setUsers(users.users ?? [])
      } catch (error) {
        setError(true)
        toast.error('Failed To Fetch Users')
      } finally {
        setLoading(false)
      }

    }
    fetchUsers();
  }, [])

  const deleteselectedUsers = () => { };
  const { onOpen } = useAddUserModal();

  const formattedUsers = formatUsers(users)

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
        filterableColumns={[
          {
            id: 'status',
            title: 'Status',
            options: userStatuses
          },
          {
            id: 'role',
            title: 'Role',
            options: roles
          },
        ]}
        onConfirmFunction={deleteselectedUsers}
        onExport={ExportUsersDataToExcel}
        buttonTitle="Delete Selection"
        ButtonIcon={Trash}
      />
    </Card>
  );
}

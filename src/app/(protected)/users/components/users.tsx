// src/app/(auth)/users/components/users.tsx
//TODO: Rename
//HighTODO: Add confirmation dialog before deleting
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatUnixDate } from '@/utils/unixdate';
import { dataFallback } from '@/utils/datafallback';

interface SupabaseUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function UsersTable () {
  const [ users, setUsers ] = useState<SupabaseUser[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  const fetchSupabaseUsers = async () => {
    setLoading( true );
    setError( null );
    try {
      const { data, error } = await supabase
        .from( 'users' ) // Assuming the table is named "users"
        .select( 'id, first_name, last_name, email, created_at, last_sign_in_at' );

      if ( error ) {
        throw new Error( error.message );
      }
      setUsers( data || [] );
    } catch ( err ) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError( errorMessage );
    } finally {
      setLoading( false );
    }
  };

  useEffect( () => {
    fetchSupabaseUsers();
  }, [] );

  const handleAddUser = async () => {
    const email = prompt( 'Enter user email:' );
    if ( !email ) return;
    try {
      const { error } = await supabase
        .from( 'users' )
        .insert( [ { email, created_at: new Date().toISOString() } ] );
      if ( error ) {
        throw new Error( error.message );
      }
      fetchSupabaseUsers(); // Refresh the user list
    } catch ( err ) {
      alert( `Failed to add user: ${ err instanceof Error ? err.message : 'Unknown error' }` );
    }
  };

  const handleDeleteUser = async ( id: string ) => {
    if ( !confirm( 'Are you sure you want to delete this user?' ) ) return;
    try {
      const { error } = await supabase
        .from( 'users' )
        .delete()
        .eq( 'id', id );
      if ( error ) {
        throw new Error( error.message );
      }
      fetchSupabaseUsers(); // Refresh the user list
    } catch ( err ) {
      alert( `Failed to delete user: ${ err instanceof Error ? err.message : 'Unknown error' }` );
    }
  };

  if ( loading ) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if ( error ) {
    return <div className="text-red-500 p-4">{ error }</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-between p-4">
        <h2 className="text-lg font-bold">Users</h2>
        <Button onClick={ handleAddUser } variant="default">
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
          { users.map( ( user ) => (
            <TableRow key={ user.id }>
              <TableCell>{ user.id }</TableCell>
              <TableCell>{ `${ dataFallback( user.first_name ) } ${ dataFallback( user.last_name ) }` || 'N/A' }</TableCell>
              <TableCell>{ user.email || 'N/A' }</TableCell>
              <TableCell>{ dataFallback( formatUnixDate( new Date( user.created_at ).getTime() ) ) || 'N/A' }</TableCell>
              <TableCell>
                { dataFallback(
                  user.last_sign_in_at ? formatUnixDate( new Date( user.last_sign_in_at ).getTime() ) : 'Never'
                ) }
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={ () => alert( `View details for ${ user.id }` ) }
                    variant="ghost"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={ () => handleDeleteUser( user.id ) }
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) ) }
        </TableBody>
      </Table>
    </div>
  );
}

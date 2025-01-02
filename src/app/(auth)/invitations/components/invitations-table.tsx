// src/app/(auth)/invitations/components/invitations-table.tsx
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import { Invitation } from '@/types/invitation';
import { cn } from '@/lib/utils';
import { usePagination } from '@/utils/invitations-pagination';
import { useSearch } from '@/utils/invitations-search';
import { Input } from '@components/ui/input';
import { formatUnixDate } from '@/utils/unixdate';
import { useToast } from '@/hooks/useToast';
import { RevokeSuccessToast } from './RevokeSuccessToast';
import { fetchWrapper } from '@/utils/fetchWrapper';

export default function InvitationsTable() {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokedId, setRevokedId] = useState<string | null>(null);

  // Search functionality
  const { searchTerm, setSearchTerm, filteredItems: filteredInvitations } = useSearch(invitations);

  // Pagination
  const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage } = usePagination(filteredInvitations);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/invitation/get-invitation?organization_id=88&action=get-invitation`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      setInvitations(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invitations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const updatedInvitation = {
        status: 'revoked',
        revoked: true,
        organization_id: 88,
        action: "update-invitation"
      }

      const res = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/invitation/${invitationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInvitation),
        credentials: "include"
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update invitation')
      }

      const data = await res.json()

      // Refresh invitations after successful revoke
      fetchInvitations();
      setRevokedId(invitationId);
      toast({
        title: 'Invitation Revoked',
        description: `Invitation is successfully revoked.`,
      });
    } catch (err) {
      setError('An error occurred while revoking the invitation');
      toast({
        title: 'Error',
        description: 'Failed to revoke the invitation.',
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full space-y-4">
      {revokedId && <RevokeSuccessToast invitationId={revokedId} />}
      {/* Search Input */}
      <Input
        placeholder="Search invitations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {/* Desktop view */}
      <div className="hidden md:block overflow-hidden">
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px] font-semibold">Email</TableHead>
              <TableHead className="w-[120px] font-semibold">Status</TableHead>
              <TableHead className="w-[150px] font-semibold">Invited At</TableHead>
              <TableHead className="w-[150px] font-semibold">Expires At</TableHead>
              <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((invitation) => (
              <TableRow key={invitation.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{invitation.email_address}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                      {
                        'bg-green-100 text-green-700': invitation.status === 'accepted',
                        'bg-yellow-100 text-yellow-700': invitation.status === 'pending',
                        'bg-red-100 text-red-700': invitation.revoked || invitation.status === 'revoked',
                      }
                    )}
                  >
                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatUnixDate(invitation.created_at)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatUnixDate(invitation.expires_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={invitation.status !== 'pending' ? 'ghost' : 'destructive'}
                    size="sm"
                    className={cn(
                      'cursor-pointer',
                      invitation.status !== 'pending' && 'opacity-50'
                    )}
                    disabled={invitation.status !== 'pending'}
                    onClick={() => handleRevokeInvitation(invitation.id)}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={paginationState.currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {paginationState.currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={paginationState.currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden space-y-4">
        {paginatedItems.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-card p-4 rounded-lg border shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{invitation.email_address}</div>
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                  {
                    'bg-green-100 text-green-700': invitation.status === 'accepted',
                    'bg-yellow-100 text-yellow-700': invitation.status === 'pending',
                    'bg-red-100 text-red-700': invitation.status === 'revoked',
                  }
                )}
              >
                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Invited At</div>
                <div>{formatUnixDate(invitation.created_at)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Expires At</div>
                <div>{formatUnixDate(invitation.expires_at)}</div>
              </div>
            </div>
            <div className="pt-2">
              <Button
                hidden={invitation.status !== 'pending'}
                variant={invitation.status !== 'pending' ? 'ghost' : 'destructive'}
                size="sm"
                className={cn(
                  'w-full cursor-pointer',
                  invitation.status !== 'pending' && 'opacity-50'
                )}
                disabled={invitation.status !== 'pending'}
                onClick={() => handleRevokeInvitation(invitation.id)}
              >
                Revoke
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

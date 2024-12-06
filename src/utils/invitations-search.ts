// src/utils/invitations-search.ts
import { useState, useMemo } from 'react';
import { Invitation } from '@/types/invitation';

export const useSearch = (items: Invitation[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive search across multiple fields
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    return items.filter(item => 
      item.email_address.toLowerCase().includes(lowercasedSearchTerm) ||
      item.status.toLowerCase().includes(lowercasedSearchTerm) ||
      formattedDate(item.created_at)?.toLowerCase().includes(lowercasedSearchTerm) ||
      formattedDate(item.expires_at)?.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [items, searchTerm]);

  // Utility function to format date (match the one in the original component)
  const formattedDate = (unixDate: number | null | undefined): string => {
    if (unixDate === null || unixDate === undefined) return 'N/A';
    return new Date(unixDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};
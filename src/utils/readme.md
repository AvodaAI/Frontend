Updated: 2024-12-03
# Utils Directory

This directory contains utility functions used throughout the employee management application. Below is a description of each utility file:

## Files

### `datafallback.ts`
A utility function that provides fallback values for potentially undefined data.
- Exports `dataFallback` function
- Takes a value and an optional fallback string (defaults to 'No data available')
- Returns the original value if it exists, otherwise returns the fallback string

### `invitations-pagination.ts`
Provides pagination functionality for invitation lists.
- Exports `usePagination` hook for managing paginated data
- Features:
  - Page navigation
  - Items per page control
  - Total items tracking
  - Automatic page calculation

### `invitations-search.ts`
Implements search functionality for invitation records.
- Exports `useSearch` hook
- Performs comprehensive search across multiple invitation fields:
  - Email address
  - Status
  - Creation date
  - Expiration date
- Case-insensitive search with automatic trimming

### `unixdate.ts`
Handles Unix timestamp formatting.
- Exports `formatUnixDate` function
- Converts Unix timestamps to human-readable dates
- Returns 'N/A' for null or undefined values
- Formats dates in 'MMM DD, YYYY' style (e.g., "Jan 1, 2024")
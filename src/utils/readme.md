V1. 2024-01-07

# Utility Functions Directory

This directory contains utility functions used across the Employee Management System. These functions provide reusable logic for data manipulation, formatting, and other common tasks.

## Directory Structure
```
utils/
├── datafallback.ts # Provides fallback values for data
├── fetchWrapper.ts # Wraps fetch API calls
├── invitations-pagination.ts # Handles pagination for invitations
├── invitations-search.ts # Handles search functionality for invitations
├── unixdate.ts # Formats Unix timestamps to readable dates
└── readme.md # This file
```

## Available Utilities

### dataFallback
**Purpose**: Provides a fallback value if the given value is null or undefined.
```typescript
const value = dataFallback(someValue, 'Default Value');
```
**Features**:
- Returns the original value if it's not null or undefined.
- Returns a default string if the value is null or undefined.
- Customizable fallback string.

### fetchWrapper
**Purpose**: Wraps the native `fetch` API to handle common tasks like error handling and setting headers.
``` typescript
const response = await fetchWrapper('/api/data', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
});
```
**Features**:
- Handles 401 Unauthorized responses by redirecting to the login page.
- Logs 403 Forbidden errors to the console.
- Provides a consistent way to make API calls.
- Includes error handling for fetch failures.

### usePagination
**Purpose**: Provides pagination logic for lists of items.
``` typescript
const { paginatedItems, paginationState, totalPages, goToNextPage, goToPreviousPage, goToPage } = usePagination(items, 10);
```
**Features**:
- Manages current page, items per page, and total items.
- Calculates paginated items based on the current page.
- Provides functions to navigate between pages.
- Uses `useMemo` for optimized calculations.

### useSearch
**Purpose**: Provides search functionality for lists of items.
``` typescript
const { searchTerm, setSearchTerm, filteredItems } = useSearch(items);
```
**Features**:
- Filters items based on a search term.
- Performs a case-insensitive search across multiple fields.
- Uses `useMemo` for optimized filtering.
- Includes a utility function to format dates for search.

### formatUnixDate
**Purpose**: Formats a Unix timestamp into a readable date string.
```typescript
const formattedDate = formatUnixDate(unixTimestamp);
```
**Features**:
- Converts a Unix timestamp to a date string in `MM/DD/YYYY` format.
- Returns 'N/A' if the timestamp is null or undefined.

## Best Practices

1. **Single Responsibility**:
   - Each utility should have a single, well-defined purpose.

2. **Reusability**:
   - Utilities should be designed to be reusable across different parts of the application.

3. **Type Safety**:
   - Use TypeScript to ensure type safety and prevent errors.

4. **Error Handling**:
   - Implement proper error handling where necessary.

5. **Performance**:
   - Optimize utilities for performance, especially those used frequently.

## Usage Guidelines

1. **Import**:
   - Import utilities directly into the components or modules where they are needed.

2. **Parameters**:
   - Ensure that parameters passed to utilities are of the correct type.

3. **Return Values**:
   - Use the return values of utilities appropriately.

4. **Testing**:
   - Test utilities thoroughly to ensure they function as expected.
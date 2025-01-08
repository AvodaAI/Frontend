Last Updated: 2024-12-02
# Server Actions Directory

This directory contains Next.js server actions for the Employee Management System. These actions provide secure, server-side functionality for data fetching and manipulation, leveraging Next.js 'use server' directives for enhanced security and performance.

## Directory Structure

```
actions/
├── getEmployees.ts    # Employee data fetching action
├── getInvitations.ts  # Invitation data fetching action
└── readme.md         # This file
```

## Available Actions

### getEmployees
**Purpose**: Fetches employee data with filtering and pagination
```typescript
interface GetEmployeesParams {
  limit?: number
  offset?: number
  status?: 'active' | 'inactive'
}

const response = await getEmployees({
  limit: 10,
  offset: 0,
  status: 'active'
})
```
**Features**:
- Pagination support
- Status filtering
- Integration with Supabase for user management
- Type-safe response format

### getInvitations
**Purpose**: Retrieves invitation data with filtering and pagination
```typescript
interface GetInvitationsParams {
  limit?: number
  offset?: number
  status?: 'pending' | 'accepted' | 'revoked'
}

const response = await getInvitations({
  limit: 10,
  offset: 0,
  status: 'pending'
})
```
**Features**:
- Pagination support
- Status-based filtering
- Clerk API integration
- Type-safe invitation handling
- Error handling with detailed responses

## Response Format

All actions follow a consistent response format:
```typescript
interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
  total?: number
}
```

## Integration Points

- **Database**: Uses Supabase with PostgreSQL via `@/db`
- **Authentication**: Integrates with Supabase Auth via `?`
- **Types**: Leverages shared types from `@/db/types` and `@/types`
- **Schema**: Uses database schema from `@/db/schema`

## Best Practices

1. **Error Handling**:
   - Use try-catch blocks for error management
   - Return typed error responses
   - Include meaningful error messages
   - Handle edge cases gracefully

2. **Performance**:
   - Implement pagination for large datasets
   - Use efficient database queries
   - Cache results when appropriate
   - Minimize database round trips

3. **Security**:
   - Always use 'use server' directive
   - Validate input parameters
   - Implement proper access control
   - Sanitize database queries

4. **Type Safety**:
   - Define clear interface contracts
   - Use TypeScript for all parameters
   - Maintain consistent response types
   - Document type constraints

## Usage Guidelines

1. **Client Components**:
```typescript
'use client'

import { getEmployees } from '@/app/actions/getEmployees'

// Use in async function
const data = await getEmployees({ limit: 10 })
```

2. **Error Handling**:
```typescript
try {
  const response = await getEmployees()
  if (!response.success) {
    // Handle error case
    console.error(response.error)
  }
  // Process response.data
} catch (error) {
  // Handle unexpected errors
}
```

3. **Pagination**:
```typescript
const response = await getEmployees({
  limit: 10,
  offset: (page - 1) * 10
})
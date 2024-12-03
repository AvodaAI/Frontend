Last Updated: 2024-12-02
# Invitations API Directory

This directory contains the invitation management API endpoints for the Employee Management System. These endpoints handle employee invitation workflows, including retrieving and accepting invitations, integrated with Clerk for secure invitation management.

## Directory Structure

```
invitations/
├── accept/
│   └── route.ts    # Handles invitation acceptance
├── get/
│   └── route.ts    # Retrieves invitation list
├── page.tsx        # Invitation management UI
└── readme.md       # This file
```

## API Endpoints

### Get Invitations (`/api/invitations/get`)
- **Method**: GET
- **Purpose**: Retrieves list of invitations for the authenticated user
- **Authentication**: Requires valid user authentication
- **Query Parameters**:
  ```typescript
  {
    limit?: number,   // Optional: Max number of invitations (1-500)
    offset?: number   // Optional: Pagination offset
  }
  ```
- **Features**:
  - Pagination support with configurable limits
  - Authentication verification
  - Sorting by creation date

### Accept Invitation (`/api/invitations/accept`)
- **Method**: POST
- **Purpose**: Processes and accepts employee invitations
- **Request Body**:
  ```typescript
  {
    invitationId: string  // Required: Clerk invitation ID
  }
  ```
- **Features**:
  - Invitation validation
  - Status verification
  - Integration with Clerk invitation system
  - User record creation upon acceptance

## Integration Points

- **Authentication**: Uses Clerk for user authentication and invitation management
- **Database**: Integrates with PostgreSQL via `@/db`
- **Schema**: Utilizes user schema defined in `@/db/schema`
- **UI Components**: Connects with `InvitationsTable` component for invitation management interface

## Best Practices

1. Always verify invitation validity before processing
2. Check invitation status to prevent duplicate processing
3. Implement proper error handling for expired or invalid invitations
4. Use pagination for large invitation lists
5. Maintain audit logs of invitation actions

## Error Handling

All endpoints follow a consistent error response format:
```typescript
{
  error: string,    // Error message
  details?: any     // Optional additional error details
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid invitation)
- 401: Unauthorized
- 403: Forbidden
- 404: Invitation Not Found
- 500: Internal Server Error

## Security Considerations

1. All endpoints require authentication
2. Invitations are single-use only
3. Invitations expire after a set period
4. Rate limiting on invitation endpoints
5. Validation of invitation ownership
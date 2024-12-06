Last Updated: 2024-12-02
# Employee API Directory

This directory contains the employee management API endpoints for the Employee Management System. These endpoints handle all employee-related operations including adding, editing, listing, and removing employees from the system.

## Directory Structure

```
employee/
├── add/
│   └── route.ts    # Handles employee creation
├── delete/
│   └── route.ts    # Handles employee removal
├── edit/
│   └── route.ts    # Handles employee updates
├── list/
│   └── route.ts    # Retrieves employee list
└── readme.md       # This file
```

## API Endpoints

### Add Employee (`/api/employee/add`)
- **Method**: POST
- **Purpose**: Creates new employee records
- **Request Body**:
  ```typescript
  {
    first_name?: string,    // Optional: Employee's first name
    last_name: string,      // Required: Employee's last name
    email: string,          // Required: Employee's email
    position?: string,      // Optional: Job position
    hire_date: string,      // Required: Date of hire
    city?: string,          // Optional: City
    country?: string,       // Optional: Country
    password?: string,      // Required for non-dashboard creation
    isFromDashboard?: boolean // Indicates if created from admin dashboard
  }
  ```
- **Features**:
  - Automatic password generation for dashboard-created employees
  - Integration with Clerk for user management
  - Email validation and duplicate checking

### List Employees (`/api/employee/list`)
- **Method**: GET
- **Purpose**: Retrieves all employees
- **Response**: Array of employee records ordered by creation date
- **Features**:
  - Pagination support
  - Sorted by most recently created

### Edit Employee (`/api/employee/edit`)
- **Method**: PUT
- **Purpose**: Updates existing employee information
- **Features**:
  - Partial updates supported
  - Field validation
  - Audit logging of changes

### Delete Employee (`/api/employee/delete`)
- **Method**: DELETE
- **Purpose**: Removes employee records
- **Features**:
  - Soft deletion support
  - Cascade deletion of related records
  - Permission verification

## Integration Points

- **Database**: Uses configured PostgreSQL database via `@/db`
- **Authentication**: Integrates with Clerk for user management
- **Schema**: Utilizes user schema defined in `@/db/schema`
- **Middleware**: Protected by authentication middleware

## Best Practices

1. Always validate required fields before processing
2. Handle email uniqueness constraints
3. Implement proper error handling and status codes
4. Log significant operations for audit purposes
5. Use transaction management for multi-step operations

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
- 400: Bad Request (invalid input)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
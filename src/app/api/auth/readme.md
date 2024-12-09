Last Updated: 2024-12-02
# Authentication API Directory

This directory contains the authentication-related API endpoints for the Employee Management System. The authentication system is built using Next.js API routes and integrates with Clerk for secure user authentication.

## Directory Structure

```
auth/
├── signin/
│   └── route.ts    # Handles user sign-in
├── signup/
│   └── route.ts    # Handles user registration
└── readme.md       # This file
```

## API Endpoints

### Sign In (`/api/auth/signin`)
- **Method**: POST
- **Purpose**: Authenticates existing users
- **Validation**: Uses Zod schema for email and password validation
- **Request Body**:
  ```typescript
  {
    email: string,    // Valid email address
    password: string  // Minimum 6 characters
  }
  ```

### Sign Up (`/api/auth/signup`)
- **Method**: POST
- **Purpose**: Registers new users in the system
- **Validation**: Uses Zod schema for input validation
- **Request Body**:
  ```typescript
  {
    email: string,      // Required: Valid email address
    password: string,   // Required: Minimum 6 characters
    auth_id?: string,  // Optional: Supabase user ID
    status?: string,    // Optional: User status
    first_name?: string,// Optional: User's first name
    last_name?: string, // Optional: User's last name
    position?: string,  // Optional: Job position
    city?: string,      // Optional: City
    country?: string    // Optional: Country
  }
  ```

## Security Features

1. **Input Validation**: All endpoints use Zod schemas for strict input validation
2. **Password Security**: Passwords are handled securely using bcrypt for hashing
3. **Authentication**: Integrated with Clerk for robust authentication
4. **Protected Routes**: Works in conjunction with Next.js middleware for route protection

## Integration Points

- **Database**: Uses a configured database connection via `@/db`
- **Schema**: Utilizes user schema defined in `@/db/schema`
- **Clerk**: Integrates with Clerk authentication service
- **Middleware**: Works with Next.js middleware for route protection

## Best Practices

1. Always use the provided validation schemas
2. Handle errors appropriately using the established error response format
3. Follow the existing pattern for new authentication-related endpoints
4. Ensure proper error handling and validation before database operations
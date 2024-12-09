# Mandatory Developer Guidelines

## Code Quality Standards

### Code Changes & Pull Requests
1. **Dependencies**
   - Every new package must be added to `package.json` with exact version numbers
   - All imports must be at the top of the file, grouped by: third-party, internal, types
   - Document any new dependencies in `README.md` under "Dependencies"

2. **Code Structure**
   - Maximum file length: 500 lines
   - Maximum function length: 50 lines
   - Maximum line length: 200 characters
   - Use TypeScript for all new files
   - Enforce strict type checking (`"strict": true` in tsconfig.json)

3. **UI Development**
   - Use only TailwindCSS or supporting frameworks like ShadCN or Radix for styling - no custom CSS files
   - Implement error states for all user inputs
   - Include loading states for all async operations
   - Use design system components from `/components/ui/*`. If there is no component that fits

### Debugging Requirements
1. **Logging**
   - Use structured logging with fixed levels: ERROR, WARN, INFO, DEBUG
   - Include request ID in all backend logs
   - Log all API errors with stack traces

2. **Error Handling**
   - Implement error boundaries at route level
   - Use custom error classes for business logic errors
   - Include user-friendly error messages
   - Log all 4xx and 5xx errors

### API Integration Rules
1. **Security**
   - Store ALL secrets in `.env` (never in code)
   - Use environment variables through `process.env`
   - Add request validation using Zod schemas

2. **Implementation**
   - Cache responses where appropriate
   - Add timeout for all external API calls (default: 10s)

## Technical Stack Specifications

### Frontend
- **Framework:** NextJS 15
  - Use App Router
  - Feature Based Architecture
  - Use Server Components by default

- **Styling:** TailwindCSS V4
  - Custom colors defined in `globals.css`
  - Use CSS variables for theme values

### Backend
- **Database:** PostgreSQL 15+
  - Use connection pooling
  - Implement soft deletes
  - Add indices for frequently queried columns
  - Maximum query time: 5s
  - Using Supabase Database

- **ORM:** Drizzle
  - Define schemas in `/db/schema`
  - Use migrations for all schema changes
  - Implement database transactions for multi-table operations
  - Add database constraints at schema level

- **Authentication:** Supabase Auth
  - Implement role-based access control
  - Use middleware for protected routes
  - Add session management
  - Implement MFA where required

## Pre-Commit Checklist

- [ ] Remove all console.log statements
- [ ] Add any TODO or FIXME comments for smaller points
- [ ] Handle loading/error states

## Development Environment Setup

### Required Tools & Versions
- Node.js v18.x LTS
- PostgreSQL 15+
- IDE extensions:
  - Code Spell Checker
  - ToDo Tree
  - Prettier (Optional)

Remember: These guidelines are mandatory with no exceptions.

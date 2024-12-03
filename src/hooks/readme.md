Last Updated: 2024-12-02
# Custom React Hooks Directory

This directory contains reusable custom React hooks that provide shared functionality across the Employee Management System. These hooks encapsulate common logic and state management patterns used throughout the application.

## Directory Structure

```
hooks/
├── use-role.ts     # User role management hook
├── use-toast.ts    # Toast notification system hook
├── useTimer.ts     # Timer functionality hook
└── readme.md       # This file
```

## Available Hooks

### useUserRole
**Purpose**: Manages user role and permissions
```typescript
const { role, isAdmin, isEmployee, isLoaded } = useUserRole()
```
**Features**:
- Integrates with Clerk authentication
- Provides role-based access control
- Automatically updates on user changes
- Type-safe role checking with `isAdmin` and `isEmployee`

### useToast
**Purpose**: Manages toast notifications system
```typescript
const { toast } = useToast()

// Usage
toast({
  title: "Success",
  description: "Operation completed",
  variant: "default" | "destructive"
})
```
**Features**:
- Queue management for multiple toasts
- Customizable duration
- Support for actions within toasts
- Limit control to prevent toast overflow
- Auto-dismiss functionality

### useTimer
**Purpose**: Provides timer functionality with precise control
```typescript
const { 
  time,
  isRunning,
  start,
  pause,
  reset,
  getElapsedTime
} = useTimer()
```
**Features**:
- Start/pause/reset controls
- Accurate time tracking
- Memory leak prevention
- Elapsed time calculation
- Auto-cleanup on component unmount

## Best Practices

1. **Hook Naming**:
   - Prefix all hooks with `use`
   - Use camelCase for naming
   - Name should reflect the hook's primary purpose

2. **Implementation Guidelines**:
   - Keep hooks focused on a single responsibility
   - Handle cleanup in useEffect when necessary
   - Use TypeScript for type safety
   - Document parameters and return values

3. **Usage Guidelines**:
   - Only call hooks at the top level of functional components
   - Don't call hooks inside loops or conditions
   - Ensure consistent dependencies array in useEffect

## Error Handling

Hooks should implement proper error handling:
- Clear error states
- Meaningful error messages
- Graceful fallbacks
- Type-safe error handling

## Performance Considerations

1. **Memoization**:
   - Use useCallback for function memoization
   - Use useMemo for expensive calculations
   - Implement proper dependency arrays

2. **Cleanup**:
   - Clear intervals and timeouts
   - Unsubscribe from subscriptions
   - Cancel pending requests

3. **State Updates**:
   - Batch related state updates
   - Use functional updates for state depending on previous value
   - Avoid unnecessary rerenders

## Testing

When testing components that use these hooks:
1. Mock hook returns when necessary
2. Test edge cases and error states
3. Verify cleanup functions
4. Check for memory leaks
5. Test with different parameters
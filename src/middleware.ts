//src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { RedirectToSignIn } from '@clerk/nextjs';

// Define an interface for session claims to provide type safety
interface SessionClaims {
  metadata?: {
    type?: string;
  };
}

const signInPath = '/login'
const signUpPath = '/signup'
const publicPaths = ['/', signInPath, signUpPath, '/status']

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Use optional chaining and provide a default value
  const role = (sessionClaims as SessionClaims)?.metadata?.type ?? 'admin'

  // Public routes
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Require authentication for non-public routes
  if (!userId) {
    return RedirectToSignIn({ redirectUrl: req.url })
  }

  // Role-based access control
  const adminRoutes = ['/employees', '/invitations']
  const employeeRoutes = ['/dashboard', '/settings', '/time-tracking']

  if (adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (role === 'employee' && employeeRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect if unauthorized
  return NextResponse.redirect(new URL('/dashboard', req.url))
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
}

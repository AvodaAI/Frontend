import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoutes = createRouteMatcher([
  '/dashboard',
  '/employees',
  '/time-tracking',
  '/invitations',
  '/settings',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  if (!userId && isProtectedRoutes(req)) {
    console.log('User is not signed in')
    return redirectToSignIn()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
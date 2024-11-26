// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/api/webhook/clerk"],
  ignoredRoutes: ["/api/webhook/clerk"]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// Middleware function
export function middleware(request: NextRequest) {
  // Add your middleware logic here if needed
  console.log("Middleware is running for:", request.nextUrl.pathname);

  // You can modify the response or just return the request as it is
  return NextResponse.next();
}

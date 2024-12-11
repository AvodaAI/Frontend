// src/middleware.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function middleware(request: Request) {
  const res = NextResponse.next();

  const token = request.headers
    .get("cookie")
    ?.match(/supabase-auth-token=([^;]+)/)?.[1];

  if (!token) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/employees/:path*", "/time-tracking/:path*"], // Protect these routes
};

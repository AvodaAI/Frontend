// src/app/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: user } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              Employee Manager
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            {!isSignedIn && !isHomePage && (
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            )}
            {isSignedIn ? (
              <>
                <Link
                  href="dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === "dashboard"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              href="/status"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Status
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

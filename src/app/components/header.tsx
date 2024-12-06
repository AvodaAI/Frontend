// src/app/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function Header() {
  const isSignedIn = false;
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
                  href="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === "/dashboard" 
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                  <Button variant="outline">
                    Sign In
                  </Button>
                  <Button variant="default">
                    Sign Up
                  </Button>
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

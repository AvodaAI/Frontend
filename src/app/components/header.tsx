// src/app/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Employee Management
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            {!isSignedIn && !isHomePage && (
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
            )}
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium transition-colors hover:text-primary">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

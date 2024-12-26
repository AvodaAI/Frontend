//src/app/components/layout/Header.tsx

'use client';
import React from 'react';

import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useRole";

// Navigation links
const navigation = [
  { name: 'Dashboard', href: '/dashboard', adminOnly: false },
  { name: 'Organization', href: '/organization', adminOnly: true },
  { name: 'Employees', href: '/employees', adminOnly: true },
  { name: 'Time Tracking', href: '/time-tracking', adminOnly: false },
  { name: 'Invitations', href: '/invitations', adminOnly: true },
  { name: 'Settings', href: '/settings', adminOnly: false },
  { name: 'Status', href: '/status', adminOnly: false },
];

export function Header() {
  const pathname = usePathname();
  const { isAdmin } = useUserRole();

  // Filter navigation based on the user's role
  const filteredNavigation = navigation.filter(
    item => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Signout failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex justify-between h-16 md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="text-3xl font-bold sm:inline-block">
              Employee Manager
            </span>
          </Link>
          <div className="flex space-x-3">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex  items-center justify-between space-x-2 md:justify-end min-w-[100px]">
              <div className="flex items-center space-x-3 min-w-[100px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  aria-label="Sign Out"
                >
                  Sign Out
                </Button>
              </div>

            </div>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="font-bold">Employee Manager</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10">
              <div className="flex flex-col space-y-3">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-foreground/60 transition-colors hover:text-foreground",
                      pathname === item.href && "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

'use client'

import { UserButton } from "@clerk/nextjs"
import { Bell, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@components/ui/sheet"
import { cn } from "@/lib/utils"
import { useUserRole } from "@/hooks/use-role"

//FIXME: After fixing RBAC, update adminOnly
const navigation = [
  { name: 'Dashboard', href: '/dashboard', adminOnly: false },
  { name: 'Employees', href: '/employees', adminOnly: false },
  { name: 'Time Tracking', href: '/time-tracking', adminOnly: false },
  { name: 'Invitations', href: '/invitations', adminOnly: false },
  { name: 'Settings', href: '/settings', adminOnly: false },
]

export function Header() {
  const pathname = usePathname()
  const { isAdmin } = useUserRole()

  const filteredNavigation = navigation.filter(
    item => !item.adminOnly || (item.adminOnly && isAdmin)
  )

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex justify-between h-16 md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="text-3xl font-bold sm:inline-block">
              Employee Manager
            </span>
          </Link>
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

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  )
}

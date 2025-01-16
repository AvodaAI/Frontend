'use client';

import { Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Button } from '@components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useRole';
import { useState, useEffect, useCallback } from 'react';
import { fetchWrapper } from '@/utils/fetchWrapper';

const navigation = [
  { name: 'Dashboard', href: 'dashboard' },
  { name: 'Organization', href: 'organization', permission: 'create-organization', adminOnly: true },
  { name: 'Invitations', href: 'invitations', permission: 'invite-user', adminOnly: true },
  { name: 'Projects', href: 'projects', permission: 'create-project', adminOnly: false },
  { name: 'Tasks', href: 'tasks', permission: 'create-task', adminOnly: false },
  { name: 'Assigned Tasks', href: 'assigned-task', adminOnly: false },
  { name: 'Time Tracking', href: 'time-tracking', adminOnly: false },
  { name: 'Time Logs', href: 'time-logs', permission: 'get-timelog', adminOnly: true },
  { name: 'Manage User Permission', href: 'manage-permission', permission: 'update-permission', adminOnly: true },
  { name: 'Settings', href: 'settings', adminOnly: false },
  { name: 'Status', href: '/status', adminOnly: false },
];

export function Header() {
  const pathname = usePathname();
  const { id: org_id } = useParams();
  const { isAdmin } = useUserRole();
  const [orgList, setOrgList] = useState<{ organization_id: number, organization_name: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [permissions, setPermissions] = useState<any>({});

  const fetchPermission = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions/?organization_id=${org_id}&action=get-organization`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching permissions');
      }
    } catch (error) {
      console.error('Permission fetch error:', error);
      setPermissions({});
    }
  }, [org_id]);

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/organizations/?action=get-organization`, { credentials: 'include' });
      const data = await response.json();
      setOrgList(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    }
  }, []);

  useEffect(() => {
    fetchPermission();
    fetchOrganizations();
  }, [fetchPermission, fetchOrganizations]);

  const filteredNavigation = navigation.filter((item) => {
    if (!item.permission) return item;
    const hasPermission = permissions[item.permission];
    return (!item.adminOnly || (item.adminOnly && isAdmin)) && hasPermission;
  });

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) window.location.href = '/';
      } else {
        throw new Error(`Signout failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex justify-between h-16 md:flex">
          <Link href="dashboard" className="mr-6 flex items-center space-x-2">
            <span className="text-3xl font-bold sm:inline-block">Employee Manager</span>
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
            <div className="flex items-center justify-between space-x-2 md:justify-end min-w-[100px] gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-auto"
                  aria-label="Organizations"
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  <ChevronDown className="h-4 w-4" />
                  <span className="ml-1 text-sm">Organizations</span>
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                    <ul className="text-sm">
                      {orgList.map((org) => (
                        <li key={org.organization_id} style={{ background: org.organization_id === Number(org_id) ? "#F5F5F5" : "transparent" }}>
                          <Link
                            href={`/org/${org.organization_id}/dashboard`}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            {org.organization_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
                Sign Out
              </Button>
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
            <Link href="dashboard" className="flex items-center space-x-2">
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

// src/app/org/[id]/(auth)/dashboard/old-layout.tsx
"use client";

import { Toaster } from '@components/ui/toaster';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase(); // Access Supabase client from context
  const router = useRouter();  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    } else {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Employee Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
        <Toaster />
      </main>
    </div>
  );
}

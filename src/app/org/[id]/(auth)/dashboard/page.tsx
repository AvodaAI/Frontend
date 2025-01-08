// src/app/org/[id]/(auth)/dashboard/page.tsx
import UserDetails from './components/userDetails';

export default async function Page() {

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <UserDetails />
      </div>
    </div>
  );
}

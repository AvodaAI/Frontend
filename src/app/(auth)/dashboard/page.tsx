import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase/supabaseClient';
import UserDetails from './components/userDetails';


const getSession = async () => {
  const cookieStore = await cookies()
  const TOKEN = cookieStore.get('supabase-auth-token')
  const user = await supabase.auth.getUser(TOKEN?.value);
  return user
}

export default async function Page() {
  const { data: { user } } = await getSession()

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <UserDetails user={user} />
      </div>
    </div>
  );
}

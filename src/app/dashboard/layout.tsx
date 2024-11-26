import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {Toaster} from '@/app/components/ui/toaster'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}

//src/app/page.tsx
import { SignIn } from './components/auth/SignIn'
import { SignUp } from './components/auth/SignUp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

export default function Home() {
  return (
    <div className="container mx-auto max-w-md mt-10">
      <h1 className="text-2xl font-bold mb-5 text-center">Employee Management System</h1>
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignIn />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

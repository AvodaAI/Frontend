//src/app/page.tsx

import React from 'react';

import { Header } from "./components/header";
import { SignIn } from "@components/auth/SignIn";
import { SignUp } from "@components/auth/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Section } from "@components/section";
import { Container } from "@components/container";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("supabase-auth-token");
  if (token) {
    const { error } = await supabase.auth.getUser(token.value);
    if (!error) {
      redirect("/dashboard");
    }
  }
  return (
    <>
      <Header />
      <main className="flex-1">
        <Section>
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Employee Management System</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Streamline your workforce management with our comprehensive employee management solution.
                </p>
              </div>
              <div className="space-x-4">
                <a
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="/dashboard"
                >
                  Get Started
                </a>
                <a
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#features"
                >
                  Learn More
                </a>
              </div>
            </div>
          </Container>
        </Section>
        <Section id="features" className="bg-gray-100">
          <Container>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Employee Management</h3>
                <p className="text-gray-500 dark:text-gray-400">Efficiently manage employee information, roles, and responsibilities.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Performance Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">Monitor and evaluate employee performance with ease.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Secure Access</h3>
                <p className="text-gray-500 dark:text-gray-400">Role-based access control ensures data security and privacy.</p>
              </div>
            </div>
          </Container>
        </Section>
        <Section>
          <Container>
            <div className="max-w-sm mx-auto">
              <h1 className="text-2xl font-bold mb-5 text-center">Authentication</h1>
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
          </Container>
        </Section>
      </main>
    </>
  );
}

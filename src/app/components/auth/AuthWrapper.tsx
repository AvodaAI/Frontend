"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { supabase } from "@/utils/supabase/supabaseClient";
import { googleAuthService } from "@/utils/services/authServices";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import googleLogo from "../../../../public/assets/google-logo.png";

const AuthWrapper = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in with Google:", error.message);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const email = session.user.user_metadata.email;
        const name = session.user.user_metadata.name;
        await googleAuthService({
          email,
          name,
          access_token: session.access_token,
        });
        router.replace("/org");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
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
      <div className="flex justify-center items-center flex-col gap-4 mt-6">
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-gray-300"></div>
          <p className="px-4 text-gray-500 text-sm">or</p>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <Button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          <Image src={googleLogo} alt="Google logo" width={40} height={40} />
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default AuthWrapper;

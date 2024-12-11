// src/app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActionState } from "react"; // New hook from React 19
import { signupAction } from "./actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Icons } from "@/app/(auth)/components/icons"; // Adjust import if needed

export default function SignupPage() {
  const router = useRouter();

  // useActionState returns [state, wrappedAction, pending].
  // State shape is based on what signupAction returns.
  const [result, wrappedAction, pending] = useActionState(signupAction, {
    error: undefined,
    redirect: undefined,
  });

  // If action returned a redirect, navigate:
  useEffect(() => {
    if (result?.redirect) {
      router.push(result.redirect);
    }
  }, [result, router]);

  // Clear errors after 2 seconds if present:
  useEffect(() => {
    if (result?.error) {
      const timer = setTimeout(() => {
        // Clear the state by calling action with empty data.
        // Create an empty FormData to reset the state.
        const fd = new FormData();
        wrappedAction(fd);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result, wrappedAction]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">Create an account to get started</p>
      </div>

      <form action={wrappedAction} className="space-y-4" noValidate>
        {result?.error && (
          <p className="text-destructive text-center">{result.error}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating..." : "Sign Up"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <Button
          variant="outline"
          onClick={() => wrappedAction(undefined, { social: "github" })}
          disabled={pending}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => wrappedAction(undefined, { social: "google" })}
          disabled={pending}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

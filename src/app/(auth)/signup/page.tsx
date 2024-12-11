// src/app/(auth)/signup/page.tsx
"use client"

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'

// Define your form schema using Zod
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignupFormValues) {
    const { email, password } = values
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      // Set root-level error
      form.setError("root", {
        type: "manual",
        message: error.message,
      })
    } else {
      router.push("/auth/verify-email")
    }
  }

  // Clear errors after 2 seconds if there are any
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const timer = setTimeout(() => {
        form.clearErrors()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [form.formState.errors, form])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">Create an account to get started</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Root-level error message (if any) */}
          {form.formState.errors.root && (
            <p className="text-destructive text-center">{form.formState.errors.root.message}</p>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  We'll send you an email to verify your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Make sure it's at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

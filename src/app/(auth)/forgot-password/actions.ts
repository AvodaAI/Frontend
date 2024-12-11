// src/app/(auth)/forgot-password/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'

// Provide your project's URL and anon key from environment variables
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) {
    return { error: 'Email is required.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { message: 'Check your email for the password reset link' }
}

'use server'

import { createClient } from "@/utils/supabase/server";

const supabase = createClient()

export async function signupAction(
  currentState: { error?: string; redirect?: string },
  formData: FormData
) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { error: 'Email and Password are required.' }
  }

  const { error } = await (await supabase).auth.signUp({ email, password })
  if (error) {
    return { error: error.message }
  }

  return { redirect: '/auth/verify-email' }
}

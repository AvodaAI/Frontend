// src/app/(auth)/login/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function loginAction(currentState: { error?: string; redirect?: string }, formData?: FormData) {
    const email = formData?.get('email') as string
    const password = formData?.get('password') as string

    if (!email || !password) {
        return { error: 'Email and Password are required.' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        return { error: error.message }
    }

    return { redirect: '/dashboard' }
}

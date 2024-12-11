// src/app/login/page.tsx
//HighTODO: Add github auth
//FIXME: Finish
//MediumTODO: Separate Out Hooks etc
'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Container } from '@components/container'
import { Section } from '@components/section'
import { motion } from 'framer-motion'

interface AuthState {
    email: string
    password: string
    isSignUp: boolean
    error: string
}

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()


    const action = async (currentState: AuthState, formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const isSignUp = currentState.isSignUp;
        try {
            const { error } = isSignUp
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            router.push('/dashboard')
        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message)
        }
    }

    const [state, dispatch, isPending] = useActionState<AuthState>(
        action,
        {
          email: '',
          password: '',
          isSignUp: false,
          error: null,
        },
        '/dashboard' // Optional permalink
      );

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider })
            if (error) throw error
        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message)
        }
    }

    return (
        <Container className='flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                        {state.isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                </div>
                <Section>
                    <form className="space-y-6" action={dispatch}>
                        <div className="space-y-4">
                            <div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Email address"
                                    value={state.email}
                                    onChange={(e) => dispatch({ ...state, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Password"
                                    value={state.password}
                                    onChange={(e) => dispatch({ ...state, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                            >
                                {state.isSignUp ? 'Sign up' : 'Sign in'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-muted-foreground"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => handleSocialAuth('github')}
                                className="w-full bg-gray-800 text-white hover:bg-gray-700 transition duration-150 ease-in-out"
                            >
                                <FaGithub className="mr-2" />
                                GitHub
                            </Button>
                            <Button
                                onClick={() => handleSocialAuth('google')}
                                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <FcGoogle className="mr-2" />
                                Google
                            </Button>

                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="link"
                            onClick={() => dispatch({ ...state, isSignUp: !state.isSignUp })}
                            className="text-primary hover:text-primary-foreground transition duration-150 ease-in-out"
                        >
                            {state.isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </Button>
                    </div>
                </Section>
            </motion.div>
        </Container>
    )
}


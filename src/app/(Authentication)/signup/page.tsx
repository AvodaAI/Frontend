'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { motion } from 'framer-motion'
import { Icon } from '@iconify-icon/react'
import Link from 'next/link'
import { useState } from 'react'

interface AuthState {
    email: string
    password: string
    isSignUp: boolean
    error: string
}

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const [isLoading, setIsLoading] = useState(false); 

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setIsLoading(true); 
        const { firstName, lastName, email, password } = formData; 
        
        
        setTimeout(async () => {
            
            setIsLoading(false); 
        }, 3000);
    };

    // New state variable for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    // Updated handle functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const action = async (currentState: AuthState, formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        try {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            router.push('/dashboard')
        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message)
        }
    }

   
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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-4 bg-white px-10 rounded-2xl shadow-sm py-20"
            >
                <div>
                    <div>
                        <h1 className='text-2xl font-semibold'>Signup</h1>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <h3 className="text-center tracking-tight text-color-secondary">
                            Already Have an Account?
                        </h3>
                        <h3 className='text-primary font-bold'>
                            <Link href="login">Login</Link>
                        </h3>
                    </div>
                    <div className='w-full border-2 border-[#D9D9D9] text-secondary flex justify-center items-center rounded-lg mt-6 p-1 cursor-pointer' onClick={() => handleSocialAuth('google')}>
                        <div className='flex gap-2 items-center'>
                            <Icon icon="flat-color-icons:google" width="30" height="30" />
                            <span>Signup using Google</span>
                        </div>
                    </div>
                    <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-muted-foreground"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                </div>
                <div>
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <div className="flex space-x-2">
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full"
                                icon={<Icon icon="material-symbols-light:mail-outline-sharp" className='text-secondary' width="24" height="24" />}
                            />
                        </div>
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full"
                                icon={<Icon icon="carbon:password" className='text-secondary' width="22" height="22" />}
                            />
                        </div>
                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                                disabled={isLoading} // Disable button while loading
                            >
                                {isLoading ? <Icon icon="eos-icons:three-dots-loading" width="35" height="35" /> : 'Sign up'}
                            </Button>
                        </div>
                    </form>


                    {/* <div className="text-center">
                        <Button
                            variant="link"
                            onClick={() => dispatch({ ...state, isSignUp: !state.isSignUp })}
                            className="text-primary hover:text-primary-foreground transition duration-150 ease-in-out"
                        >
                            {state.isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </Button>
                    </div> */}
                </div>
            </motion.div>
    )
}


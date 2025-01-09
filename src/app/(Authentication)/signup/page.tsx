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
    const supabase = createClientComponentClient()    const [isLoading, setIsLoading] = useState(false); 
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // Added message state
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Added state for confirm password visibility    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setIsLoading(true); 
        console.log(formData)
        const { firstName, lastName, email, password, confirmPassword } = formData;         // Check if passwords match (frontend validation only)
        const passwordsMatch = password === confirmPassword; // Store match result
        if (!passwordsMatch) {
            setMessage({ type: 'error', text: 'Passwords do not match' }); // Set error message
            setIsLoading(false);
            return;
        }

        try {
            // API integration for sign up
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Signup successful! Redirecting...' }); // Set success message
                router.push('/dashboard'); // Redirect on success
            } else {
                console.log(response)
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'An error occurred during sign up' }); // Set error message
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' }); // Handle unexpected errors
        } finally {
            setIsLoading(false);
        }
    };    // Updated state variable for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '', 
    });    // Updated handle functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };    const action = async (currentState: AuthState, formData: FormData) => {
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
    }    const handleSocialAuth = async (provider: 'google' | 'github') => {
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
                    {/* Message Section */}
                {message && (
                    <div className={`p-4 mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-lg`} role="alert">
                        {message.text}
                    </div>
                )}
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
                        <div className='relative'>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full ${formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`}
                                icon={<Icon icon="carbon:password" className='text-secondary' width="22" height="22" />}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[11px] z-10"
                            >
                                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className='text-secondary' width="22" height="22" />
                            </button>
                        </div>
                        <div className='relative'>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full ${formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`}
                                icon={<Icon icon="carbon:password" className='text-secondary' width="22" height="22" />}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-[11px] z-10"
                            >
                                <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className='text-secondary' width="22" height="22" />
                            </button>
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
                </div>
            </motion.div>
    )
}


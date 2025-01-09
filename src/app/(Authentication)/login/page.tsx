'use client'
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
    error: string
}

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    
    const [loading, setLoading] = useState(false);

    
    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setLoading(true); 
        setError(null); 

        // Validate email first
        if (!email) {
            // Remove debug logging of credentials
            return;
        }

        // If step is 1, just set the step to 2
        if (step === 1) {
            setStep(2);
            setLoading(false);
            return;
        }

        // Validate password only if step is 2
        if (step === 2 && !password) {
            setError('Password is required.');
            setLoading(false);
            return;
        }

        try {
            if (!process.env.NEXT_PUBLIC_API_URL) {
                throw new Error('API URL is not configured');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Add a small delay before navigation
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 1000);
            } else {
                const data = await response.json();
                setError(data.error || 'Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred during sign in');
        } finally {
            setLoading(false); 
        }
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (email: string) => {
        setEmail(email);
    };

    const handlePasswordChange = (password: string) => {
        setPassword(password);
    };

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
                        <h1 className='text-2xl font-semibold'>Login</h1>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <h3 className="text-center tracking-tight text-color-secondary">
                            Don't Have an Account?
                        </h3>
                        <h3 className='text-primary font-bold'>
                            <Link href="signup">Signup</Link>
                        </h3>
                    </div>
                    <div className='w-full border-2 border-[#D9D9D9] text-secondary flex justify-center items-center rounded-lg mt-6 p-1 cursor-pointer' onClick={() => handleSocialAuth('google')}>
                        <div className='flex gap-2 items-center'>
                            <Icon icon="flat-color-icons:google" width="30" height="30" />
                            <span>Login with Google</span>
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
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-red-100 text-red-800 p-2 rounded-md mb-4 flex justify-center items-center text-sm"
                        >
                            {error}
                        </motion.div>
                    )} {/* Error message */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out ${error ? 'border-red-500' : ''}`} // Error border
                                    icon={<Icon icon="material-symbols-light:mail-outline-sharp" className='text-secondary' width="24" height="24" />}
                                />
                            </div>
                            {step === 2 && (
                                <div className='relative'>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => handlePasswordChange(e.target.value)}
                                        className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out ${error ? 'border-red-500' : ''}`} // Error border
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
                            )}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <Icon icon="eos-icons:three-dots-loading" width="35" height="35" /> : (step === 1 ? 'Next' : 'Login')} {/* Show loading text */}
                            </Button>
                        </div>
                    </form>

                    <div className='mt-3'>
                        <Link href="/forgot-password" className="text-primary hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </motion.div>
    )
}


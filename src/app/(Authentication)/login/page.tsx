'use client'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Container } from '@components/container'
import { Section } from '@components/section'
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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setLoading(true); 
        setError(null); 

        if (!email || !password) {
            setError('Email and password are required.');
            setLoading(false);
            return;
        }

        console.log('Email:', email);
        console.log('Password:', password);
        
        setTimeout(() => {
            setLoading(false); 
        }, 3000);
        
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
                    {error && <div className="text-red-500 pb-3">{error}</div>} {/* Error message */}
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
                            <div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out ${error ? 'border-red-500' : ''}`} // Error border
                                    icon={<Icon icon="carbon:password" className='text-secondary' width="22" height="22" />}
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <Icon icon="eos-icons:three-dots-loading" width="35" height="35" /> : 'Login'} {/* Show loading text */}
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


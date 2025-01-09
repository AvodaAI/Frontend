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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setLoading(true); 
        setError(null); 

        // Simulate validation
        if (!email || !password) {
            setError('Email and password are required.');
            setLoading(false);
            return;
        }

        console.log('Email:', email);
        console.log('Password:', password);
        
        // Simulate loading for 3 seconds
        setTimeout(() => {
            setLoading(false); 
        }, 3000);
        
        
    };

    // State variables for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Updated handle functions
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

    // New function to handle sending the email
    const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading to true
        setError(null); // Reset error message
        setSuccessMessage(null); // Reset success message

        // Simulate sending email
        if (!email) {
            setError('Email is required.');
            setLoading(false);
            return;
        }

        // Remove debug logging of email
        
        // Simulate loading for 3 seconds
        setTimeout(() => {
            setLoading(false); // Reset loading after 3 seconds
            setSuccessMessage('Confirmation email sent!'); // Set success message
        }, 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-4 bg-white px-10 rounded-2xl shadow-sm py-20"
        >
            <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} viewBox="0 0 512 512">
<path fill="#b1b4b5" d="M376.749 349.097c-13.531 0-24.5-10.969-24.5-24.5V181.932c0-48.083-39.119-87.203-87.203-87.203c-48.083 0-87.203 39.119-87.203 87.203v82.977c0 13.531-10.969 24.5-24.5 24.5s-24.5-10.969-24.5-24.5v-82.977c0-75.103 61.1-136.203 136.203-136.203s136.203 61.1 136.203 136.203v142.665c0 13.531-10.969 24.5-24.5 24.5"></path>
<path fill="#338EF7" d="M414.115 497.459H115.977c-27.835 0-50.4-22.565-50.4-50.4V274.691c0-27.835 22.565-50.4 50.4-50.4h298.138c27.835 0 50.4 22.565 50.4 50.4v172.367c0 27.836-22.565 50.401-50.4 50.401"></path>
<path fill="#338EF7" d="M109.311 456.841h-2.525c-7.953 0-14.4-6.447-14.4-14.4V279.309c0-7.953 6.447-14.4 14.4-14.4h2.525c7.953 0 14.4 6.447 14.4 14.4v163.132c0 7.953-6.447 14.4-14.4 14.4"></path>
</svg>
                <h1 className='text-2xl mt-4'>Forgot your password?</h1>
                <p className='text-center mt-2 text-sm text-secondary'>
                    We will send you a 6-digit confirmation to your email. Please enter your email below.
                </p>
            </div>
            <div>
                <form className="space-y-6" onSubmit={handleSendEmail}>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-green-100 text-green-800 p-2 rounded-md mb-4 flex justify-center items-center text-sm"
                        >
                            {successMessage}
                        </motion.div>
                    )}
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
                            className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out`}
                            icon={<Icon icon="material-symbols-light:mail-outline-sharp" className='text-secondary' width="24" height="24" />}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? <Icon icon="eos-icons:three-dots-loading" width="35" height="35" /> : 'Send Email'}
                        </Button>
                    </div>
                </form>
                <div className='mt-3'>
                    <Link href="/login" className="text-primary hover:underline">
                        Return to Login
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}


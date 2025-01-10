'use client'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Container } from '@components/container'
import { Section } from '@components/section'
import { motion } from 'framer-motion'
import { Icon } from '@iconify-icon/react'
import { useState } from 'react'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // State variables for new password and confirmation
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); // State for showing new password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing confirm password

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setError('Both fields are required.');
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Simulate loading for 3 seconds
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage('Password has been reset successfully!');
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
                <h1 className='text-2xl mt-4'>Reset Your Password</h1>
                <p className='text-center mt-2 text-sm text-secondary'>
                    Please enter your new password below.
                </p>
            </div>
            <div>
                <form className="space-y-6" onSubmit={handleResetPassword}>
                    {successMessage && (
                        <div className="bg-green-100 text-green-800 p-2 rounded-md mb-4 flex justify-center items-center text-sm">
                            {successMessage}
                        </div>
                    )}
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-red-100 text-red-800 p-2 rounded-md mb-4 flex justify-center items-center text-sm"
                        >
                            Passwords do not match.
                        </motion.div>
                    )}
                    <div className='relative'>
                        <Input
                            id="new-password"
                            name="new-password"
                            type={showNewPassword ? 'text' : 'password'} // Toggle password visibility
                            autoComplete="new-password"
                            required
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out ${error ? 'border-red-500' : ''} ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''}`} // Error border
                            icon={
                                <>
                                    <Icon icon="carbon:password" className='text-secondary' width="22" height="22" />
                                </>
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility
                            className="absolute right-4 top-[11px] z-10"
                        >
                            <Icon icon={showNewPassword ? "mdi:eye-off" : "mdi:eye"} className="text-secondary" width="22" height="22" />
                        </button>
                    </div>
                    <div className='relative'>
                        <Input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'} // Toggle password visibility
                            autoComplete="new-password"
                            required
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out ${error ? 'border-red-500' : ''} ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''}`} // Error border
                            icon={
                                <>
                                    <Icon icon="carbon:password" className='text-secondary' width="22" height="22" />
                                </>
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                            className="absolute right-4 top-[11px]"
                        >
                            <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className='text-secondary' width="22" height="22" />
                        </button>
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4 flex justify-center items-center text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-150 ease-in-out"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
            </div>
            <div className='mt-3'>
                <Link href="/login" className="text-primary hover:underline">
                    Back to Login
                </Link>
            </div>
            {message && (
                <div className={`p-4 mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-lg`} role="alert">
                    {message.text}
                </div>
            )}
        </motion.div>
    )
}

'use client'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Loader } from '@/app/components/ui/loader'
import { NoIconInput } from '@/app/components/ui/no-icon-input'
import { Login } from '@/types/auth'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify-icon/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { AtSign, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { loginEmailPassword } from '../actions/auth-services'


const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

type LevelFormValues = z.infer<typeof formSchema>;

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LevelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: Login) => {
        try {
            setLoading(true);
            const response = await loginEmailPassword(data);
            if (response.ok) {
                // Add a small delay before navigation
                router.replace('/org');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Invalid email or password');
            }
        } catch (errors: any) {
            if (errors.message === "Please check your username and password.") {
                toast.error("Invalid username or password");
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
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
        >
            <div>
                <div className='flex flex-col items-center'>
                    <h1 className='text-2xl font-semibold'>Login</h1>
                    <span className='text-muted-foreground'>Enter your credentials to access your account</span>
                </div>

                <div className='w-full border-2 border-[#D9D9D9] text-secondary flex justify-center items-center rounded-lg mt-8 p-1 cursor-pointer' onClick={() => handleSocialAuth('google')}>
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
                        <span className="bg-background px-2 text-muted-foreground uppercase">Or continue with</span>
                    </div>
                </div>
            </div>
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full"
                    >
                        <div className="space-y-4 md:space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input className="peer ps-9" placeholder="Email" type="email" disabled={loading} {...field} />
                                                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                                    <AtSign size={16} strokeWidth={2} aria-hidden="true" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 relative">
                                                <NoIconInput
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    disabled={loading}
                                                    placeholder="Password"
                                                    className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
                                                />
                                                <span
                                                    className="absolute right-4"
                                                    onClick={() =>
                                                        setShowPassword(!showPassword)
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff height={20} />
                                                    ) : (
                                                        <Eye height={20} />
                                                    )}
                                                </span>
                                            </div>
                                        </FormControl >
                                        <FormMessage />
                                    </FormItem >
                                )}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember Me
                                    </label>
                                </div>
                                <Link
                                    href={"/forgot-password"}
                                    className="text-sm font-medium text-blue-500 hover:underline dark:text-blue-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                disabled={loading}
                                type="submit"
                                className={`w-full text-white bg-blue-500 hover:bg-blue-600 ${loading ? "cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading && (
                                    <span className="mr-2">
                                        {" "}
                                        <Loader color="#ffffff" size={15} />
                                    </span>
                                )}
                                Login
                            </Button>
                            <p className="text-sm font-light">
                                Don&apos;t you have an account?
                                <Link
                                    href={"/signup"}
                                    className="font-medium ml-2 text-blue-500 hover:underline dark:text-blue-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
        </motion.div>
    )
}


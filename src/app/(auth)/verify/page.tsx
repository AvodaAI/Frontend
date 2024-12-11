// src/app/(auth)/verify/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@components/ui/button'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/app/(auth)/verify/components/otp-input"
import Container from '@components/container'
import { Section } from '@components/section'

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const { error } = await supabase.auth.verifyOtp({ token: otp, type: 'email' })
        if (error) {
            setError(error.message)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <Container>
            <Section>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Verify OTP</h1>
                    <p className="text-muted-foreground">Enter the OTP sent to your email</p>
                </div>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            className="justify-center"  // This ensures the input boxes line up centrally
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {error && <p className="text-destructive">{error}</p>}
                    <Button type="submit" className="w-full">Verify OTP</Button>
                </form>
            </Section>
        </Container>
    )
}

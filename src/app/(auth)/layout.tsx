// src/app/(auth)/layout.tsx
'use client'

import { Header } from "@components/layout/Header"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, isLoaded } = useAuth()
  
  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/sign-in")
    }
  }, [isLoaded, userId])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Header />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}

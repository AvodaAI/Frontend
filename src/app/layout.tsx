// src/app/layout.tsx
import { Header } from '@/app/components/header'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ClerkProvider>
        <Header />
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  )
}

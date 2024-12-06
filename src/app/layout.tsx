// src/app/layout.tsx
import { Toaster } from '@components/ui/toaster'
import './globals.css'
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
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster />
      </body>
    </html>
  )
}

// src/app/(auth)/layout.tsx
import { Header } from "@components/layout/Header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/40">
      <Header />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}

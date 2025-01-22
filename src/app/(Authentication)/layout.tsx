import React from 'react';
import { Card } from '@/app/components/ui/card';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md p-6 space-y-4">
                {children}
            </Card>
        </div>
    );
}
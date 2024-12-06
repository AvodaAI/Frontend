import './globals.css';
import { Toaster } from '@components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import SupabaseClientWrapper from './SupabaseClientWrapper';

const inter = Inter( { subsets: [ 'latin' ] } );

export default function RootLayout ( { children }: { children: React.ReactNode } ) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={ cn( 'min-h-screen bg-background font-sans antialiased', inter.className ) }>
        <SupabaseClientWrapper>{ children }</SupabaseClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}

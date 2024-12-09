//TODO : Add Google Tag Manager + Config Analytics
import './globals.css';
import { Toaster } from '@components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import SupabaseClientWrapper from './SupabaseClientWrapper';
import { GoogleTagManager } from '@next/third-parties/google'
import { GoogleAnalytics } from '@next/third-parties/google'
const inter = Inter( { subsets: [ 'latin' ] } );

export default function RootLayout ( { children }: { children: React.ReactNode } ) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <GoogleTagManager gtmId="G-KHDZXKZYMN" /> */}
      <GoogleAnalytics gaId="G-XYZ" />
      <head />
      <body className={ cn( 'min-h-screen bg-background font-sans antialiased', inter.className ) }>
        <SupabaseClientWrapper>{ children }</SupabaseClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
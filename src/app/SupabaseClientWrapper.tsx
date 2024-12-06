'use client';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { ReactNode, useState } from 'react';

export default function SupabaseClientWrapper ( { children }: { children: ReactNode } ) {
    const [ supabaseClient ] = useState( () => createBrowserSupabaseClient() ); // Initialize Supabase client once

    return <SupabaseProvider supabaseClient={ supabaseClient }>{ children }</SupabaseProvider>;
}

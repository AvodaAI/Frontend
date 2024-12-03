//src/app/(auth)/sbtest/page.tsx
//test supabase connection
import { createClient } from "@/utils/supabase/server";

export default async function supabaseTest() {
    const supabase = await createClient();
    try {
        const { data: users, error } = await supabase.from("users").select();
        return (
        
                {!error && users ? (
                    Supabase Connection: All Systems Operational
                ) : (
                    Supabase Connection: System Issues Detected - {error?.message}
                )}
        
        );
    } catch (e) {
        return Supabase Connection: System Issues Detected;
    }
}
//src/app/(auth)/sbtest/page.tsx
//test supabase connection
import { createClient } from "@/utils/supabase/server";

export default async function supabaseTest() {
    const supabase = await createClient();
    const { data: users } = await supabase.from("users").select();
    return (
        <div>
            {users ? (
                <p>Supabase Connection: All Systems Operational</p>
            ) : (
                <p>Supabase Connection: System Issues Detected</p>
            )}
        </div>
    );
}
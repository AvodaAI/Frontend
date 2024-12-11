//src/app/(auth)/sbtest/page.tsx
import { createClient } from "@/utils/supabase/server";

export default async function supabaseTest() {
    const supabase = await createClient();
    try {
        const { data: users, error } = await supabase.from("users").select();
        return (
            <div>
                {!error && users ? (
                    <p>Supabase Connection: All Systems Operational</p>
                ) : (
                    <p>Supabase Connection: System Issues Detected - {error?.message}</p>
                )}
            </div>
        );
    } catch (e) {
        return <div>Supabase Connection: System Issues Detected</div>;
    }
}
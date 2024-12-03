//src/utils/supabase/status.ts
//test supabase connection
import { createClient } from "@/utils/supabase/server";

const db = {
    async checkConnection() {
        const supabase = await createClient();
        const { data: users, error } = await supabase.from("users").select().limit(1);
        return { isConnected: !error && users !== null, lastChecked: new Date() };
    },
};

export default db;
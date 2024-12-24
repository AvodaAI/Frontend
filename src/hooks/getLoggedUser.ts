"use server";

import { supabase } from "@/utils/supabase/supabaseClient";
import { cookies } from "next/headers";

export async function getLoggedUser() {
  const cookieStore = await cookies();
  const TOKEN = cookieStore.get("supabase-auth-token");
  const user = await supabase.auth.getUser(TOKEN?.value);
  return user;
}

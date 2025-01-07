// src/app/org/[id]/(auth)/users/actions/getSupabaseEmail.ts
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

export async function getSupabaseEmail(emailAddressId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("id", emailAddressId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.email;
  } catch (error) {
    console.error(`Error fetching email for ID ${emailAddressId}:`, error);
    return null;
  }
}

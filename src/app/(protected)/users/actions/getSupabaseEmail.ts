// src/app/(auth)/supabase-users/actions/getSupabaseEmail.ts
//FIXME: Types and More. Align with Supabase Config
"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

export async function getSupabaseEmail(emailAddressId: string) {
  try {
    // Fetch the email from the Supabase table
    const { data, error } = await supabase
      .from("email_addresses") // Assuming a table named 'email_addresses'
      .select("email_address") // Selecting the `email_address` field
      .eq("id", emailAddressId) // Filtering by ID
      .single(); // Expecting a single result

    if (error) {
      throw new Error(error.message);
    }

    // Return the email address if found
    return data.email_address;
  } catch (error) {
    console.error(`Error fetching email for ID ${emailAddressId}:`, error);
    return null;
  }
}

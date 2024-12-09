// src/hooks/use-role.ts
//FIXME: Types
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      setIsLoaded(false);

      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setRole(null); // No user authenticated
        setIsLoaded(true);
        return;
      }

      // Fetch user's role from public metadata or database
      const { data, error } = await supabase
        .from("users") // Assuming the table is named "users"
        .select("role") // Assuming "role" column stores the user role
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error.message);
        setRole(null);
      } else {
        setRole(data?.role || "admin"); // Default to 'admin' if no role is found
      }

      setIsLoaded(true);
    }

    fetchUserRole();
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isEmployee: role === "employee",
    isLoaded,
  };
}

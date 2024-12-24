// src/hooks/use-role.ts
//FIXME: Types
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { getLoggedUser } from "./getLoggedUser";
import { User } from "@supabase/supabase-js";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      setIsLoaded(false);

      const loggedUser = await getLoggedUser();
      const currentUser = loggedUser?.data?.user;

      if (currentUser) {
        setUser(currentUser);
      } else {
        setRole(null); // No user authenticated
        setIsLoaded(true);
        return;
      }
    }

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!user) return; // If user is not yet set, don't fetch role

    // Fetch user's role from public metadata or database
    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("users") // Assuming the table is named "users"
        .select("role") // Assuming "role" column stores the user role
        .eq("auth_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error.message);
        setRole(null);
      } else {
        setRole(data?.role || "admin"); // Default to 'admin' if no role is found
      }

      setIsLoaded(true);
    };

    fetchRole();
  }, [user]);

  return {
    role,
    isAdmin: role === "admin",
    isEmployee: role === "employee",
    isLoaded,
  };
}

// src/hooks/use-role.ts
//FIXME: Types
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { getLoggedUser } from "./getLoggedUser";
import { User } from "@supabase/supabase-js";

// Defined a type for the user data fetched from the database
export interface LoggedUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_verified: Date;
  role: string;
  status: string;
  organization_ids: number[];
}

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loggedUserData, setLoggedUserData] = useState<LoggedUserData | null>(null);

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
        .select("*") // Assuming "role" column stores the user role
        .eq("auth_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error.message);
        setRole(null);
        setLoggedUserData(null);
      } else {
        setLoggedUserData(data);
        setRole(data?.role || null);
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
    loggedUserData,
  };
}

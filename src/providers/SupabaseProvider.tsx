// src/providers/SupabaseProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

export const SupabaseProvider = ({
  children,
  supabaseClient,
}: {
  children: React.ReactNode;
  supabaseClient: SupabaseClient<Database>;
}) => {
  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

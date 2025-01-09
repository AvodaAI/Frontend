//src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import Hero1 from "./components/home/hero";
import PricingSectionDemo from "./pricing/page";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("supabase-auth-token");
  if (token) {
    const { error } = await supabase.auth.getUser(token.value);
    if (!error) {
      redirect("/org");
    }
  }
  return (
    <>
      <Hero1 />
      <PricingSectionDemo />
    </>
  );
}

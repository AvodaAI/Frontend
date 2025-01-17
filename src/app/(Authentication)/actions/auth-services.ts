import { Login } from "@/types/auth";
import { fetchWrapper } from "@/utils/fetchWrapper";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const loginEmailPassword = async (data: Login) => {
  return await fetchWrapper(`${backendUrl}/auth/signin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

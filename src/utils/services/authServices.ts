import { fetchWrapper } from "../fetchWrapper";

export const googleAuthService = async ({ name, email, access_token }: { name: string; email: string; access_token: string }) => {
  const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      access_token,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to authenticate with Google');
  }
  return response;
};

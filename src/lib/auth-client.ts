import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
      plugins: [
    jwtClient() 
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Returns an `Authorization: Bearer <jwt>` header when a better-auth session
 * exists, otherwise an empty object. Use this on requests to the backend so
 * protected routes (e.g. /books/borrows) can identify the logged-in user.
 */
export async function authHeaders(): Promise<HeadersInit> {
  const res = await authClient.token();
  const token = (res as { data?: { token?: string } | null })?.data?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

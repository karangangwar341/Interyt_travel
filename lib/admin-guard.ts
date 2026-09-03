import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Every admin Server Action must call this first. Middleware already blocks
 * unauthenticated page loads under /admin, but a Server Action is its own
 * POST endpoint and must never trust that a request came from a protected
 * page — the session is re-verified here regardless.
 */
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

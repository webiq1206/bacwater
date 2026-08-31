import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export interface AdminSessionUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

/**
 * Page-level admin gate.
 *
 * The server actions in `admin-actions.ts` have always checked the role, but
 * the /admin *pages* did not: anyone who typed the URL could read every user's
 * email, every saved plan, and every contact message. Rendering is where the
 * data leaks, so the gate belongs here too.
 *
 * Signed-out visitors are sent to sign-in with a callback; signed-in
 * non-admins are sent home rather than to a "forbidden" page, which would
 * confirm the route exists.
 */
export async function requireAdminPage(): Promise<AdminSessionUser> {
  const session = await auth();
  const user = session?.user as AdminSessionUser | undefined;
  if (!user) redirect("/signin?callbackUrl=%2Fadmin");
  if (user.role !== "admin") redirect("/");
  return user;
}

import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin";
}

/**
 * requireAdmin() — call at the top of every admin Server Component and Server Action.
 *
 * Strategy:
 * 1. Uses getUser() (not getSession()) to verify the JWT with Supabase Auth servers.
 * 2. Reads the role from public.profiles (RLS applies — user can only read own row).
 * 3. Redirects unauthenticated or non-admin users; never leaks user-existence info.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();

  if (!supabase) {
    // Supabase not configured — redirect to login with a flag
    redirect("/admin/login?error=db");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/admin/login");
  }

  if (profile.role !== "admin") {
    redirect("/admin/login?error=access");
  }

  return {
    id: profile.id as string,
    email: profile.email as string,
    full_name: profile.full_name as string | null,
    role: "admin",
  };
}

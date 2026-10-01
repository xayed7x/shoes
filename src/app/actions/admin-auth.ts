"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginState =
  | { success: true }
  | { success: false; error: string };

export async function adminLoginAction(
  _prev: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "db_not_configured" };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    // Generic message — no user enumeration
    return { success: false, error: "invalid_credentials" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "db_not_configured" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "invalid_credentials" };
  }

  // Verify role immediately after login (no client-side trust)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "invalid_credentials" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // Sign out the non-admin user immediately
    await supabase.auth.signOut();
    return { success: false, error: "no_access" };
  }

  redirect("/admin");
}

export async function adminSignOutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

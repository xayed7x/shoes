import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, getSupabaseAnonKey } from "@/lib/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const key = getSupabaseAnonKey()!;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key
  );
}

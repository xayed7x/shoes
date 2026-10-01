import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import { FALLBACK_CATEGORIES } from "./fallbackData";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return FALLBACK_CATEGORIES;
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data as Category[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

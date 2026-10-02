import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "./fallbackData";

// ─── Basic getProducts ────────────────────────────────────────────────────────

export interface GetProductsOptions {
  categorySlug?: string;
  featuredOnly?: boolean;
  newOnly?: boolean;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return filterFallbackProducts(options);

    let query = supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)");

    if (options.featuredOnly) query = query.eq("is_featured", true);
    if (options.newOnly) query = query.eq("is_new", true);
    query = query.order("created_at", { ascending: false });
    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error || !data || data.length === 0) return filterFallbackProducts(options);
    return data as Product[];
  } catch {
    return filterFallbackProducts(options);
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ featuredOnly: true, limit });
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return getProducts({ newOnly: true, limit });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const targetSlug = slug === "venetian-driver-slide" ? "soleil-cork-mule" : slug;
  try {
    const supabase = await createClient();
    if (!supabase) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === targetSlug) || null;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    }
    return data as Product;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

// ─── Shop-page getShopProducts ────────────────────────────────────────────────

export type SortOption = "newest" | "price_asc" | "price_desc" | "featured";

export interface ShopProductsOptions {
  query?: string;
  categorySlug?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ShopProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getShopProducts(
  options: ShopProductsOptions = {}
): Promise<ShopProductsResult> {
  const { query = "", categorySlug, sort = "newest", page = 1, pageSize = 12 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = await createClient();
    if (!supabase) return shopFallback(options);

    // Count query (for pagination total)
    let countQ = supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    // Data query
    let dataQ = supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)");

    // ── Category filter ──────────────────────────────────────────────────────
    if (categorySlug) {
      // Resolve category id first
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (cat?.id) {
        countQ = countQ.eq("category_id", cat.id);
        dataQ = dataQ.eq("category_id", cat.id);
      }
    }

    // ── Text search ──────────────────────────────────────────────────────────
    if (query.trim()) {
      const like = `%${query.trim()}%`;
      countQ = countQ.ilike("name", like);
      dataQ = dataQ.ilike("name", like);
    }

    // ── Sort ─────────────────────────────────────────────────────────────────
    switch (sort) {
      case "price_asc":
        dataQ = dataQ.order("price", { ascending: true });
        break;
      case "price_desc":
        dataQ = dataQ.order("price", { ascending: false });
        break;
      case "featured":
        dataQ = dataQ.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
        break;
      default: // newest
        dataQ = dataQ.order("created_at", { ascending: false });
    }

    // ── Pagination ───────────────────────────────────────────────────────────
    dataQ = dataQ.range(from, to);

    const [{ count }, { data, error }] = await Promise.all([countQ, dataQ]);

    if (error || !data || data.length === 0) return shopFallback(options);

    const total = count ?? 0;
    return {
      products: data as Product[],
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      currentPage: page,
    };
  } catch {
    return shopFallback(options);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterFallbackProducts(options: GetProductsOptions): Product[] {
  let list = [...FALLBACK_PRODUCTS];
  if (options.featuredOnly) list = list.filter((p) => p.is_featured);
  if (options.newOnly) list = list.filter((p) => p.is_new);
  if (options.limit) list = list.slice(0, options.limit);
  return list;
}

function shopFallback(options: ShopProductsOptions): ShopProductsResult {
  const { query = "", categorySlug, sort = "newest", page = 1, pageSize = 12 } = options;
  let list = [...FALLBACK_PRODUCTS];

  if (categorySlug) {
    const cat = FALLBACK_CATEGORIES.find((c) => c.slug === categorySlug);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
    else list = []; // unknown category
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "featured":
      list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
      break;
    default:
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = list.slice((page - 1) * pageSize, page * pageSize);

  return {
    products: paged,
    total,
    totalPages,
    currentPage: page,
  };
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Category } from "@/types";
import type { SortOption } from "@/lib/data/products";
import { buildQueryString } from "@/lib/utils";

interface ShopFiltersProps {
  categories: Category[];
  topLevelCategories: Category[];
  currentCategory?: string;
  currentSort: SortOption;
  currentQuery: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "featured", label: "Bestsellers" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function ShopFilters({
  topLevelCategories,
  currentCategory,
  currentSort,
  currentQuery,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const current: Record<string, string | undefined> = {
        q: searchParams.get("q") || undefined,
        category: searchParams.get("category") || undefined,
        sort: searchParams.get("sort") || undefined,
      };
      const merged = { ...current, ...overrides, page: "1" };
      startTransition(() => {
        router.push(`/shop${buildQueryString(merged)}`);
      });
    },
    [router, searchParams]
  );

  const [localQuery, setLocalQuery] = useState(currentQuery);

  useEffect(() => {
    setLocalQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== currentQuery) {
        navigate({ q: localQuery || undefined });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localQuery, currentQuery, navigate]);

  const hasFilters = !!currentCategory || currentSort !== "newest" || !!currentQuery;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${isPending ? "opacity-60 pointer-events-none" : ""} transition-opacity`}>
      {/* Filter icon label */}
      <div className="flex items-center gap-1.5 text-[#6B6560]">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-sans text-[11px] uppercase tracking-widest">Filter</span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
        <input
          type="text"
          placeholder="Search..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="font-sans text-[11px] uppercase tracking-widest pl-9 pr-4 py-2 rounded-full border border-[#E8DFD0] bg-transparent text-[#1C1917] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#1C1917] transition-colors duration-200"
        />
      </div>

      {/* Category pills */}
      {topLevelCategories.map((cat) => (
        <button
          key={cat.id}
          id={`filter-cat-${cat.slug}`}
          onClick={() =>
            navigate({
              category: currentCategory === cat.slug ? undefined : cat.slug,
            })
          }
          className={`font-sans text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 ${
            currentCategory === cat.slug
              ? "bg-[#1C1917] text-[#FAF8F4] border-[#1C1917]"
              : "bg-transparent text-[#6B6560] border-[#E8DFD0] hover:border-[#1C1917] hover:text-[#1C1917]"
          }`}
        >
          {cat.name}
        </button>
      ))}

      {/* Sort select */}
      <select
        id="shop-sort-select"
        value={currentSort}
        onChange={(e) => navigate({ sort: e.target.value })}
        className="font-sans text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#E8DFD0] bg-transparent text-[#6B6560] cursor-pointer hover:border-[#1C1917] hover:text-[#1C1917] transition-all duration-200 appearance-none pr-8"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B6560'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1em" }}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Clear all */}
      {hasFilters && (
        <button
          id="shop-clear-filters"
          onClick={() => router.push("/shop")}
          className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-[#C4714A] hover:text-[#A85432] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

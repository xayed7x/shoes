import { getShopProducts, SortOption } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductCard from "@/components/ProductCard";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { buildQueryString } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Footwear | Premium Export Shoes",
  description: "Browse our complete collection of luxury handcrafted footwear.",
};

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const sort = (
    typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  ) as SortOption;
  const pageStr =
    typeof searchParams.page === "string" ? searchParams.page : "1";
  const page = parseInt(pageStr, 10) || 1;

  const [{ products, total, totalPages, currentPage }, categories] =
    await Promise.all([
      getShopProducts({ query: q, categorySlug: category, sort, page }),
      getCategories(),
    ]);

  // Extract top-level categories for the filter pill list
  const topLevelCategories = categories.filter((c) => !c.parent_id);

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[140px] md:pt-[160px] pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col">
        {/* Header */}
        <div className="flex flex-col mb-8 md:mb-10">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
            COLLECTION
          </span>
          <h1 className="font-serif italic font-light text-4xl sm:text-5xl md:text-[64px] text-[#1C1917] leading-tight">
            {category
              ? categories.find((c) => c.slug === category)?.name ||
                "All Products"
              : "All Products"}
          </h1>
          {q && (
            <p className="font-sans text-[14px] text-[#6B6560] mt-4">
              Search results for &quot;
              <span className="text-[#1C1917] font-medium">{q}</span>&quot; (
              {total})
            </p>
          )}
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-6" />
        </div>

        {/* Filters */}
        <div className="mb-10 pb-6 border-b border-[#E8DFD0]">
          <ShopFilters
            topLevelCategories={topLevelCategories}
            categories={categories}
            currentCategory={category}
            currentSort={sort}
            currentQuery={q || ""}
          />
        </div>

        {/* Grid or Empty State */}
        {products.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20">
            <SearchX
              className="w-16 h-16 text-[#E8DFD0] mb-4"
              strokeWidth={1}
            />
            <h2 className="font-serif text-[24px] text-[#1C1917] mb-2">
              No products found
            </h2>
            <p className="font-sans text-[14px] text-[#6B6560] mb-6">
              We couldn&apos;t find anything matching your current filters.
            </p>
            <Link
              href="/shop"
              className="font-sans text-[12px] uppercase tracking-widest text-[#FAF8F4] bg-[#1C1917] px-6 py-3 rounded-[4px] hover:bg-[#C4714A] transition-colors"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 items-start">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="w-full flex justify-center items-center gap-4 mt-16">
                {currentPage > 1 && (
                  <Link
                    href={`/shop${buildQueryString({ q, category, sort, page: currentPage - 1 })}`}
                    className="font-sans text-[11px] uppercase tracking-widest text-[#1C1917] border border-[#E8DFD0] px-4 py-2 hover:border-[#1C1917] transition-colors"
                  >
                    Previous
                  </Link>
                )}
                <span className="font-sans text-[13px] text-[#6B6560]">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/shop${buildQueryString({ q, category, sort, page: currentPage + 1 })}`}
                    className="font-sans text-[11px] uppercase tracking-widest text-[#1C1917] border border-[#E8DFD0] px-4 py-2 hover:border-[#1C1917] transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

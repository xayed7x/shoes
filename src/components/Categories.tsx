import Link from "next/link";
import { Category } from "@/types";
import { FALLBACK_CATEGORIES } from "@/lib/data/fallbackData";

interface CategoriesProps {
  categories?: Category[];
}

export default function Categories({ categories = FALLBACK_CATEGORIES }: CategoriesProps) {
  const categoryList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="md:hidden w-full bg-transparent text-[#1C1917] pt-6 pb-8 px-5">
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Link href="/shop" className="text-sm text-[#1C1917]/50 hover:text-[#1C1917] transition-colors">
          See all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5">
        {categoryList.map((cat, idx) => (
          <Link 
            key={cat.id || idx}
            href={`/shop?category=${cat.slug}`}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              idx === 0 
                ? "bg-[#1C1917] text-white border-[#1C1917]" 
                : "bg-transparent text-[#1C1917]/70 border-[#1C1917]/20 hover:border-[#1C1917]/50"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

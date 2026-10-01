"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product } from "@/types";
import { FALLBACK_PRODUCTS } from "@/lib/data/fallbackData";
import ProductCard from "@/components/ProductCard";

interface ProductCatalogProps {
  products?: Product[];
}

export default function ProductCatalog({ products = FALLBACK_PRODUCTS }: ProductCatalogProps) {
  const displayProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section className="w-full bg-[#FAF8F4] py-[60px] lg:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-[40px] md:mb-[60px]"
        >
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
            CATALOG
          </span>
          <h2 className="font-serif italic font-light text-4xl sm:text-5xl md:text-[64px] text-[#1C1917] leading-tight md:leading-none text-center">
            All Products
          </h2>
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-4 md:mt-[30px]" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 items-start">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-12 md:mt-16 flex justify-center w-full">
          <Link
            href="/shop"
            className="font-serif italic text-[18px] text-[#1C1917] hover:underline transition-all underline-offset-4"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}

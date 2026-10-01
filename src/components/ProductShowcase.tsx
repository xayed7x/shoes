"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Product } from "@/types";
import Price from "@/components/ui/Price";
import { FALLBACK_PRODUCTS } from "@/lib/data/fallbackData";

interface ProductShowcaseProps {
  products?: Product[];
}

export default function ProductShowcase({ products = FALLBACK_PRODUCTS }: ProductShowcaseProps) {
  const displayProducts = (products.length >= 3 ? products : FALLBACK_PRODUCTS).slice(0, 3);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="w-full bg-[#F5F0E8] py-[60px] md:pt-10 md:pb-[100px]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col mb-12 md:mb-16">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
            OUR BEST
          </span>
          <h2 className="font-serif italic font-light text-5xl md:text-[64px] text-[#1C1917] leading-tight md:leading-none">
            Picked for you.
          </h2>
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-6 md:mt-[30px]" />
        </div>

        {/* Grid Layout */}
        <motion.div
          className="flex flex-col md:grid md:grid-cols-[1fr_1.4fr_1fr] gap-[20px] md:gap-[24px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayProducts.map((product, index) => {
            const isFeatured = index === 1;
            const imageSrc = product.images?.[0] || "/shoes/shoe-1.png";
            const orderClass =
              index === 0 ? "order-2 md:order-1" :
              index === 1 ? "order-1 md:order-2" : "order-3 md:order-3";

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className={`flex flex-col rounded-[20px] p-8 md:p-8 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl group ${
                  isFeatured
                    ? "bg-[#C4714A] text-[#FAF8F4] self-stretch"
                    : "bg-[#FAF8F4] text-[#1C1917]"
                } ${orderClass}`}
              >
                {/* Image Area (Clickable Link) */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-full flex items-center justify-center mb-8 block cursor-pointer"
                  aria-label={`View ${product.name}`}
                >
                  {isFeatured && (
                    <span className="absolute -top-2 hover:-translate-y-1 transition duration-300 right-0 bg-white text-[#C4714A] font-sans text-[10px] tracking-wide px-3 py-1.5 rounded-full font-bold shadow-sm z-10">
                      BESTSELLER
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className={`object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl ${
                      isFeatured ? "h-[280px] md:h-[320px]" : "h-[240px] md:h-[260px]"
                    }`}
                  />
                </Link>

                {/* Separator line */}
                <div className={`w-full h-[1px] mb-6 ${isFeatured ? "bg-white/20" : "bg-[#1C1917]/10"}`} />

                {/* Text Area */}
                <div className="flex flex-col flex-1">
                  <span className={`font-sans text-[10px] uppercase tracking-[0.15em] mb-2 ${isFeatured ? "text-white/80" : "text-[#6B6560]"}`}>
                    SOLEIL
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="hover:opacity-85 transition-opacity"
                  >
                    <h3 className="font-serif text-[28px] mb-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <p className={`font-sans text-[13px] mb-8 leading-relaxed ${isFeatured ? "text-white/90" : "text-[#6B6560]"}`}>
                    {product.description}
                  </p>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-end mt-auto">
                    <span className="font-serif text-[24px] font-bold">
                      <Price amount={product.price} />
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className={`font-sans text-[12px] font-medium px-5 py-2.5 rounded-md transition-all duration-300 ${
                        isFeatured
                          ? "bg-white text-[#C4714A] border border-transparent hover:bg-[#FAF8F4] hover:shadow-md"
                          : "bg-transparent text-[#1C1917] border border-[#1C1917] hover:bg-[#1C1917] hover:text-white"
                      }`}
                    >
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View all link */}
        <div className="mt-12 flex justify-center w-full">
          <Link href="/shop" className="font-serif italic text-[18px] text-[#1C1917] hover:underline transition-all underline-offset-4">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}

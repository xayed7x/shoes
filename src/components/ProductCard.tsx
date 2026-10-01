"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import Price from "@/components/ui/Price";

/**
 * Aspect ratio constant for the image container.
 * 4/3 gives landscape shoe photography maximum scale with zero heel/toe cropping,
 * while keeping the overall card compact.
 */
export const PRODUCT_CARD_ASPECT = "aspect-[4/3]";

interface ProductCardProps {
  product: Product;
  /** Optional index for staggered entrances or list keys */
  index?: number;
  /** Backward compatibility placeholder */
  compact?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = Boolean(
    (product as { is_sold_out?: boolean }).is_sold_out ||
      (product.variants &&
        product.variants.length > 0 &&
        product.variants.every((v) => v.stock <= 0))
  );

  const hasDiscount =
    !isSoldOut &&
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  // Single badge priority: Sold out > Sale (-X%) > New > Bestseller
  let badge: { text: string; className: string } | null = null;
  if (isSoldOut) {
    badge = {
      text: "Sold out",
      className: "bg-[#1C1917]/85 text-white backdrop-blur-xs",
    };
  } else if (hasDiscount) {
    const discountPercent = Math.round(
      ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
    );
    badge = {
      text: `Sale -${discountPercent}%`,
      className: "bg-[#C4714A] text-white",
    };
  } else if (product.is_new) {
    badge = {
      text: "New",
      className: "bg-[#1C1917] text-white",
    };
  } else if (product.is_featured) {
    badge = {
      text: "Bestseller",
      className: "bg-[#FAF8F4]/95 text-[#1C1917] border border-[#1C1917]/10 backdrop-blur-xs",
    };
  }

  const image1 = product.images?.[0] || "/shoes/product/loafer-tan.jpg";
  const image2 = product.images?.[1] || null;
  const hasSecondImage = Boolean(image2);

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.name}, ৳${product.price.toLocaleString("en-BD")}`}
      className="group flex flex-col h-full bg-white border border-[#E8DFD0] rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] focus-visible:ring-offset-2"
    >
      {/* Edge-to-edge Inner Image Box */}
      <div
        className={`relative w-full ${PRODUCT_CARD_ASPECT} rounded-xl overflow-hidden bg-[#F5F0E8]`}
      >
        {/* Top-Left Single Pill Badge */}
        {badge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span
              className={`inline-block font-sans text-[10px] md:text-[11px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs ${badge.className}`}
            >
              {badge.text}
            </span>
          </div>
        )}

        {/* Primary Image */}
        <Image
          src={image1}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.04] ${
            isSoldOut ? "saturate-50 opacity-90" : ""
          } ${hasSecondImage ? "[@media(hover:hover)]:group-hover:opacity-0" : ""}`}
        />

        {/* Secondary Crossfade Image */}
        {hasSecondImage && image2 && (
          <Image
            src={image2}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.04] ${
              isSoldOut ? "saturate-50 opacity-90" : ""
            }`}
          />
        )}
      </div>

      {/* Bottom Bar: Name & Price (Full width on mobile, right-aligned button on desktop) */}
      <div className="pt-3 px-1 flex items-center justify-between gap-2.5 mt-auto">
        {/* Product Name & Price */}
        <div className="min-w-0 flex-1 flex flex-col">
          <h3 className="font-serif italic text-[15px] sm:text-[16px] text-[#1C1917] font-medium leading-snug truncate group-hover:text-[#C4714A] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-[14px] sm:text-[15px] font-semibold tabular-nums lining-nums ${
                isSoldOut ? "text-[#8C827A]" : "text-[#1C1917]"
              }`}
            >
              <Price amount={product.price} />
            </span>
            {hasDiscount && (
              <span className="text-[11px] sm:text-[12px] text-[#8C827A] line-through">
                <Price amount={product.compare_at_price!} muted strikethrough />
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Button visible on desktop/tablet only, hidden on mobile */}
        <div className="hidden sm:flex flex-shrink-0">
          <div
            role="button"
            tabIndex={-1}
            className="py-1.5 px-3 sm:px-3.5 rounded-lg bg-[#1C1917] text-[#FAF8F4] text-[11px] sm:text-[12px] font-medium tracking-wide flex items-center gap-1 group-hover:bg-[#C4714A] transition-colors duration-200 shadow-xs"
          >
            <span>{isSoldOut ? "Details" : "View"}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

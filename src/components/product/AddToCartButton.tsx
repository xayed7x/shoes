"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const variants = product.variants || [];

  // If there are variants, find the first one in stock to select by default
  const defaultVariant = variants.find((v) => v.stock > 0) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    defaultVariant
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setError("Please select a size.");
      return;
    }
    if (selectedVariant.stock <= 0) {
      setError("Selected size is out of stock.");
      return;
    }
    
    setError(null);
    // Add 1 item of this variant to cart (opens drawer automatically)
    addItem(product, selectedVariant, 1);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size Selector */}
      {variants.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#1C1917] font-semibold">
              Select Size (EU)
            </span>
            <button className="font-sans text-[11px] text-[#6B6560] underline underline-offset-2">
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isAvailable = variant.stock > 0;
              return (
                <button
                  key={variant.id}
                  disabled={!isAvailable}
                  onClick={() => setSelectedVariant(variant)}
                  className={`relative py-3 rounded-[8px] font-sans text-[14px] transition-all duration-200 border ${
                    isSelected
                      ? "border-[#1C1917] bg-[#1C1917] text-[#FAF8F4]"
                      : isAvailable
                      ? "border-[#E8DFD0] bg-transparent text-[#1C1917] hover:border-[#1C1917]"
                      : "border-[#E8DFD0] bg-[#F5F0E8] text-[#E8DFD0] cursor-not-allowed"
                  }`}
                >
                  {variant.size}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-[1px] bg-[#E8DFD0] rotate-45 transform origin-center" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {error && <p className="font-sans text-[12px] text-red-500 mt-1">{error}</p>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-4 px-6 rounded-[8px] font-sans text-[13px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 ${
            isOutOfStock
              ? "bg-[#E8DFD0] text-[#6B6560] cursor-not-allowed"
              : success
              ? "bg-green-700 text-white"
              : "bg-[#1C1917] text-[#FAF8F4] hover:bg-[#C4714A]"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : success ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

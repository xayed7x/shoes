"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatBDT } from "@/lib/utils";
import Price from "@/components/ui/Price";
export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!isOpen) return;
    const el = drawerRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    first?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const itemCount = totalItems();
  const total = subtotal();
  const shipping = total >= 3000 ? 0 : 120; // Free shipping over ৳3,000
  const grand = total + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="cart-panel"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
            className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-[420px] bg-[#FAF8F4] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD0]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                <h2 className="font-serif text-[22px] text-[#1C1917] leading-none">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="bg-[#C4714A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                id="cart-close-btn"
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full bg-[#F5F0E8] flex items-center justify-center hover:bg-[#E8DFD0] transition-colors"
              >
                <X className="w-4 h-4 text-[#1C1917]" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag
                    className="w-14 h-14 text-[#E8DFD0]"
                    strokeWidth={1}
                  />
                  <p className="font-serif italic text-[22px] text-[#1C1917]">
                    Your cart is empty
                  </p>
                  <p className="font-sans text-[13px] text-[#6B6560]">
                    Explore our collection and add something beautiful.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 inline-block font-sans text-[12px] uppercase tracking-widest text-[#1C1917] border-b border-[#1C1917] hover:opacity-60 transition-opacity"
                  >
                    Shop All
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5" aria-label="Cart items">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const effectivePrice =
                        item.variant.price_override ?? item.product.price;
                      const imageSrc =
                        item.product.images?.[0] || "/shoes/shoe-1.png";
                      const isRemote = imageSrc.startsWith("http");

                      return (
                        <motion.li
                          key={item.variant.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4 bg-white rounded-[14px] p-4 border border-[#E8DFD0] relative"
                        >
                          {/* Product image */}
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="flex-shrink-0 w-[80px] h-[80px] bg-[#F5F0E8] rounded-[10px] overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            {isRemote ? (
                              <Image
                                src={imageSrc}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageSrc}
                                alt={item.product.name}
                                className="max-h-[68px] max-w-[68px] object-contain"
                              />
                            )}
                          </Link>

                          {/* Details */}
                          <div className="flex flex-col flex-1 min-w-0">
                            <p className="font-sans text-[10px] uppercase tracking-widest text-[#6B6560]">
                              PREMIUM EXPORT SHOES
                            </p>
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={closeCart}
                              className="hover:text-[#C4714A] transition-colors"
                            >
                              <h3 className="font-serif text-[16px] text-[#1C1917] leading-tight mt-0.5 truncate">
                                {item.product.name}
                              </h3>
                            </Link>
                            <div className="flex gap-2 mt-1">
                              <span className="font-sans text-[11px] text-[#6B6560]">
                                EU {item.variant.size}
                              </span>
                              {item.variant.color && (
                                <>
                                  <span className="text-[#E8DFD0]">·</span>
                                  <span className="font-sans text-[11px] text-[#6B6560]">
                                    {item.variant.color}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <span className="font-serif text-[17px] font-semibold text-[#1C1917]">
                                <Price
                                  amount={effectivePrice * item.quantity}
                                />
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variant.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  aria-label={`Decrease quantity of ${item.product.name}`}
                                  className="w-7 h-7 rounded-full border border-[#E8DFD0] flex items-center justify-center hover:bg-[#F5F0E8] transition-colors"
                                >
                                  <Minus className="w-3 h-3 text-[#1C1917]" />
                                </button>
                                <span className="font-sans text-[13px] text-[#1C1917] min-w-[16px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variant.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  aria-label={`Increase quantity of ${item.product.name}`}
                                  className="w-7 h-7 rounded-full border border-[#E8DFD0] flex items-center justify-center hover:bg-[#F5F0E8] transition-colors"
                                >
                                  <Plus className="w-3 h-3 text-[#1C1917]" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.variant.id)}
                                  aria-label={`Remove ${item.product.name} from cart`}
                                  className="ml-1 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer (only shown when cart has items) */}
            {items.length > 0 && (
              <div className="border-t border-[#E8DFD0] px-6 py-5 bg-[#F5F0E8] flex flex-col gap-3">
                {/* Order summary */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-sans text-[13px] text-[#6B6560]">
                    <span>Subtotal</span>
                    <span>
                      <Price amount={total} muted />
                    </span>
                  </div>
                  <div className="flex justify-between font-sans text-[13px] text-[#6B6560]">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-medium">
                          Free
                        </span>
                      ) : (
                        <Price amount={shipping} muted />
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-[#6B6560] italic">
                      Free shipping on orders over ৳3,000
                    </p>
                  )}
                  <div className="flex justify-between font-serif text-[19px] text-[#1C1917] pt-2 border-t border-[#E8DFD0]">
                    <span>Total</span>
                    <span>
                      <Price amount={grand} />
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex justify-center items-center bg-[#1C1917] text-[#FAF8F4] font-sans text-[13px] uppercase tracking-[0.15em] py-4 rounded-[8px] hover:bg-[#C4714A] transition-colors"
                >
                  Checkout
                </Link>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="text-center font-sans text-[12px] text-[#6B6560] hover:text-[#1C1917] transition-colors underline underline-offset-2"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

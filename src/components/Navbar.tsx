"use client";

import { useEffect, useState, Suspense } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import BrandWordmark from "@/components/BrandWordmark";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const links = [
    { label: "New Arrivals", href: "/shop?sort=newest", key: "newest" },
    { label: "Men", href: "/shop?category=men", key: "men" },
    { label: "Women", href: "/shop?category=women", key: "women" },
    { label: "Shop All", href: "/shop", key: "all" },
  ];

  const checkActive = (key: string) => {
    if (pathname !== "/shop") return false;
    const cat = searchParams.get("category");
    const sort = searchParams.get("sort");
    if (key === "newest") return sort === "newest";
    if (key === "men") return cat === "men";
    if (key === "women") return cat === "women";
    if (key === "all") return !cat && !sort;
    return false;
  };

  return (
    <div className="hidden md:flex items-center space-x-7 text-[13px] font-semibold tracking-[0.12em] uppercase">
      {links.map((link) => {
        const isActive = checkActive(link.key);
        return (
          <Link
            key={link.label}
            href={link.href}
            id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="relative py-1.5 text-[#1C1917] transition-colors hover:text-[#1C1917] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] rounded-sm"
          >
            <span>{link.label}</span>
            {/* Animated terracotta hover underline */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C4714A] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            {/* Active route indicator dot */}
            {isActive && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C4714A]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { totalItems, openCart, _hasHydrated } = useCartStore();
  const itemCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinksList = [
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Men", href: "/shop?category=men" },
    { label: "Women", href: "/shop?category=women" },
    { label: "Shop All", href: "/shop" },
  ];

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[1200px] h-[56px] md:h-[64px] z-[100] px-4 md:px-7 flex items-center justify-between rounded-full transition-all duration-300 pointer-events-auto"
        style={{
          backgroundColor: isScrolled
            ? "rgba(252, 248, 242, 0.86)"
            : "rgba(252, 248, 242, 0.70)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          border: "1px solid rgba(28, 25, 23, 0.08)",
          boxShadow: isScrolled
            ? "0 8px 30px -12px rgba(28,25,23,0.32), inset 0 1px 0 rgba(255,255,255,0.70)"
            : "0 8px 30px -12px rgba(28,25,23,0.18), inset 0 1px 0 rgba(255,255,255,0.60)",
        }}
      >
        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            id="mobile-menu-btn"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917]/08 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center">
          <BrandWordmark
            size="md"
            mobileResponsive
            className="hover:text-[#C4714A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] rounded-sm py-0.5"
          />
        </div>

        {/* Center Nav Links (Desktop) */}
        <Suspense
          fallback={
            <div className="hidden md:flex items-center space-x-7 text-[13px] font-semibold tracking-[0.12em] uppercase text-[#1C1917]/60">
              {navLinksList.map((link) => (
                <span key={link.label}>{link.label}</span>
              ))}
            </div>
          }
        >
          <NavLinks />
        </Suspense>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Track Order Link */}
          <Link
            href="/track"
            className="hidden lg:block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#1C1917]/65 hover:text-[#1C1917] transition-colors px-2 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A]"
          >
            Track Order
          </Link>

          {/* Thin Vertical Divider */}
          <div
            className="hidden lg:block w-[1px] h-4 bg-[#1C1917]/15 mx-1"
            aria-hidden="true"
          />

          {/* Search Button */}
          <Link
            href="/shop"
            aria-label="Search catalog"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917]/08 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A]"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Cart Button */}
          <button
            id="cart-open-btn"
            aria-label={
              _hasHydrated
                ? `Open shopping cart (${itemCount} item${itemCount !== 1 ? "s" : ""})`
                : "Open shopping cart"
            }
            onClick={openCart}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917]/08 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A]"
          >
            <ShoppingBag className="w-5 h-5" />
            {_hasHydrated && itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={
                  shouldReduceMotion ? false : { scale: 0.5, opacity: 0 }
                }
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C4714A] text-white text-[10px] font-bold flex items-center justify-center shadow-md pointer-events-none"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full h-screen z-[999] bg-[#1C1917] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-7 right-6 text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] rounded-full"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="mb-4" onClick={() => setMobileMenuOpen(false)}>
              <BrandWordmark size="lg" dark />
            </div>
            {navLinksList.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans uppercase tracking-[0.25em] text-[13px] text-[#FAF8F4]/80 hover:text-[#FAF8F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] px-3 py-1 rounded-sm"
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-16 h-px bg-white/15" aria-hidden="true" />

            {/* Admin link */}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-sans uppercase tracking-[0.25em] text-[11px] text-[#FAF8F4]/40 hover:text-[#FAF8F4]/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] px-3 py-1 rounded-sm"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                aria-hidden="true"
              />
              Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

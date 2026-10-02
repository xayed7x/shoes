"use client";

import { useEffect, useState } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
  width?: string | number;
  height?: string | number;
}

const shimmerDuration = 1400; // 1.4s

export default function Skeleton({
  className = "",
  variant = "rect",
  width,
  height,
}: SkeletonProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const baseClasses = "bg-[#E8DFD0] rounded";
  
  const variantClasses = {
    text: "h-4",
    rect: "",
    circle: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (reducedMotion) {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #E8DFD0 0%,
            #F5F0E8 25%,
            #E8DFD0 50%,
            #F5F0E8 75%,
            #E8DFD0 100%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer ${shimmerDuration}ms ease-in-out infinite;
        }
      `}</style>
      <div
        className={`${baseClasses} ${variantClasses[variant]} skeleton-shimmer ${className}`}
        style={style}
        aria-hidden="true"
      />
    </>
  );
}

// Pre-built skeleton components for common patterns
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E8DFD0] rounded-[16px] overflow-hidden">
      <Skeleton className="w-full h-[240px]" variant="rect" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-5" variant="text" />
        <Skeleton className="w-1/2 h-4" variant="text" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="w-20 h-5" variant="text" />
          <Skeleton className="w-8 h-8 rounded-full" variant="circle" />
        </div>
      </div>
    </div>
  );
}

export function ProductGallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full aspect-square rounded-[16px]" variant="rect" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-[8px]" variant="rect" />
        ))}
      </div>
    </div>
  );
}

export function ProductInfoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-1/2 h-6" variant="text" />
      <Skeleton className="w-full h-4" variant="text" />
      <Skeleton className="w-full h-4" variant="text" />
      <Skeleton className="w-3/4 h-4" variant="text" />
      <div className="pt-4 space-y-3">
        <Skeleton className="w-32 h-8" variant="text" />
        <Skeleton className="w-full h-12 rounded-[8px]" variant="rect" />
      </div>
    </div>
  );
}

export function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-48 h-7" variant="text" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-[8px]" variant="rect" />
          <Skeleton className="h-12 rounded-[8px]" variant="rect" />
        </div>
        <Skeleton className="h-12 rounded-[8px]" variant="rect" />
      </div>
      <div className="space-y-4">
        <Skeleton className="w-40 h-7" variant="text" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-[8px]" variant="rect" />
          <Skeleton className="h-12 rounded-[8px]" variant="rect" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="w-36 h-7" variant="text" />
        <Skeleton className="h-12 rounded-[8px]" variant="rect" />
      </div>
      <Skeleton className="w-full h-14 rounded-[10px]" variant="rect" />
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      {/* Desktop hero */}
      <div className="hidden md:block">
        <Skeleton
          className="w-full rounded-b-[32px]"
          height="clamp(500px, 72vh, 800px)"
        />
      </div>

      {/* Mobile hero */}
      <div className="block md:hidden w-full px-4 pt-[88px] pb-5">
        <Skeleton className="w-full h-[180px] rounded-2xl" />
      </div>

      <div className="max-w-[1300px] mx-auto px-5 md:px-12 py-10 space-y-10">
        <div className="hidden md:block space-y-3">
          <Skeleton className="w-40 h-4" variant="text" />
          <Skeleton className="w-72 h-10" variant="text" />
        </div>

        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-10 w-28 rounded-full shrink-0"
              variant="rect"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="bg-white border border-[#E8DFD0] rounded-[16px] p-6 space-y-4">
      <Skeleton className="w-32 h-6" variant="text" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-16 h-20 rounded-[8px]" variant="rect" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4" variant="text" />
              <Skeleton className="w-1/2 h-3" variant="text" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E8DFD0] pt-4 space-y-2">
        <Skeleton className="w-full h-4" variant="text" />
        <Skeleton className="w-full h-4" variant="text" />
        <Skeleton className="w-1/2 h-5" variant="text" />
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import { Product } from "@/types";
import { FALLBACK_PRODUCTS } from "@/lib/data/fallbackData";

interface ProductStripProps {
  products?: Product[];
}

const backgroundColors = [
  "#F0E8DC",
  "#B5C4A8",
  "#E8DFD0",
  "#C4714A",
  "#F5F0E8",
  "#D4C5B0",
  "#B5C4A8",
  "#1C1917",
];

export default function ProductStrip({ products = FALLBACK_PRODUCTS }: ProductStripProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [wrapWidth, setWrapWidth] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isDragging = useRef(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const displayProducts = (products.length > 0 ? products : FALLBACK_PRODUCTS).slice(0, 8);
  const duplicatedProducts = [...displayProducts, ...displayProducts];

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setWrapWidth(trackRef.current.scrollWidth / 2);
      }
    };
    
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [displayProducts]);

  useAnimationFrame((time, delta) => {
    if (isHovered || wrapWidth === 0 || shouldReduceMotion) return;
    
    const moveBy = 0.5 * (delta / 16);
    let newX = x.get() - moveBy;

    if (newX <= -wrapWidth) {
      newX += wrapWidth;
    } else if (newX > 0) {
      newX -= wrapWidth;
    }

    x.set(newX);
  });

  return (
    <section 
      className="w-full overflow-hidden bg-[#F5F0E8] cursor-grab active:cursor-grabbing pb-6 md:pb-8 relative z-10"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)"
      }}
    >
      <div 
        ref={containerRef}
        className="w-full py-[10px] md:py-4 pt-5 md:pt-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div className="md:hidden flex px-5 mb-4 items-end">
          <h2 className="text-2xl font-bold tracking-tight text-[#1C1917]">Trending Now</h2>
        </div>
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -wrapWidth * 2, right: wrapWidth }}
          onDragStart={() => {
            setIsHovered(true);
            isDragging.current = true;
          }}
          onDragEnd={() => {
            setIsHovered(false);
            setTimeout(() => {
              isDragging.current = false;
            }, 50);
          }}
          className="flex w-max"
        >
          <div className="flex gap-6 md:gap-8 px-6 md:px-8 w-max">
            {duplicatedProducts.map((product, idx) => {
              const rotateClass = idx % 2 === 0 ? "-rotate-2" : "rotate-2";
              const bg = backgroundColors[idx % backgroundColors.length];
              const imageSrc = product.images?.[0] || "/shoes/shoe-1.png";

              return (
                <Link
                  key={`${product.id}-${idx}`}
                  href={`/product/${product.slug}`}
                  onClick={(e) => {
                    if (isDragging.current) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex flex-col flex-shrink-0 w-[220px] h-[300px] md:w-[280px] md:h-[380px] rounded-2xl shadow-sm hover:shadow-xl hover:rotate-0 hover:-translate-y-2 transition-all duration-300 ease-out origin-center cursor-pointer ${rotateClass}`}
                  style={{ backgroundColor: bg }}
                  aria-label={`${product.name} - ৳${product.price.toLocaleString("en-BD")}`}
                >
                  <div className="relative w-full h-[65%] flex items-center justify-center pt-4">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-[80%] h-[80%] object-contain pointer-events-none drop-shadow-lg"
                    />
                  </div>
                  
                  <div className="w-[80%] h-[1px] bg-black/10 mx-auto" />

                  <div className="flex flex-col items-center justify-center flex-1 px-4 text-center pb-2">
                    <h3 className={`font-serif italic text-xl md:text-2xl ${bg === '#1C1917' ? 'text-white' : 'text-[#1C1917]'}`}>
                      {product.name}
                    </h3>
                    <p className={`font-sans text-sm md:text-base mt-1 tracking-wider ${bg === '#1C1917' ? 'text-white/70' : 'text-[#6B6560]'}`}>
                      ৳{product.price.toLocaleString("en-BD")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

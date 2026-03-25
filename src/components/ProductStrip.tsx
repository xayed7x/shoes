"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const stripProducts = [
  { id: 1, title: "The Artisan", price: "৳4,900", image: "/shoes/shoe-1.png", bg: "#F0E8DC" },
  { id: 2, title: "Night Walker", price: "৳5,900", image: "/shoes/shoe-2.png", bg: "#B5C4A8" },
  { id: 3, title: "Terra Step", price: "৳6,900", image: "/shoes/shoe-3.png", bg: "#E8DFD0" },
  { id: 4, title: "Sage Drift", price: "৳5,500", image: "/shoes/shoe-4.png", bg: "#C4714A" },
  { id: 5, title: "The Artisan", price: "৳4,900", image: "/shoes/shoe-1.png", bg: "#F5F0E8" },
  { id: 6, title: "Night Walker", price: "৳5,900", image: "/shoes/shoe-2.png", bg: "#D4C5B0" },
  { id: 7, title: "Terra Step", price: "৳6,900", image: "/shoes/shoe-3.png", bg: "#B5C4A8" },
  { id: 8, title: "Sage Drift", price: "৳5,500", image: "/shoes/shoe-4.png", bg: "#1C1917" }
];

export default function ProductStrip() {
  const [isHovered, setIsHovered] = useState(false);
  const [wrapWidth, setWrapWidth] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // We duplicate the array to allow for a seamless 50% translateX loop
  const duplicatedProducts = [...stripProducts, ...stripProducts];

  // Measure the width of the FIRST HALF (8 items) for seamless wrapping
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // scrollWidth gives the total width of all 16 items + gaps. Divide by 2.
        setWrapWidth(trackRef.current.scrollWidth / 2);
      }
    };
    
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Continuous animation loop
  useAnimationFrame((time, delta) => {
    if (isHovered || wrapWidth === 0) return;
    
    // speed factor: smaller is slower
    const moveBy = 0.5 * (delta / 16);
    let newX = x.get() - moveBy;

    // Wrap seamlessly
    if (newX <= -wrapWidth) {
      newX += wrapWidth;
    } else if (newX > 0) {
      newX -= wrapWidth;
    }

    x.set(newX);
  });

  return (
    <section className="w-full overflow-hidden bg-[#F5F0E8] cursor-grab active:cursor-grabbing pb-[40px] md:pb-[60px]">
      <div 
        ref={containerRef}
        className="w-full py-[10px] md:py-[40px] pt-5 md:pt-[40px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Mobile "Trending Now" Header */}
        <div className="md:hidden flex px-5 mb-4 items-end">
          <h2 className="text-2xl font-bold tracking-tight text-[#1C1917]">Trending Now</h2>
        </div>
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -wrapWidth * 2, right: wrapWidth }}
          onDragStart={() => setIsHovered(true)}
          onDragEnd={() => setIsHovered(false)}
          className="flex w-max"
        >
          <div className="flex gap-6 md:gap-8 px-6 md:px-8 w-max">
            {duplicatedProducts.map((product, idx) => {
              const rotateClass = idx % 2 === 0 ? "-rotate-2" : "rotate-2";
              return (
                <div
                  key={`${product.id}-${idx}`}
                  className={`flex flex-col flex-shrink-0 w-[220px] h-[300px] md:w-[280px] md:h-[380px] rounded-2xl shadow-sm hover:shadow-xl hover:rotate-0 hover:-translate-y-2 transition-all duration-300 ease-out origin-center ${rotateClass}`}
                  style={{ backgroundColor: product.bg }}
                >
                  {/* Image taking top 65% */}
                  <div className="relative w-full h-[65%] flex items-center justify-center pt-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-[80%] h-[80%] object-contain pointer-events-none drop-shadow-lg"
                    />
                  </div>
                  
                  {/* Separator Line */}
                  <div className="w-[80%] h-[1px] bg-black/10 mx-auto" />

                  {/* Text taking bottom 35% */}
                  <div className="flex flex-col items-center justify-center flex-1 px-4 text-center pb-2">
                    <h3 className={`font-serif italic text-xl md:text-2xl ${product.bg === '#1C1917' ? 'text-white' : 'text-[#1C1917]'}`}>
                      {product.title}
                    </h3>
                    <p className={`font-sans text-sm md:text-base mt-1 tracking-wider ${product.bg === '#1C1917' ? 'text-white/70' : 'text-[#6B6560]'}`}>
                      {product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

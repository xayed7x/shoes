"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";

/**
 * MobileHeroSection — the original mobile image carousel, extracted verbatim
 * from HeroSection.tsx so that HeroSection can be a server component.
 * Do NOT modify the markup or behavior here.
 */

const slides = [
  { id: 1, image: "/shoes/shoe-1.png" },
  { id: 2, image: "/shoes/shoe-2.png" },
  { id: 3, image: "/shoes/shoe-3.png" },
  { id: 4, image: "/shoes/shoe-4.png" },
];

export default function MobileHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  // isDragging mirrors the original; kept to prevent re-renders mid-swipe
  const [, setIsDragging] = useState(false);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.offset.y < -swipeThreshold) {
      setActiveIndex((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (
      info.offset.x > swipeThreshold ||
      info.offset.y > swipeThreshold
    ) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    /* Mobile View: Horizontal Snap Carousel with Next Card Peeking (Framer Motion) */
    <div className="pt-[84px] w-full overflow-hidden relative">
      <motion.div
        className="flex px-[5vw] gap-[4vw] w-max"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{ x: `calc(-${activeIndex * 89}vw)` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-[85vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-none bg-transparent relative"
          >
            <img
              src={slide.image}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              alt={`Mobile Slide ${slide.id}`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "./Navbar";

const slides = [
  { id: 1, image: "/shoes/shoe-1.png", isDark: false },
  { id: 2, image: "/shoes/shoe-2.png", isDark: true },
  { id: 3, image: "/shoes/shoe-3.png", isDark: true },
  { id: 4, image: "/shoes/shoe-4.png", isDark: false },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (isHovered || isDragging) return;
    
    // Auto scroll logic requested by user
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered, isDragging]);

  // Handle drag for mobile/desktop swipe
  const handleDragEnd = (e: any, info: any) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.offset.y < -swipeThreshold) {
      setActiveIndex((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (info.offset.x > swipeThreshold || info.offset.y > swipeThreshold) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => setActiveIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const handlePrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div 
      className="relative w-screen md:h-screen md:overflow-hidden bg-[#F5F0E8] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Navbar />
      
      {/* Desktop View: Full screen animated crossfade */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={activeIndex}
            src={slides[activeIndex].image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing origin-center"
            alt={`Slide ${activeIndex + 1}`}
          />
        </AnimatePresence>

        {/* Desktop Left/Right Navigation Arrows */}
        {activeIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-all z-50 group"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        {activeIndex < slides.length - 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-all z-50 group"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Desktop Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? "bg-[#1C1917] scale-150" 
                  : "bg-[#1C1917]/30 hover:bg-[#1C1917]/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator on Last Slide */}
        <AnimatePresence>
          {activeIndex === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center animate-bounce z-50 text-[#1C1917]/70"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold mb-1">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile View: Horizontal Snap Carousel with Next Card Peeking (Framer Motion) */}
      <div className="md:hidden pt-[84px] w-full overflow-hidden relative">
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
    </div>
  );
}

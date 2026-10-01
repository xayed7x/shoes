"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { HeroSlide } from "@/data/heroSlides";

interface HeroControlsProps {
  slides: HeroSlide[];
  activeIndex: number;
  progress: number; // 0–100
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  theme: HeroSlide["theme"];
}

export function HeroControls({
  slides,
  activeIndex,
  progress,
  onPrev,
  onNext,
  onGoTo,
  theme,
}: HeroControlsProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-4" role="group" aria-label="Slideshow controls">
      {/* Prev arrow */}
      <button
        id="hero-prev-btn"
        onClick={onPrev}
        disabled={activeIndex === 0}
        aria-label="Previous slide"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          border: `1.5px solid ${theme.textColor}30`,
          color: theme.textColor,
        }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={activeIndex === idx}
            aria-label={`Go to slide ${idx + 1}: ${s.headline}`}
            id={`hero-dot-${idx + 1}`}
            onClick={() => onGoTo(idx)}
            className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              width: activeIndex === idx ? "24px" : "8px",
              height: "8px",
              backgroundColor:
                activeIndex === idx
                  ? theme.circleColor
                  : `${theme.textColor}25`,
            }}
          />
        ))}
      </div>

      {/* Next arrow */}
      <button
        id="hero-next-btn"
        onClick={onNext}
        disabled={activeIndex === slides.length - 1}
        aria-label="Next slide"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          border: `1.5px solid ${theme.textColor}30`,
          color: theme.textColor,
        }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Counter */}
      <span
        className="text-[12px] font-medium tabular-nums tracking-widest ml-1"
        style={{ color: theme.textMuted }}
        aria-live="polite"
        aria-atomic="true"
      >
        {pad(activeIndex + 1)}&thinsp;/&thinsp;{pad(slides.length)}
      </span>

      {/* Autoplay progress bar */}
      <div
        className="relative h-[2px] w-12 rounded-full overflow-hidden"
        style={{ backgroundColor: `${theme.textColor}15` }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: theme.progressColor }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </div>
  );
}

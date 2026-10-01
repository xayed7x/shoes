"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { heroSlides } from "@/data/heroSlides";
import { HeroSlideContent, HeroShoe } from "./HeroSlide";
import { HeroControls } from "./HeroControls";

interface DesktopHeroClientProps {
  /** Pre-fetched price strings indexed by productSlug, e.g. { "the-artisan-loafer": 4900 } */
  prices: Record<string, number | null>;
}

const AUTOPLAY_MS = 6000;

export default function DesktopHeroClient({ prices }: DesktopHeroClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  const elapsed = useRef(0);
  const lastTick = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx);
    elapsed.current = 0;
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    goTo(Math.max(0, activeIndex - 1));
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % heroSlides.length);
  }, [activeIndex, goTo]);

  // Autoplay tick
  useEffect(() => {
    if (paused || reduced) return;

    const frame = (ts: number) => {
      if (lastTick.current === null) lastTick.current = ts;
      const delta = ts - lastTick.current;
      lastTick.current = ts;
      elapsed.current += delta;

      const pct = Math.min((elapsed.current / AUTOPLAY_MS) * 100, 100);
      setProgress(pct);

      if (elapsed.current >= AUTOPLAY_MS) {
        elapsed.current = 0;
        setActiveIndex((prev) => (prev + 1) % heroSlides.length);
      }
    };

    let rafId: number;
    const tick = (ts: number) => {
      frame(ts);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lastTick.current = null;
    };
  }, [paused, reduced]);

  // Arrow-key navigation when hero is focused
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext]
  );

  const currentSlide = heroSlides[activeIndex];

  return (
    <section
      ref={heroRef}
      aria-label="Hero slideshow"
      tabIndex={0}
      className="relative w-full overflow-hidden rounded-b-[32px] focus-visible:outline-none"
      style={{ height: "clamp(500px, 72vh, 800px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!heroRef.current?.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      {/* ── Background gradient crossfade ─────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${activeIndex}`}
          className="absolute inset-0"
          style={{ background: currentSlide.theme.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          aria-hidden="true"
        />
      </AnimatePresence>

      {/* ── Giant "Soleil" watermark ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden select-none"
      >
        <span
          className="font-serif italic translate-x-[12%] leading-none"
          style={{
            fontSize: "clamp(200px, 28vw, 380px)",
            color: currentSlide.theme.watermarkColor,
            transition: "color 0.9s ease",
          }}
        >
          Soleil
        </span>
      </div>

      {/* ── Content container ─────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto h-full flex flex-col px-8 lg:px-10" style={{ maxWidth: "1200px" }}>
        {/* Navbar spacer — nav pill is 64px tall + 16px top offset */}
        <div className="flex-none" style={{ height: "96px" }} aria-hidden="true" />

        {/* Main split row */}
        <div className="flex flex-1 items-center gap-8 lg:gap-12 overflow-hidden">
          {/* Left: text */}
          <div className="flex-none w-[44%] h-full flex flex-col justify-center">
            <HeroSlideContent
              slide={currentSlide}
              isActive={true}
              price={prices[currentSlide.productSlug] ?? null}
            />
          </div>

          {/* Right: shoe */}
          <div className="flex-1 h-full relative">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="absolute inset-0"
                style={{ pointerEvents: idx === activeIndex ? "auto" : "none" }}
              >
                <HeroShoe slide={slide} isActive={idx === activeIndex} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Controls row — absolute bottom-center of the section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-6 pointer-events-none">
        <div className="pointer-events-auto">
          <HeroControls
            slides={heroSlides}
            activeIndex={activeIndex}
            progress={reduced ? 0 : progress}
            onPrev={goPrev}
            onNext={goNext}
            onGoTo={goTo}
            theme={currentSlide.theme}
          />
        </div>
      </div>
    </section>
  );
}

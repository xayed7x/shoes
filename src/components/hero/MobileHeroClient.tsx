"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useReducedMotion,
} from "framer-motion";
import { heroSlides } from "@/data/heroSlides";
import Price from "@/components/ui/Price";

interface MobileHeroProps {
  prices: Record<string, number | null>;
}

export default function MobileHeroClient({ prices }: MobileHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const isDragging = useRef(false);

  const goNext = useCallback(
    () => setActiveIndex((p) => (p + 1) % heroSlides.length),
    [],
  );
  const goPrev = useCallback(
    () =>
      setActiveIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length),
    [],
  );

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDragging.current = false;
      if (info.offset.x < -45) goNext();
      else if (info.offset.x > 45) goPrev();
    },
    [goNext, goPrev],
  );

  const slide = heroSlides[activeIndex];
  const price = prices[slide.productSlug] ?? null;

  return (
    <section
      aria-label="Hero slideshow"
      className="block md:hidden w-full px-4 pt-[88px] pb-5"
    >
      {/* ── Swipeable card ──────────────────────────────────────────────── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              background: slide.theme.gradient,
              height: "180px",
            }}
          >
            {/* Watermark */}
            <span
              aria-hidden="true"
              className="absolute right-[-8%] bottom-[-20%] font-barlow-condensed font-extrabold italic uppercase leading-none pointer-events-none select-none"
              style={{
                fontSize: "120px",
                color: slide.theme.watermarkColor,
              }}
            >
              PREMIUM
            </span>

            {/* Left: text content */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center pl-5 pr-2 z-10 w-[58%]">
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.16em] mb-1 opacity-70"
                style={{ color: slide.theme.textColor }}
              >
                {slide.eyebrow}
              </p>
              <Link
                href={`/product/${slide.productSlug}`}
                onClick={(e) => {
                  if (isDragging.current) e.preventDefault();
                }}
                className="block font-serif italic leading-tight mb-2 hover:opacity-90"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(17px, 5vw, 22px)",
                  color: slide.theme.textColor,
                }}
              >
                {slide.headline}
              </Link>
              {price && (
                <p
                  className="text-[12px] font-bold mb-3"
                  style={{ color: slide.theme.textColor }}
                >
                  From <Price amount={price as number} />
                </p>
              )}
              <Link
                href={`/product/${slide.productSlug}`}
                onClick={(e) => {
                  if (isDragging.current) e.preventDefault();
                }}
                className="self-start inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-80"
                style={{
                  background: slide.theme.ctaBg,
                  color: slide.theme.ctaText,
                }}
              >
                Shop Now
              </Link>
            </div>

            {/* Right: shoe image (clickable) */}
            <Link
              href={`/product/${slide.productSlug}`}
              onClick={(e) => {
                if (isDragging.current) e.preventDefault();
              }}
              className="absolute right-0 top-0 bottom-0 w-[50%] flex items-end justify-center overflow-hidden z-20 cursor-pointer"
            >
              {/* Soft glow circle */}
              <div
                aria-hidden="true"
                className="absolute w-[160px] h-[160px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${slide.theme.circleColor}60 0%, transparent 70%)`,
                }}
              />
              <img
                src={slide.image}
                alt={slide.alt}
                draggable={false}
                className="relative z-10 h-[155px] w-auto object-contain drop-shadow-xl pointer-events-none translate-y-2"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Dot indicators ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-1.5 mt-3"
        role="tablist"
        aria-label="Hero slides"
      >
        {heroSlides.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Slide ${idx + 1}: ${s.headline}`}
            onClick={() => setActiveIndex(idx)}
            className="rounded-full transition-all duration-300 focus-visible:outline-none"
            style={{
              width: idx === activeIndex ? "18px" : "5px",
              height: "5px",
              background: idx === activeIndex ? "#1C1917" : "#1C191740",
            }}
          />
        ))}
      </div>
    </section>
  );
}

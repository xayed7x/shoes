"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/data/heroSlides";
import Price from "@/components/ui/Price";

interface HeroSlideProps {
  slide: HeroSlide;
  isActive: boolean;
  price: number | null;
}

export function HeroSlideContent({ slide, isActive, price }: HeroSlideProps) {
  const reduced = useReducedMotion();

  const textVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -10 },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slide.id}
          className="flex flex-col justify-center gap-5 h-full"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3"
            variants={textVariants}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            <span
              className="block w-8 h-[2px] rounded-full"
              style={{ backgroundColor: slide.theme.circleColor }}
              aria-hidden="true"
            />
            <span
              className="text-[11px] uppercase tracking-[0.2em] font-medium"
              style={{ color: slide.theme.textMuted }}
            >
              {slide.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-serif leading-[1.08] tracking-tight"
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 5.25rem)",
              color: slide.theme.textColor,
            }}
            variants={textVariants}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          >
            <Link
              href={`/product/${slide.productSlug}`}
              className="hover:opacity-90 transition-opacity"
            >
              {slide.headline}
            </Link>
          </motion.h1>

          {/* Subline */}
          <motion.p
            className="text-[15px] leading-relaxed max-w-[44ch]"
            style={{ color: slide.theme.textMuted }}
            variants={textVariants}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {slide.subline}
          </motion.p>

          {price && (
            <motion.p
              className="text-[19px] font-semibold tracking-wide"
              style={{ color: slide.theme.circleColor }}
              variants={textVariants}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            >
              From <Price amount={price as number} />
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            className="flex items-center gap-5 mt-1"
            variants={textVariants}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
          >
            <Link
              id={`hero-cta-${slide.id}`}
              href={`/product/${slide.productSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: slide.theme.ctaBg,
                color: slide.theme.ctaText,
              }}
              aria-label={`Shop Now — ${slide.headline}`}
            >
              Shop Now
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/shop"
              className="text-[12px] uppercase tracking-[0.15em] font-medium transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:underline"
              style={{ color: slide.theme.textMuted }}
            >
              View collection
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Shoe + decorative right column ──────────────────────────────────────────

interface HeroShoeProps {
  slide: HeroSlide;
  isActive: boolean;
}

export function HeroShoe({ slide, isActive }: HeroShoeProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slide.id}
          className="relative flex items-center justify-center w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Terracotta circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              backgroundColor: slide.theme.circleColor,
              width: "min(62%, 480px)",
              height: "min(62%, 480px)",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              opacity: 0.18,
            }}
            initial={{ scale: reduced ? 1 : 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.18 }}
            exit={{ scale: reduced ? 1 : 0.7, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Ground shadow */}
          <div
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: "55%",
              height: "28px",
              backgroundColor: "rgba(0,0,0,0.12)",
              filter: "blur(18px)",
            }}
            aria-hidden="true"
          />

          {/* Shoe image clickable link */}
          <motion.div
            className="relative z-10"
            style={{ width: "90%", maxWidth: "580px" }}
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, x: 40, rotate: 4 }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, x: 0, rotate: 0 }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, x: -30, rotate: -3 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/product/${slide.productSlug}`}
              aria-label={`View ${slide.headline}`}
              className="block cursor-pointer group focus-visible:outline-none"
            >
              {reduced ? (
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  priority={slide.id === 1}
                  className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    priority={slide.id === 1}
                    className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </motion.div>
              )}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

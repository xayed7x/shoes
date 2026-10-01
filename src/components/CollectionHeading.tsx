"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * CollectionHeading — the bridging section between the hero and the product marquee.
 * Desktop only (rendered inside a hidden md:block wrapper in page.tsx).
 * Scroll-reveal animation; respects prefers-reduced-motion.
 */
export default function CollectionHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={ref}
      className="w-full bg-[#F5F0E8]"
      style={{ paddingTop: "52px", paddingBottom: "28px" }}
    >
      <div
        className="mx-auto px-8 lg:px-10 flex items-end justify-between"
        style={{ maxWidth: "1200px" }}
      >
        {/* Left — eyebrow + heading */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span
              className="block w-7 h-[2px] rounded-full bg-[#C4714A]"
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#C4714A]">
              The Collection
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-serif leading-[1.1] tracking-tight text-[#2C1A0E]"
            style={{ fontSize: "clamp(2rem, 3.2vw, 2.75rem)" }}
          >
            Handcrafted, every pair.
          </h2>
        </motion.div>

        {/* Right — explore link */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Link
            href="/shop"
            className="group text-[13px] font-medium tracking-wide text-[#6B4C32] relative pb-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4714A] rounded-sm"
          >
            Explore all →
            <span
              className="absolute bottom-0 left-0 w-full h-[1.5px] rounded-full bg-[#C4714A] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

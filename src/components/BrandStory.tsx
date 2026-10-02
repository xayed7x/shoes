"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function BrandStory() {
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-50px" });

  // Helper to generate the exact responsive Tailwind classes based on inView state
  // Mobile (<768px): y: 20 -> 0. Desktop (>=1024px): x: -20 -> 0.
  // Delay units map to: 0 -> 0ms, 1 -> 150ms, 2 -> 250ms, 3 -> 350ms
  const getRevealClass = (idx: number) => {
    const delayClasses = [
      "delay-[0ms]",
      "delay-[150ms]",
      "delay-[250ms]",
      "delay-[350ms]",
    ];

    const baseTransition = "transition-all duration-[800ms] ease-out";

    if (isTextInView) {
      return `opacity-100 translate-x-0 translate-y-0 ${baseTransition} ${delayClasses[idx]}`;
    }
    return `opacity-0 max-md:translate-y-[20px] md:-translate-x-[20px] ${baseTransition} ${delayClasses[idx]}`;
  };

  return (
    <section className="w-full h-auto lg:h-[600px] bg-[#F5F0E8] overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left Column — Image Side */}
        <div className="w-full lg:w-1/2 h-[280px] md:h-[360px] lg:h-full overflow-hidden relative">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              backgroundImage: "url('/story-image.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-[#1C1917]/15"></div>
          </motion.div>
        </div>

        {/* Right Column — Text Side */}
        <div
          ref={textRef}
          className="w-full lg:w-1/2 bg-[#FAF8F4] flex flex-col justify-center p-[48px_24px] lg:p-[80px]"
        >
          {/* Label */}
          <span
            className={`font-sans text-[11px] uppercase tracking-[0.2em] text-[#C4714A] ${getRevealClass(0)}`}
          >
            OUR CRAFT
          </span>

          {/* Decorative Line */}
          <div
            className={`w-[40px] h-[1px] bg-[#C4714A] mt-[12px] mb-[32px] ${getRevealClass(0)}`}
          />

          {/* Heading */}
          <h2
            className={`font-serif italic font-light text-[36px] lg:text-[48px] text-[#1C1917] leading-[1.2] ${getRevealClass(1)}`}
          >
            Every stitch, placed with purpose.
          </h2>

          {/* Body Paragraph 1 */}
          <p
            className={`font-sans font-light text-[15px] text-[#6B6560] leading-[1.8] mt-[24px] ${getRevealClass(2)}`}
          >
            We believe that great footwear is not made in factories. It is made
            in moments — in the careful selection of leather, in the hands that
            shape each sole, in the quiet pride of a craftsman who signs every
            pair.
          </p>

          {/* Body Paragraph 2 */}
          <p
            className={`font-sans font-light text-[15px] text-[#6B6560] leading-[1.8] mt-[16px] ${getRevealClass(2)}`}
          >
            Premium Export Shoes was born from a simple obsession: to make
            sleepers that feel as remarkable as they look.
          </p>

          {/* Text Link */}
          <div className={`mt-[40px] ${getRevealClass(3)}`}>
            <a
              href="#"
              className="group relative font-serif italic text-[18px] text-[#1C1917] hover:text-[#C4714A] transition-colors duration-300 inline-block"
            >
              Read our story{" "}
              <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
              {/* Animated underline */}
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#C4714A] transition-all duration-300 ease-out group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

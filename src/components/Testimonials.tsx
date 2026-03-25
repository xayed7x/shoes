"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    stars: 5,
    quote: "I have never owned a pair of sleepers that felt this premium. The leather is soft, the fit is perfect, and people keep asking me where I got them.",
    name: "Rahman K.",
    purchase: "Purchased — The Artisan",
  },
  {
    id: 2,
    stars: 5,
    quote: "Soleil completely changed how I think about casual footwear. These are not just sleepers — they are a statement. Worth every penny.",
    name: "Priya M.",
    purchase: "Purchased — Sage Drift",
  },
  {
    id: 3,
    stars: 5,
    quote: "The craftsmanship is unreal. You can tell every detail was thought about carefully. I bought two pairs within the same week.",
    name: "Arif H.",
    purchase: "Purchased — Terra Step",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-[#F5F0E8] py-[60px] md:py-[100px] px-5 md:px-10">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-[60px]">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
            WHAT THEY SAY
          </span>
          <h2 className="font-serif italic font-light text-[40px] md:text-[64px] text-[#1C1917] leading-tight text-center">
            Loved by thousands.
          </h2>
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-6 md:mt-[30px]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[28px] w-full">
          {testimonials.map((t, idx) => {
            // Tablet-only rule for the 3rd card
            const tabletSpanClass = idx === 2 ? "md:col-span-2 lg:col-span-1 md:max-w-[500px] md:mx-auto lg:max-w-none" : "";
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeOut", 
                  // Desktop (lg) stagger, Mobile/Tablet (md) no stagger for simpler feel or per request
                  delay: typeof window !== 'undefined' && window.innerWidth >= 1024 ? idx * 0.15 : 0 
                }}
                className={`bg-white rounded-[20px] p-[28px] md:p-[40px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-[6px] transition-all duration-300 ease-out group flex flex-col ${tabletSpanClass}`}
              >
                {/* Top Row: Stars and Quote Icon */}
                <div className="flex justify-between items-start w-full">
                  <div className="text-[#C9A96E] text-[14px] tracking-[2px]">
                    {"★".repeat(t.stars)}
                  </div>
                  <span className="font-serif text-[80px] text-[#F0EBE3] leading-[0.8]">
                    "
                  </span>
                </div>

                {/* Quote Text */}
                <p className="font-serif italic text-[18px] md:text-[20px] text-[#1C1917] leading-[1.7] mt-[20px]">
                  {t.quote}
                </p>

                {/* Separator */}
                <div className="w-[40px] h-[1px] bg-[#E8DFD0] mt-[28px] mb-[20px]" />

                {/* Bottom Row: Avatar and Name */}
                <div className="flex items-center gap-[12px] mt-auto">
                  <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#C4714A] to-[#E8DFD0] flex items-center justify-center text-white font-serif text-[18px]">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[14px] text-[#1C1917]">
                      {t.name}
                    </span>
                    <span className="font-sans text-[12px] text-[#6B6560]">
                      {t.purchase}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const footerLinks = {
  Shop: ["New Arrivals", "Men", "Women", "Collections", "Sale"],
  Help: ["Size Guide", "Shipping Info", "Returns", "Track Order", "Contact Us"],
  Company: ["Our Story", "Craftsmanship", "Sustainability", "Careers", "Press"],
};

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="w-full bg-[#141210] relative overflow-hidden text-[#FAF8F4]">
      {/* Glowing Top Divider Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C4714A] to-transparent shadow-[0_0_10px_rgba(196,113,74,0.3)]" />

      {/* Top Footer Block */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-[1300px] mx-auto px-6 lg:px-10 py-[60px] md:py-[80px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-[60px]">
          
          {/* Column 1 — Brand Block */}
          <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-2">
            <h2 className="font-serif italic text-[32px] leading-none mb-3">Soleil</h2>
            <p className="font-sans font-light text-[14px] text-white/45 max-w-[220px] leading-relaxed">
              Handcrafted footwear for the ones who move with intention.
            </p>
            <div className="flex gap-4 mt-8">
              {[
                { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { name: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: "Twitter", path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                { name: "Pinterest", path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.718-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C24.02 5.367 18.624 0 12.017 0z" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[38px] h-[38px] rounded-full bg-white/5 flex items-center justify-center text-white/55 hover:bg-[#C4714A]/25 hover:text-[#C4714A] transition-all duration-200"
                  aria-label={social.name}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Desktop/Tablet Link Columns & Mobile Accordions */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div key={title} variants={itemVariants} className="flex flex-col">
              {/* Desktop Header */}
              <h3 className="hidden md:block font-sans font-medium text-[11px] uppercase tracking-[0.15em] text-white/35 mb-6">
                {title}
              </h3>

              {/* Mobile Accordion Header */}
              <button 
                onClick={() => toggleAccordion(title)}
                className="md:hidden flex items-center justify-between py-4 border-b border-white/5 w-full text-left"
              >
                <span className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-white/60">
                  {title}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-white/30 transition-transform duration-300 ${openAccordion === title ? "rotate-180" : ""}`} 
                />
              </button>

              {/* Links - Desktop (Visible) & Mobile (Accordion) */}
              <div className="hidden md:flex flex-col gap-3.5">
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-sans font-light text-[14px] text-white/55 hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    {link}
                  </a>
                ))}
              </div>

              <AnimatePresence>
                {openAccordion === title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden overflow-hidden flex flex-col gap-3.5 pt-4 pb-2"
                  >
                    {links.map((link) => (
                      <a
                        key={link}
                        href="#"
                        className="font-sans font-light text-[14px] text-white/50"
                      >
                        {link}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Footer Block */}
      <div className="border-t border-white/5">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-7 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-sans text-white/25">
          <span className="order-2 md:order-1">© 2025 Soleil. All rights reserved.</span>
          <span className="order-1 md:order-2 hidden md:block">Made with care.</span>
          <div className="flex gap-6 order-3">
            <a href="#" className="hover:text-white/60 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

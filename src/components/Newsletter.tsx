"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    setStatus("success");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full bg-[#1C1917] py-[80px] md:py-[120px] px-6 relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-[150px] md:text-[200px] lg:text-[280px] text-white/[0.03] select-none pointer-events-none z-0 whitespace-nowrap tracking-wider">
        SOLEIL
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[240px] h-[240px] md:w-[400px] md:h-[400px] bg-[#C4714A] opacity-[0.08] blur-[80px] md:blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[180px] h-[180px] md:w-[300px] md:h-[300px] bg-[#C9A96E] opacity-[0.06] blur-[80px] md:blur-[120px] rounded-full z-0 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-[680px] mx-auto text-center flex flex-col items-center"
      >
        <motion.span variants={itemVariants} className="font-sans text-[11px] tracking-[0.2em] text-[#C4714A] uppercase">
          STAY IN THE LOOP
        </motion.span>
        
        <motion.div variants={itemVariants} className="w-[40px] h-[1px] bg-[#C4714A] my-6" />

        <motion.h2 variants={itemVariants} className="font-serif italic font-light text-[36px] md:text-[52px] lg:text-[68px] text-[#FAF8F4] leading-[1.15]">
          Step into something new.
        </motion.h2>

        <motion.p variants={itemVariants} className="font-sans font-light text-[15px] text-white/55 mt-4 max-w-[500px]">
          New arrivals, exclusive drops, and stories from our craftsmen — delivered to your inbox.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full max-w-[480px] mt-12 overflow-hidden">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-[#C9A96E] font-sans text-[15px] py-4"
              >
                <span className="text-xl">✓</span>
                <span>Thank you! You are on the list.</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubscribe}
                className="flex flex-col md:flex-row w-full gap-2.5 md:gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={`flex-1 h-[52px] bg-white/[0.07] border ${
                    status === "error" ? "border-red-500/60" : "border-white/12"
                  } rounded-[6px] md:rounded-r-none px-5 text-white font-sans text-[14px] placeholder:text-white/35 focus:outline-none focus:bg-white/10 focus:border-white/40 transition-all duration-200`}
                />
                <button
                  type="submit"
                  className="h-[52px] px-8 bg-[#C4714A] text-white font-sans font-medium text-[14px] rounded-[6px] md:rounded-l-none hover:bg-[#A85432] transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p variants={itemVariants} className="font-sans text-[11px] text-white/30 mt-4">
          No spam. Unsubscribe anytime.
        </motion.p>
      </motion.div>
    </section>
  );
}

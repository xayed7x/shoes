"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger glassmorphism early to prevent text mixing
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const colorClass = isScrolled ? "text-white" : "text-[#1C1917]";

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-6 px-4"
    >
      <motion.nav
        animate={{ 
          backgroundColor: isScrolled ? "rgba(28, 25, 23, 0.85)" : "rgba(255, 255, 255, 0)",
          backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
          width: isScrolled ? "95%" : "100%",
          maxWidth: isScrolled ? "1200px" : "100%",
          borderRadius: isScrolled ? "full" : "0px",
          paddingLeft: isScrolled ? "2rem" : "1.5rem",
          paddingRight: isScrolled ? "2rem" : "1.5rem",
          boxShadow: isScrolled ? "0 10px 30px -10px rgba(0,0,0,0.3)" : "none",
        }}
        className="flex items-center justify-between py-4 transition-all duration-300 pointer-events-auto"
      >
        <div className={`container mx-auto flex justify-between items-center ${colorClass} transition-colors duration-300`}>
        {/* Mobile Hamburger (Left on mobile, hidden on desktop) */}
        <div className="md:hidden flex-1">
          <button aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <a href="#" className="font-serif italic text-2xl md:text-3xl tracking-wide">
            Soleil
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-4 uppercase tracking-widest text-[10px] font-medium">
          <a href="#" className="relative group hover-underline">New Arrivals
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
          </a>
          <span className="opacity-50">·</span>
          <a href="#" className="relative group hover-underline">Men
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
          </a>
          <span className="opacity-50">·</span>
          <a href="#" className="relative group hover-underline">Women
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
          </a>
          <span className="opacity-50">·</span>
          <a href="#" className="relative group hover-underline">Collections
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* Right Icons */}
        <div className="flex-1 flex justify-end items-center space-x-5">
          <button aria-label="Search" className="hover:opacity-70 transition-opacity">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Cart" className="relative hover:opacity-70 transition-opacity">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C4714A] text-white text-[9px] flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}

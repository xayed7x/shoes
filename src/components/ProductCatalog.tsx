"use client";

import { motion } from "framer-motion";

const productImages = [
  "/shoes/product/480383662_1147458480167769_2392007550659441899_n.jpg",
  "/shoes/product/480490895_1147459730167644_3361511235236542329_n.jpg",
  "/shoes/product/480801721_1149690763277874_2167286252556262456_n.jpg",
  "/shoes/product/482238404_1164274838486133_4090109660956154855_n.jpg",
  "/shoes/product/482240674_1164295378484079_2931510351944337096_n.jpg",
  "/shoes/product/484245633_1164534915126792_2910951491357068176_n.jpg"
];

const catalogData = [
  { name: "The Artisan", price: "৳4,900", bestseller: true },
  { name: "Night Walker", price: "৳5,900", bestseller: false },
  { name: "Terra Step", price: "৳6,900", bestseller: false },
  { name: "Sage Drift", price: "৳5,500", bestseller: false },
  { name: "Cloud Nine", price: "৳6,500", bestseller: false },
  { name: "The Classic", price: "৳4,500", bestseller: true },
  { name: "Ember Walk", price: "৳7,200", bestseller: false },
  { name: "Soft Ground", price: "৳5,800", bestseller: false },
  { name: "The Wanderer", price: "৳6,300", bestseller: false },
  { name: "Dusk Runner", price: "৳5,100", bestseller: false },
  { name: "Stone Path", price: "৳6,700", bestseller: true },
  { name: "Morning Ease", price: "৳4,800", bestseller: false },
].map((item, i) => ({
  ...item,
  id: i + 1,
  image: productImages[i % productImages.length],
  description: "Premium comfort and minimal design."
}));

export default function ProductCatalog() {
  return (
    <section className="w-full bg-[#FAF8F4] py-[60px] lg:py-[100px] px-5 lg:px-0">
      <div className="max-w-[1300px] mx-auto flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center mb-[60px]">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
            CATALOG
          </span>
          <h2 className="font-serif italic font-light text-5xl md:text-[64px] text-[#1C1917] leading-tight md:leading-none text-center">
            All Products
          </h2>
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-6 md:mt-[30px]" />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px] md:gap-[20px] lg:gap-[24px]">
          {catalogData.map((product, index) => {
            // Cap the stagger delay at 0.25s for mobile, 0.3s for desktop
            const delay = Math.min(index * 0.05, 0.3);
            const mobileDelay = Math.min(index * 0.05, 0.25);

            return (
              <div key={product.id} className="contents relative">
                {/* Desktop / Tablet Card (Vertical) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay }}
                  className="hidden md:flex flex-col bg-white border border-[#E8DFD0] rounded-[16px] overflow-hidden group hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out"
                >
                  <div className="w-full h-[240px] bg-[#F5F0E8] flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-[200px] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-400 ease-out" 
                    />
                  </div>
                  <div className="pt-5 px-5">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#6B6560]">
                        SOLEIL
                      </span>
                      {product.bestseller && (
                        <span className="bg-[#FFF0E8] text-[#C4714A] font-sans text-[9px] px-2 py-[3px] rounded-[20px] font-bold">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-[22px] text-[#1C1917] mt-[6px]">
                      {product.name}
                    </h3>
                    <p className="font-sans text-[13px] text-[#6B6560] mt-1 truncate">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-4 px-5 py-4 border-t border-[#F0EBE3] flex items-center justify-between">
                    <span className="font-serif font-semibold text-[24px] text-[#1C1917]">
                      {product.price}
                    </span>
                    <button className="font-sans text-[12px] text-[#1C1917] border border-[#E8DFD0] bg-transparent px-4 py-2 rounded-[4px] hover:bg-[#1C1917] hover:text-white hover:border-[#1C1917] transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>

                {/* Mobile Grid Card (2-column Vertical) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: mobileDelay }}
                  className="md:hidden flex flex-col bg-white border border-[#E8DFD0] rounded-[12px] overflow-hidden active:border-[#C4714A] transition-colors duration-200"
                >
                  <div className="relative w-full h-[160px] bg-[#F5F0E8] flex items-center justify-center">
                    {product.bestseller && (
                      <span className="absolute top-3 left-3 bg-[#C4714A] text-white font-sans text-[8px] uppercase tracking-wider px-2 py-[3px] rounded-full font-bold z-10">
                        BESTSELLER
                      </span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-[130px] max-w-[85%] object-contain" 
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-serif font-semibold text-[16px] text-[#1C1917] leading-tight truncate">
                      {product.name}
                    </h3>
                    <p className="font-sans text-[11px] text-[#6B6560] mt-0.5 truncate">
                      {product.description}
                    </p>
                    <span className="font-serif font-semibold text-[18px] text-[#1C1917] mt-2">
                      {product.price}
                    </span>
                    <button className="w-full mt-2 bg-[#1C1917] text-white font-sans text-[11px] py-2 rounded-[6px] text-center border-none">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

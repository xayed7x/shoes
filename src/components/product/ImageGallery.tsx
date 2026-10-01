"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no images
  const displayImages = images.length > 0 ? images : ["/shoes/shoe-1.png"];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] md:aspect-square bg-[#FAF8F4] rounded-[24px] overflow-hidden flex items-center justify-center border border-[#E8DFD0]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            {displayImages[currentIndex].startsWith("http") ? (
              <Image
                src={displayImages[currentIndex]}
                alt={`${productName} view ${currentIndex + 1}`}
                fill
                className="object-contain p-8 md:p-12 drop-shadow-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImages[currentIndex]}
                alt={`${productName} view ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain p-8 md:p-12 drop-shadow-xl"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (only show if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8DFD0] flex items-center justify-center text-[#1C1917] hover:bg-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8DFD0] flex items-center justify-center text-[#1C1917] hover:bg-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-[80px] h-[80px] rounded-[12px] bg-[#FAF8F4] border transition-all duration-200 overflow-hidden ${
                currentIndex === idx
                  ? "border-[#1C1917] ring-1 ring-[#1C1917] opacity-100"
                  : "border-[#E8DFD0] opacity-60 hover:opacity-100"
              }`}
            >
              {src.startsWith("http") ? (
                <Image
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

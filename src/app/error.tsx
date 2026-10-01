"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-5 text-center">
      <AlertTriangle className="w-16 h-16 text-[#C4714A] mb-6" strokeWidth={1} />
      <h1 className="font-serif italic font-light text-5xl md:text-[64px] text-[#1C1917] leading-tight mb-4">
        Something went wrong
      </h1>
      <p className="font-sans text-[15px] text-[#6B6560] max-w-md mx-auto mb-8 leading-relaxed">
        We apologize for the inconvenience. An unexpected error occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#1C1917] bg-transparent border border-[#1C1917] px-8 py-4 rounded-[8px] hover:bg-[#1C1917] hover:text-[#FAF8F4] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#FAF8F4] bg-[#1C1917] px-8 py-4 rounded-[8px] hover:bg-[#C4714A] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

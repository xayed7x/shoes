import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-5 text-center">
      <SearchX className="w-16 h-16 text-[#C4714A] mb-6" strokeWidth={1} />
      <h1 className="font-serif italic font-light text-5xl md:text-[64px] text-[#1C1917] leading-tight mb-4">
        Page Not Found
      </h1>
      <p className="font-sans text-[15px] text-[#6B6560] max-w-md mx-auto mb-8 leading-relaxed">
        We couldn&apos;t find the page you were looking for. It might have been moved, or it simply doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#FAF8F4] bg-[#1C1917] px-8 py-4 rounded-[8px] hover:bg-[#C4714A] transition-colors"
      >
        Return Home
      </Link>
    </main>
  );
}

import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 lg:px-0">
      <div className="max-w-[1200px] mx-auto">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="w-48 h-8 bg-[#E8DFD0] rounded" />
          <div className="w-64 h-4 bg-[#E8DFD0] rounded" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

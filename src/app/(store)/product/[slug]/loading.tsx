import { ProductGallerySkeleton, ProductInfoSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 lg:px-0">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery skeleton */}
          <div>
            <ProductGallerySkeleton />
          </div>

          {/* Info skeleton */}
          <div>
            <ProductInfoSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

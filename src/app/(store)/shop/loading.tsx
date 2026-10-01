// Loading skeleton for Shop page matching horizontal bottom bar ProductCard
export default function ShopLoading() {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[140px] md:pt-[160px] pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col">
        {/* Header Skeleton */}
        <div className="flex flex-col mb-8 md:mb-10 animate-pulse">
          <div className="w-24 h-3 bg-[#E8DFD0] rounded mb-3" />
          <div className="w-64 h-12 md:h-16 bg-[#E8DFD0] rounded mb-4" />
          <div className="w-[60px] h-[2px] bg-[#C4714A] mt-4" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-10 pb-6 border-b border-[#E8DFD0] flex gap-3 animate-pulse overflow-hidden">
          <div className="w-16 h-8 bg-[#E8DFD0] rounded-full flex-shrink-0" />
          <div className="w-28 h-8 bg-[#E8DFD0] rounded-full flex-shrink-0" />
          <div className="w-24 h-8 bg-[#E8DFD0] rounded-full flex-shrink-0" />
          <div className="w-24 h-8 bg-[#E8DFD0] rounded-full flex-shrink-0" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 items-start">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-full bg-white border border-[#E8DFD0] rounded-2xl p-2.5 sm:p-3 animate-pulse shadow-xs"
            >
              <div className="w-full aspect-[4/3] rounded-xl bg-[#E8DFD0]" />
              <div className="pt-3 px-1 flex items-center justify-between gap-2.5 mt-auto">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="w-3/4 h-4 bg-[#E8DFD0] rounded" />
                  <div className="w-1/2 h-3.5 bg-[#E8DFD0] rounded" />
                </div>
                <div className="hidden sm:block w-14 h-7 rounded-lg bg-[#E8DFD0] flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Categories() {
  const categories = ["All", "Women", "Men", "Shoes", "Collections"];

  return (
    <section className="md:hidden w-full bg-transparent text-[#1C1917] pt-6 pb-8 px-5">
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <button className="text-sm text-[#1C1917]/50 hover:text-[#1C1917] transition-colors">See all</button>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              idx === 0 
                ? "bg-[#1C1917] text-white border-[#1C1917]" 
                : "bg-transparent text-[#1C1917]/70 border-[#1C1917]/20 hover:border-[#1C1917]/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}

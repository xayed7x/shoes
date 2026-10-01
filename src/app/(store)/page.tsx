import HeroSection from "@/components/HeroSection";
import CollectionHeading from "@/components/CollectionHeading";
import Categories from "@/components/Categories";
import ProductStrip from "@/components/ProductStrip";
import ProductShowcase from "@/components/ProductShowcase";
import ProductCatalog from "@/components/ProductCatalog";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <HeroSection />
      {/* Desktop-only heading row between hero and marquee */}
      <div className="hidden md:block">
        <CollectionHeading />
      </div>
      <Categories categories={categories} />
      <ProductStrip products={products} />
      <ProductShowcase products={products} />
      <ProductCatalog products={products} />
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}

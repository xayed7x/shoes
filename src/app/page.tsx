import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import ProductStrip from "@/components/ProductStrip";
import ProductShowcase from "@/components/ProductShowcase";
import ProductCatalog from "@/components/ProductCatalog";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <HeroSection />
      <Categories />
      <div className="bg-[#F5F0E8] pb-10 md:pb-0">
        <ProductStrip />
      </div>
      <ProductShowcase />
      <ProductCatalog />
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}

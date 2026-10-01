/**
 * MobileHero — Server Component
 * Fetches prices for all hero slides (same as DesktopHero) and passes
 * them to MobileHeroClient. Rendered only on small screens (md:hidden).
 */
import { heroSlides } from "@/data/heroSlides";
import { getProductBySlug } from "@/lib/data/products";
import MobileHeroClient from "./MobileHeroClient";

export default async function MobileHero() {
  const products = await Promise.all(
    heroSlides.map((s) => getProductBySlug(s.productSlug))
  );

  const prices: Record<string, number | null> = {};
  heroSlides.forEach((slide, idx) => {
    const product = products[idx];
    prices[slide.productSlug] = product ? product.price : null;
  });

  return <MobileHeroClient prices={prices} />;
}

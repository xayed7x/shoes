/**
 * DesktopHero — Server Component
 * Fetches prices for all hero slides and passes them to the client component.
 * This file must NOT be marked "use client".
 */
import { heroSlides } from "@/data/heroSlides";
import { getProductBySlug } from "@/lib/data/products";
import DesktopHeroClient from "./DesktopHeroClient";

export default async function DesktopHero() {
  // Fetch all 4 products in parallel; gracefully handle missing products
  const products = await Promise.all(
    heroSlides.map((s) => getProductBySlug(s.productSlug))
  );

  const prices: Record<string, number | null> = {};
  heroSlides.forEach((slide, idx) => {
    const product = products[idx];
    prices[slide.productSlug] = product ? product.price : null;
  });

  return <DesktopHeroClient prices={prices} />;
}

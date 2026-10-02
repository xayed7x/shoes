import { getProductBySlug, getProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ImageGallery from "@/components/product/ImageGallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import Price from "@/components/ui/Price";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts({ limit: 50 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Premium Export Shoes" };
  return {
    title: `${product.name} | Premium Export Shoes`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Premium Export Shoes`,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await getProducts({ limit: 10 });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[130px] md:pt-[150px] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6 lg:pt-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.is_new && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-[#C4714A] text-white">
                  New
                </span>
              )}
              {product.is_handcrafted && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-[#1C1917]/20 text-[#1C1917]/70">
                  Handcrafted
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif italic text-4xl lg:text-5xl text-[#1C1917] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-[#1C1917]">
                <Price amount={product.price} />
              </span>
              {product.compare_at_price &&
                product.compare_at_price > product.price && (
                  <span className="text-[#6B6560] line-through text-base">
                    <Price
                      amount={product.compare_at_price}
                      muted
                      strikethrough
                    />
                  </span>
                )}
            </div>

            {/* Description */}
            <p className="text-[#6B6560] leading-relaxed text-[15px]">
              {product.description}
            </p>

            {/* Material */}
            {product.material && (
              <div className="text-[13px] text-[#6B6560]">
                <span className="font-semibold text-[#1C1917]">Material: </span>
                {product.material}
              </div>
            )}

            {/* Add to Cart */}
            {product.variants && product.variants.length > 0 && (
              <AddToCartButton product={product} />
            )}

            {/* Care Instructions */}
            {product.care_instructions && (
              <div className="border-t border-[#1C1917]/10 pt-5">
                <p className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#1C1917]/50 mb-2">
                  Care
                </p>
                <p className="text-[14px] text-[#6B6560]">
                  {product.care_instructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-[#1C1917]/10">
            <div className="flex flex-col items-center mb-8 md:mb-12">
              <span className="font-sans text-[11px] tracking-[0.2em] text-[#6B6560] uppercase mb-2">
                COLLECTION
              </span>
              <h2 className="font-serif italic font-light text-3xl sm:text-4xl md:text-5xl text-[#1C1917] text-center">
                Related Products
              </h2>
              <div className="w-[50px] h-[2px] bg-[#C4714A] mt-4" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 items-start">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

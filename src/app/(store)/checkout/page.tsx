import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Premium Export Shoes",
  description: "Complete your purchase securely.",
};

export interface StoreSettings {
  shipping_fee_inside_dhaka: number;
  shipping_fee_outside_dhaka: number;
  bkash_number?: string;
  nagad_number?: string;
}

export default async function CheckoutPage() {
  const supabase = await createClient();

  let settings: StoreSettings = {
    shipping_fee_inside_dhaka: 60,
    shipping_fee_outside_dhaka: 120,
    bkash_number: "01700000000",
    nagad_number: "01700000001",
  };

  if (supabase) {
    const { data } = await supabase
      .from("store_settings")
      .select("shipping_fee_inside_dhaka, shipping_fee_outside_dhaka") // assuming bkash/nagad numbers aren't in schema yet, fallback to hardcode or maybe we add them
      .single();

    if (data) {
      settings = {
        ...settings,
        shipping_fee_inside_dhaka: Number(data.shipping_fee_inside_dhaka),
        shipping_fee_outside_dhaka: Number(data.shipping_fee_outside_dhaka),
      };
    }
  }

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 lg:px-0">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif italic font-light text-4xl md:text-[48px] text-[#1C1917] leading-tight mb-8">
          Checkout
        </h1>
        <CheckoutForm settings={settings} />
      </div>
    </main>
  );
}

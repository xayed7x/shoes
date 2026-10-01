"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validation/checkout";
import { BD_DISTRICTS } from "@/lib/data/districts";
import { useCartStore } from "@/store/cartStore";
import { submitCheckout } from "@/app/actions/checkout";
import { StoreSettings } from "@/app/(store)/checkout/page";
import { formatBDT } from "@/lib/utils";
import Price from "@/components/ui/Price";

export default function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const cart = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      addressLine: "",
      area: "",
      district: "Dhaka",
      deliveryZone: "inside_dhaka",
      paymentMethod: "cod",
      paymentReference: "",
      notes: "",
      botField: "",
      items: [],
    },
  });

  const { watch, handleSubmit, formState: { errors }, setValue } = form;
  const deliveryZone = watch("deliveryZone");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (cart._hasHydrated && cart.items.length === 0) {
      router.push("/shop");
    }
    if (cart._hasHydrated && cart.items.length > 0) {
      setValue(
        "items",
        cart.items.map((i) => ({ variantId: i.variant.id, quantity: i.quantity }))
      );
    }
  }, [cart._hasHydrated, cart.items, router, setValue]);

  const shippingFee =
    deliveryZone === "inside_dhaka"
      ? settings.shipping_fee_inside_dhaka
      : settings.shipping_fee_outside_dhaka;

  const subtotal = cart.subtotal();
  const total = subtotal + shippingFee;

  const onSubmit = (data: CheckoutFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitCheckout(data);
      if (result.ok) {
        cart.clearCart();
        router.push(`/order-confirmation/${result.orderNumber}?token=${result.token}`);
      } else {
        setServerError(result.message);
      }
    });
  };

  if (!cart._hasHydrated || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#6B6560] font-sans">
        <p>Your cart is empty.</p>
        <button onClick={() => router.push("/shop")} className="mt-4 underline hover:text-[#1C1917]">
          Return to Shop
        </button>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-[#E8DFD0] rounded-[8px] px-4 py-3 font-sans text-[14px] text-[#1C1917] placeholder:text-[#A8A29D] focus:outline-none focus:border-[#C4714A] transition-colors";
  const labelClass = "block font-sans text-[11px] uppercase tracking-[0.1em] text-[#6B6560] mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
      {/* Left Column: Form */}
      <div className="w-full lg:w-2/3 flex flex-col gap-10">
        
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-[8px] font-sans text-[14px]">
            {serverError}
          </div>
        )}

        {/* Hidden Honeypot */}
        <input type="text" {...form.register("botField")} className="hidden" tabIndex={-1} autoComplete="off" />

        {/* 1. Contact Information */}
        <section>
          <h2 className="font-serif text-[24px] text-[#1C1917] mb-6 border-b border-[#E8DFD0] pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" {...form.register("fullName")} className={inputClass} placeholder="Jane Doe" />
              {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input type="tel" {...form.register("phone")} className={inputClass} placeholder="01XXXXXXXXX" />
              {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Email Address (Optional)</label>
              <input type="email" {...form.register("email")} className={inputClass} placeholder="jane@example.com" />
              {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
            </div>
          </div>
        </section>

        {/* 2. Delivery Address */}
        <section>
          <h2 className="font-serif text-[24px] text-[#1C1917] mb-6 border-b border-[#E8DFD0] pb-2">Delivery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line *</label>
              <input type="text" {...form.register("addressLine")} className={inputClass} placeholder="House 12, Road 5, Block C" />
              {errors.addressLine && <p className="text-red-500 text-[12px] mt-1">{errors.addressLine.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Area / Thana *</label>
              <input type="text" {...form.register("area")} className={inputClass} placeholder="Gulshan" />
              {errors.area && <p className="text-red-500 text-[12px] mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className={labelClass}>District *</label>
              <select {...form.register("district")} className={inputClass}>
                {BD_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.district && <p className="text-red-500 text-[12px] mt-1">{errors.district.message}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DFD0] rounded-[8px] flex-1 hover:border-[#C4714A] transition-colors has-[:checked]:border-[#C4714A] has-[:checked]:bg-white">
              <input type="radio" value="inside_dhaka" {...form.register("deliveryZone")} className="accent-[#C4714A] w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-sans text-[14px] font-medium text-[#1C1917]">Inside Dhaka</span>
                <span className="font-sans text-[12px] text-[#6B6560]"><Price amount={settings.shipping_fee_inside_dhaka} muted /></span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DFD0] rounded-[8px] flex-1 hover:border-[#C4714A] transition-colors has-[:checked]:border-[#C4714A] has-[:checked]:bg-white">
              <input type="radio" value="outside_dhaka" {...form.register("deliveryZone")} className="accent-[#C4714A] w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-sans text-[14px] font-medium text-[#1C1917]">Outside Dhaka</span>
                <span className="font-sans text-[12px] text-[#6B6560]"><Price amount={settings.shipping_fee_outside_dhaka} muted /></span>
              </div>
            </label>
          </div>
          {errors.deliveryZone && <p className="text-red-500 text-[12px] mt-1">{errors.deliveryZone.message}</p>}
        </section>

        {/* 3. Payment Method */}
        <section>
          <h2 className="font-serif text-[24px] text-[#1C1917] mb-6 border-b border-[#E8DFD0] pb-2">Payment Method</h2>
          <div className="flex flex-col gap-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DFD0] rounded-[8px] hover:border-[#C4714A] transition-colors has-[:checked]:border-[#C4714A] has-[:checked]:bg-white">
              <input type="radio" value="cod" {...form.register("paymentMethod")} className="accent-[#C4714A] w-4 h-4" />
              <span className="font-sans text-[14px] font-medium text-[#1C1917]">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DFD0] rounded-[8px] hover:border-[#C4714A] transition-colors has-[:checked]:border-[#C4714A] has-[:checked]:bg-white">
              <input type="radio" value="bkash" {...form.register("paymentMethod")} className="accent-[#C4714A] w-4 h-4" />
              <span className="font-sans text-[14px] font-medium text-[#1C1917]">bKash Manual</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DFD0] rounded-[8px] hover:border-[#C4714A] transition-colors has-[:checked]:border-[#C4714A] has-[:checked]:bg-white">
              <input type="radio" value="nagad" {...form.register("paymentMethod")} className="accent-[#C4714A] w-4 h-4" />
              <span className="font-sans text-[14px] font-medium text-[#1C1917]">Nagad Manual</span>
            </label>
          </div>

          {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
            <div className="bg-[#FAF8F4] border border-[#E8DFD0] p-5 rounded-[8px] flex flex-col gap-4">
              <p className="font-sans text-[13px] text-[#6B6560] leading-relaxed">
                Please Send Money (Personal) to the following {paymentMethod === "bkash" ? "bKash" : "Nagad"} number:
                <br />
                <strong className="text-[#1C1917] text-[16px] mt-1 block">
                  {paymentMethod === "bkash" ? settings.bkash_number : settings.nagad_number}
                </strong>
              </p>
              <div>
                <label className={labelClass}>Transaction ID *</label>
                <input type="text" {...form.register("paymentReference")} className={inputClass} placeholder="e.g. 9X3D... or Phone Number" />
                {errors.paymentReference && <p className="text-red-500 text-[12px] mt-1">{errors.paymentReference.message}</p>}
              </div>
            </div>
          )}
        </section>

        {/* 4. Notes */}
        <section>
          <label className={labelClass}>Order Notes (Optional)</label>
          <textarea {...form.register("notes")} className={`${inputClass} resize-none h-24`} placeholder="Any special instructions?" />
        </section>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#1C1917] text-[#FAF8F4] py-4 rounded-[8px] font-sans text-[13px] uppercase tracking-[0.15em] font-semibold hover:bg-[#C4714A] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? "Processing..." : `Place Order - ${formatBDT(total)}`}
        </button>
      </div>

      {/* Right Column: Sticky Summary */}
      <div className="w-full lg:w-1/3 sticky top-[100px] bg-white border border-[#E8DFD0] rounded-[16px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h2 className="font-serif text-[20px] text-[#1C1917] mb-6">Order Summary</h2>
        
        <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
          {cart.items.map((item) => (
            <div key={item.variant.id} className="flex gap-4">
              <div className="w-[60px] h-[80px] bg-[#F5F0E8] rounded relative overflow-hidden flex-shrink-0">
                {item.product.images[0] && (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="60px" />
                )}
              </div>
              <div className="flex flex-col flex-grow justify-center">
                <span className="font-sans text-[13px] text-[#1C1917] font-medium">{item.product.name}</span>
                <span className="font-sans text-[12px] text-[#6B6560]">
                  Size: {item.variant.size} | Color: {item.variant.color}
                </span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-sans text-[12px] text-[#6B6560]">Qty: {item.quantity}</span>
                  <span className="font-sans text-[13px] text-[#1C1917] font-medium">
                    <Price amount={(item.variant.price_override || item.product.price) * item.quantity} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E8DFD0] pt-4 flex flex-col gap-3 font-sans text-[13px]">
          <div className="flex justify-between text-[#6B6560]">
            <span>Subtotal</span>
            <span><Price amount={subtotal} muted /></span>
          </div>
          <div className="flex justify-between text-[#6B6560]">
            <span>Shipping</span>
            <span><Price amount={shippingFee} muted /></span>
          </div>
          <div className="border-t border-[#E8DFD0] pt-4 flex justify-between items-center mt-1">
            <span className="font-medium text-[16px] text-[#1C1917]">Total</span>
            <span className="font-medium text-[16px] text-[#1C1917]"><Price amount={total} /></span>
          </div>
        </div>
      </div>
    </form>
  );
}

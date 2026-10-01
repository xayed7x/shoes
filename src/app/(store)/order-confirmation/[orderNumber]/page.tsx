import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatBDT } from "@/lib/utils";
import Price from "@/components/ui/Price";import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Soleil",
  robots: "noindex, nofollow",
};

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const supabase = createAdminClient();
  if (!supabase) {
    // Local demo fallback if no DB connection
    return (
      <main className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-[#C4714A] mb-6" />
        <h1 className="font-serif text-3xl mb-4 text-[#1C1917]">Demo Mode Active</h1>
        <p className="font-sans text-[#6B6560] max-w-md mx-auto mb-8">
          The database is not connected. Your order ({orderNumber}) was processed locally for demo purposes.
        </p>
        <Link href="/" className="font-sans text-[12px] uppercase tracking-[0.15em] bg-[#1C1917] text-white px-8 py-4 rounded-[8px] hover:bg-[#C4714A]">
          Back to Home
        </Link>
      </main>
    );
  }

  // Fetch order matching number AND token to prevent unauthorized access
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("order_number", orderNumber)
    .eq("access_token", token)
    .single();

  if (error || !order) {
    notFound();
  }

  const isManualPayment = order.payment_method === "bkash" || order.payment_method === "nagad";
  const address = order.shipping_address as { address_line1: string; area: string; city: string };

  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 lg:px-0 font-sans">
      <div className="max-w-[700px] mx-auto bg-white border border-[#E8DFD0] rounded-[16px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        
        {/* Header Status */}
        <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-[#E8DFD0]">
          <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" strokeWidth={1.5} />
          <h1 className="font-serif italic font-light text-4xl text-[#1C1917] mb-3">
            Thank you for your order!
          </h1>
          <p className="text-[14px] text-[#6B6560]">
            Order <strong className="text-[#1C1917] font-medium">{order.order_number}</strong> has been received.
          </p>
          <p className="text-[14px] text-[#6B6560] mt-1">
            We&apos;ve sent a confirmation email to {order.customer_email || "your email address"}.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="mb-10 bg-[#F9F7F3] rounded-[8px] p-6 border border-[#E8DFD0]">
          <h2 className="font-serif text-[18px] text-[#1C1917] mb-3">What happens next?</h2>
          <p className="text-[13px] text-[#6B6560] leading-relaxed">
            {isManualPayment 
              ? `Your ${order.payment_method === "bkash" ? "bKash" : "Nagad"} payment verification is currently pending. Once our team verifies the Transaction ID (${order.payment_reference}), your order status will be updated to Processing. We will process your shipment within 2-3 business days.`
              : "Your order is now being processed. You will receive an SMS/Email update once it has been shipped."}
          </p>
          <div className="mt-4 pt-4 border-t border-[#E8DFD0]/50">
            <Link href="/track" className="text-[13px] text-[#C4714A] font-medium hover:underline">
              Track your order status →
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-3">Delivery Address</h3>
            <p className="text-[14px] text-[#1C1917] leading-relaxed">
              {order.customer_name}<br />
              {address.address_line1}<br />
              {address.area}, {address.city}
            </p>
            <p className="text-[14px] text-[#6B6560] mt-2">Ph: {order.customer_phone}</p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-3">Payment Details</h3>
            <p className="text-[14px] text-[#1C1917] capitalize">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
            </p>
            <p className="text-[14px] text-[#6B6560] capitalize mt-1">Status: {order.payment_status}</p>
            {isManualPayment && order.payment_reference && (
              <p className="text-[13px] text-[#A8A29D] mt-1">Ref: {order.payment_reference}</p>
            )}
          </div>
        </div>

        {/* Items Summary */}
        <div className="border-t border-[#E8DFD0] pt-8">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-5">Order Summary</h3>
          <div className="flex flex-col gap-4 mb-6">
            {order.order_items?.map((item: import("@/types").OrderItem) => (
              <div key={item.id} className="flex justify-between items-center text-[13px]">
                <div className="flex flex-col">
                  <span className="text-[#1C1917] font-medium">{item.product_name}</span>
                  <span className="text-[#6B6560]">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</span>
                </div>
                <span className="text-[#1C1917] font-medium"><Price amount={item.subtotal} /></span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E8DFD0] pt-4 flex flex-col gap-2 text-[13px] text-[#6B6560]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span><Price amount={order.subtotal} muted /></span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-[#C4714A]">
                <span>Discount</span>
                <span>-<Price amount={order.discount_amount} muted /></span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span><Price amount={order.shipping_fee} muted /></span>
            </div>
            <div className="border-t border-[#E8DFD0] pt-4 mt-2 flex justify-between items-center text-[16px] text-[#1C1917] font-medium">
              <span>Total</span>
              <span><Price amount={order.grand_total} /></span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="text-[12px] uppercase tracking-[0.15em] font-medium text-[#1C1917] hover:text-[#C4714A] transition-colors">
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}

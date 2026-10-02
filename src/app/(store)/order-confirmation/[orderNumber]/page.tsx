import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatBDT } from "@/lib/utils";
import Price from "@/components/ui/Price";
import { AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import OrderConfirmedModal from "@/components/shop/OrderConfirmedModal";

export const metadata: Metadata = {
  title: "Order Confirmed | Soleil",
  robots: "noindex, nofollow",
};

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Status/payment badge helpers
function statusColor(status: string) {
  switch (status) {
    case "pending":     return { bg: "#FFF7ED", text: "#C4714A", dot: "#F97316" };
    case "processing":  return { bg: "#EFF6FF", text: "#2563EB", dot: "#3B82F6" };
    case "shipped":     return { bg: "#F0FDF4", text: "#16A34A", dot: "#22C55E" };
    case "delivered":   return { bg: "#F0FDF4", text: "#15803D", dot: "#16A34A" };
    case "cancelled":   return { bg: "#FFF1F2", text: "#DC2626", dot: "#EF4444" };
    case "paid":        return { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" };
    case "failed":      return { bg: "#FFF1F2", text: "#DC2626", dot: "#EF4444" };
    default:            return { bg: "#FAF8F4", text: "#6B6560", dot: "#A8A29D" };
  }
}

function StatusPill({ label }: { label: string }) {
  const c = statusColor(label);
  return (
    <span
      style={{ background: c.bg, color: c.text }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.08em]"
    >
      <span
        style={{ background: c.dot }}
        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
      />
      {label.replace("_", " ")}
    </span>
  );
}

export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const supabase = createAdminClient();
  if (!supabase) {
    return (
      <main className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-[#C4714A] mb-6" />
        <h1 className="font-serif text-3xl mb-4 text-[#1C1917]">Demo Mode Active</h1>
        <p className="font-sans text-[#6B6560] max-w-md mx-auto mb-8">
          The database is not connected. Your order ({orderNumber}) was processed locally for demo purposes.
        </p>
        <Link
          href="/"
          className="font-sans text-[12px] uppercase tracking-[0.15em] bg-[#1C1917] text-white px-8 py-4 rounded-[8px] hover:bg-[#C4714A] transition-colors"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`*, order_items (*)`)
    .eq("order_number", orderNumber)
    .eq("access_token", token)
    .single();

  if (error || !order) notFound();

  const isManualPayment = order.payment_method === "bkash" || order.payment_method === "nagad";
  const address = order.shipping_address as { address_line1: string; area: string; city: string };

  return (
    <>
      {/* ── Order confirmed modal ── */}
      <OrderConfirmedModal
        orderNumber={order.order_number}
        items={order.order_items ?? []}
      />

      {/* ── Page-level animation styles ── */}
      <style>{`
        @keyframes oc-fadeup {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes oc-scalein {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes oc-check-draw {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes oc-ring-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(196,113,74,0.35); }
          70%  { box-shadow: 0 0 0 20px rgba(196,113,74,0); }
          100% { box-shadow: 0 0 0 0 rgba(196,113,74,0); }
        }
        .oc-fadeup { animation: oc-fadeup 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .oc-scalein { animation: oc-scalein 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .oc-delay-1 { animation-delay: 0.08s; }
        .oc-delay-2 { animation-delay: 0.18s; }
        .oc-delay-3 { animation-delay: 0.28s; }
        .oc-delay-4 { animation-delay: 0.38s; }
        .oc-ring-pulse { animation: oc-ring-pulse 2s ease-out 0.5s 2; }
        .oc-check-path {
          stroke-dasharray: 100;
          animation: oc-check-draw 0.6s ease-out 0.3s both;
        }
      `}</style>

      <main className="w-full min-h-screen bg-[#F5F0E8] pt-[100px] pb-[120px] px-5 lg:px-0 font-sans">
        <div className="max-w-[680px] mx-auto">

          {/* ── Hero confirmation banner ── */}
          <div className="oc-fadeup flex flex-col items-center text-center mb-10">
            {/* Animated check circle */}
            <div className="oc-scalein oc-ring-pulse mb-6 w-[88px] h-[88px] rounded-full bg-white border-4 border-[#C4714A]/30 flex items-center justify-center shadow-[0_8px_40px_rgba(196,113,74,0.18)]">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="20" fill="#FFF7ED" />
                <path
                  className="oc-check-path"
                  d="M13 22.5L19.5 29L31 16"
                  stroke="#C4714A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#C4714A] mb-2">
              Order Confirmed
            </p>
            <h1 className="font-serif italic font-light text-[38px] md:text-[48px] text-[#1C1917] leading-tight mb-3">
              Thank you!
            </h1>
            <p className="text-[15px] text-[#6B6560] max-w-sm">
              Order{" "}
              <span className="font-semibold text-[#1C1917] tracking-wide">
                {order.order_number}
              </span>{" "}
              has been received and is being prepared.
            </p>
          </div>

          {/* ── Main card ── */}
          <div className="oc-fadeup oc-delay-1 bg-white border border-[#E8DFD0] rounded-[20px] overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.04)]">

            {/* What happens next */}
            <div className="bg-[#FFFBF6] border-b border-[#E8DFD0] px-8 py-6">
              <h2 className="font-serif text-[17px] text-[#1C1917] mb-2">What happens next?</h2>
              <p className="text-[13px] text-[#6B6560] leading-relaxed">
                {isManualPayment
                  ? `Your ${order.payment_method === "bkash" ? "bKash" : "Nagad"} payment is pending verification. Once our team confirms the Transaction ID (${order.payment_reference}), your order will move to Processing and ship within 2–3 business days.`
                  : "Your order is now being processed. Our team will pack and ship it within 1–2 business days. You'll receive an update via SMS or email once dispatched."}
              </p>
              <Link
                href="/track"
                className="inline-block mt-3 text-[12px] font-medium text-[#C4714A] hover:underline"
              >
                Track order status →
              </Link>
            </div>

            {/* Status chips row */}
            <div className="px-8 py-5 border-b border-[#E8DFD0] flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8A29D]">Order Status</span>
                  <StatusPill label={order.order_status} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8A29D]">Payment</span>
                  <StatusPill label={order.payment_status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8A29D] block">Order Date</span>
                <span className="text-[13px] text-[#1C1917] font-medium">
                  {new Date(order.created_at).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Delivery + Payment details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-[#E8DFD0]">
              <div className="px-8 py-6 md:border-r md:border-[#E8DFD0]">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-3">
                  Delivery Address
                </h3>
                <p className="text-[14px] text-[#1C1917] leading-relaxed">
                  <strong>{order.customer_name}</strong>
                  <br />
                  {address.address_line1}
                  <br />
                  {address.area}, {address.city}
                </p>
                <p className="text-[13px] text-[#6B6560] mt-2">Ph: {order.customer_phone}</p>
                {order.customer_email && (
                  <p className="text-[13px] text-[#6B6560]">{order.customer_email}</p>
                )}
              </div>
              <div className="px-8 py-6">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-3">
                  Payment Details
                </h3>
                <p className="text-[14px] text-[#1C1917] font-medium capitalize">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : order.payment_method === "bkash"
                    ? "bKash"
                    : order.payment_method === "nagad"
                    ? "Nagad"
                    : order.payment_method}
                </p>
                <p className="text-[13px] text-[#6B6560] mt-1 capitalize">
                  Status: {order.payment_status}
                </p>
                {isManualPayment && order.payment_reference && (
                  <p className="text-[12px] text-[#A8A29D] mt-1">
                    Ref: <span className="font-mono">{order.payment_reference}</span>
                  </p>
                )}
                <p className="text-[13px] text-[#6B6560] mt-2 capitalize">
                  Zone: {order.delivery_zone?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Order items */}
            <div className="px-8 py-6 border-b border-[#E8DFD0]">
              <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-5">
                Items Ordered
              </h3>
              <div className="flex flex-col divide-y divide-[#F0EBE1]">
                {order.order_items?.map((item: import("@/types").OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 text-[13px]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1C1917] font-medium">{item.product_name}</span>
                      <span className="text-[#A8A29D] text-[12px] mt-0.5">
                        Size {item.size}
                        {item.color ? ` · ${item.color}` : ""} · Qty {item.quantity}
                      </span>
                    </div>
                    <span className="text-[#1C1917] font-medium tabular-nums">
                      <Price amount={item.subtotal} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="px-8 py-6">
              <div className="flex flex-col gap-2.5 text-[13px]">
                <div className="flex justify-between text-[#6B6560]">
                  <span>Subtotal</span>
                  <span><Price amount={order.subtotal} muted /></span>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-[#C4714A]">
                    <span>Discount</span>
                    <span>−<Price amount={order.discount_amount} muted /></span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6560]">
                  <span>Shipping</span>
                  <span><Price amount={order.shipping_fee} muted /></span>
                </div>
                <div className="border-t border-[#E8DFD0] pt-4 mt-1 flex justify-between items-center text-[16px] font-semibold text-[#1C1917]">
                  <span>Total Paid</span>
                  <span className="text-[#C4714A]"><Price amount={order.grand_total} /></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Continue Shopping CTA ── */}
          <div className="oc-fadeup oc-delay-2 mt-10 flex flex-col items-center gap-4">
            <Link
              href="/shop"
              id="continue-shopping-btn"
              className="inline-flex items-center gap-2 bg-[#1C1917] text-[#FAF8F4] px-10 py-4 rounded-[10px] font-sans text-[12px] uppercase tracking-[0.18em] font-semibold hover:bg-[#C4714A] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(196,113,74,0.3)] active:scale-[0.98]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/track"
              className="text-[12px] text-[#6B6560] hover:text-[#1C1917] transition-colors underline underline-offset-4"
            >
              Track this order
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

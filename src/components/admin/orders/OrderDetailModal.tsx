"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Package,
  Phone,
  MapPin,
  CreditCard,
  Tag,
  Truck,
  User,
  Mail,
  StickyNote,
} from "lucide-react";
import type { Order, OrderItem } from "@/types";
import { AdminBadge } from "@/components/admin/ui/Cards";

// ── Badge helpers (duplicated locally so modal is self-contained) ──────────────

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

function orderStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "pending":
      return "warning";
    case "processing":
      return "info";
    case "shipped":
      return "default";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "muted";
  }
}

function paymentStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    case "refunded":
      return "info";
    default:
      return "muted";
  }
}

function formatBDT(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function paymentMethodLabel(method: string) {
  switch (method) {
    case "cod":
      return "Cash on Delivery";
    case "bkash":
      return "bKash";
    case "nagad":
      return "Nagad";
    case "card":
      return "Card";
    default:
      return method;
  }
}

// ── Section header helper ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B95A9] mb-3">
      {children}
    </p>
  );
}

// ── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon
        className="w-3.5 h-3.5 text-[#8B95A9] flex-shrink-0 mt-0.5"
        strokeWidth={2}
      />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-[#8B95A9] block">{label}</span>
        <span className="text-[13px] text-[#E6EAF2] break-words">{value}</span>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

interface OrderDetailModalProps {
  order: Order & { order_items?: OrderItem[] };
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const address = order.shipping_address as {
    address_line1?: string;
    area?: string;
    city?: string;
  } | null;

  const items: OrderItem[] = order.order_items ?? [];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.order_number} details`}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]" />

      {/* Panel — slides up on mobile, centered on desktop */}
      <div
        className="
        relative w-full sm:max-w-[680px] bg-[#0D1424]
        rounded-t-[24px] sm:rounded-[20px]
        border border-white/08
        shadow-[0_32px_80px_rgba(0,0,0,0.5)]
        flex flex-col
        max-h-[92dvh] sm:max-h-[88vh]
        overflow-hidden
      "
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-white/06 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#C4714A]/15 flex items-center justify-center">
              <Package className="w-4 h-4 text-[#C4714A]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#8B95A9]">
                Order Details
              </p>
              <h2 className="text-[15px] font-semibold text-[#E6EAF2] font-mono tracking-wide leading-tight">
                {order.order_number}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <AdminBadge variant={orderStatusVariant(order.order_status)}>
              {order.order_status}
            </AdminBadge>
            <AdminBadge variant={paymentStatusVariant(order.payment_status)}>
              {order.payment_status}
            </AdminBadge>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-1 w-7 h-7 rounded-[8px] flex items-center justify-center text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/08 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* ── Two-column grid on md+, single col on mobile ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/06">
            {/* ── Left: Customer + Address ── */}
            <div className="px-5 sm:px-6 py-5">
              <SectionLabel>Customer</SectionLabel>
              <div className="divide-y divide-white/04">
                <InfoRow icon={User} label="Name" value={order.customer_name} />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={order.customer_phone}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={order.customer_email || null}
                />
              </div>

              <div className="mt-5">
                <SectionLabel>Delivery Address</SectionLabel>
                <div className="flex items-start gap-2.5">
                  <MapPin
                    className="w-3.5 h-3.5 text-[#8B95A9] flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-[13px] text-[#E6EAF2] leading-relaxed">
                    {address?.address_line1 && (
                      <span className="block">{address.address_line1}</span>
                    )}
                    {address?.area && address?.city && (
                      <span className="block">
                        {address.area}, {address.city}
                      </span>
                    )}
                    {!address?.address_line1 && !address?.area && (
                      <span className="text-[#8B95A9]">
                        No address on record
                      </span>
                    )}
                  </p>
                </div>

                {order.delivery_zone && (
                  <div className="flex items-center gap-2 mt-3">
                    <Truck
                      className="w-3.5 h-3.5 text-[#8B95A9]"
                      strokeWidth={2}
                    />
                    <span className="text-[12px] text-[#8B95A9] capitalize">
                      {order.delivery_zone.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div className="mt-5">
                <SectionLabel>Payment</SectionLabel>
                <div className="flex items-center gap-2.5">
                  <CreditCard
                    className="w-3.5 h-3.5 text-[#8B95A9]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] text-[#E6EAF2]">
                    {paymentMethodLabel(order.payment_method)}
                  </span>
                </div>
                {order.payment_reference && (
                  <div className="flex items-center gap-2.5 mt-2">
                    <Tag
                      className="w-3.5 h-3.5 text-[#8B95A9]"
                      strokeWidth={2}
                    />
                    <span className="text-[12px] text-[#8B95A9]">
                      Ref:{" "}
                      <span className="font-mono text-[#E6EAF2]">
                        {order.payment_reference}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mt-5">
                  <SectionLabel>Customer Note</SectionLabel>
                  <div className="flex items-start gap-2.5">
                    <StickyNote
                      className="w-3.5 h-3.5 text-[#8B95A9] flex-shrink-0 mt-0.5"
                      strokeWidth={2}
                    />
                    <p className="text-[12px] text-[#8B95A9] italic leading-relaxed">
                      {order.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Items + Totals ── */}
            <div className="px-5 sm:px-6 py-5 flex flex-col gap-5">
              <div>
                <SectionLabel>Items Ordered ({items.length})</SectionLabel>

                {items.length === 0 ? (
                  <p className="text-[12px] text-[#8B95A9] italic">
                    Item details not available.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-white/04 rounded-[10px] px-3 py-2.5"
                      >
                        {/* Product thumbnail */}
                        {item.image_url ? (
                          <div className="w-9 h-9 rounded-[8px] bg-[#C4714A]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-[8px] bg-[#C4714A]/10 flex items-center justify-center flex-shrink-0">
                            <Package
                              className="w-4 h-4 text-[#C4714A]"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#E6EAF2] truncate">
                            {item.product_name}
                          </p>
                          <p className="text-[11px] text-[#8B95A9] mt-0.5">
                            Size {item.size}
                            {item.color ? ` · ${item.color}` : ""}
                            {" · "}Qty {item.quantity}
                          </p>
                        </div>

                        <span className="text-[13px] font-semibold text-[#E6EAF2] tabular-nums flex-shrink-0">
                          {formatBDT(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-white/06 pt-4">
                <SectionLabel>Price Breakdown</SectionLabel>
                <div className="flex flex-col gap-2 text-[13px]">
                  <div className="flex justify-between text-[#8B95A9]">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      {formatBDT(order.subtotal)}
                    </span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Discount</span>
                      <span className="tabular-nums">
                        −{formatBDT(order.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#8B95A9]">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {formatBDT(order.shipping_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-[15px] text-[#E6EAF2] border-t border-white/06 pt-3 mt-1">
                    <span>Grand Total</span>
                    <span className="text-[#C4714A] tabular-nums">
                      {formatBDT(order.grand_total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order date */}
              <div className="text-[11px] text-[#8B95A9] text-right">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-3 px-5 sm:px-6 py-4 border-t border-white/06 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[8px] text-[12px] font-semibold text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/06 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

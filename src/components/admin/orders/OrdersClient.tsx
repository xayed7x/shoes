"use client";

import { useState } from "react";
import type { Order, OrderItem } from "@/types";
import { AdminBadge } from "@/components/admin/ui/Cards";
import {
  AdminTable,
  AdminThead,
  AdminTbody,
  AdminTh,
  AdminTr,
  AdminTd,
} from "@/components/admin/ui/Table";
import OrderDetailModal from "./OrderDetailModal";
import { Eye, Package } from "lucide-react";

// ── Badge helpers ──────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "muted";

function orderStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "pending":    return "warning";
    case "processing": return "info";
    case "shipped":    return "default";
    case "delivered":  return "success";
    case "cancelled":  return "danger";
    default:           return "muted";
  }
}

function paymentStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "paid":     return "success";
    case "pending":  return "warning";
    case "failed":   return "danger";
    case "refunded": return "info";
    default:         return "muted";
  }
}

function paymentMethodLabel(method: string) {
  switch (method) {
    case "cod":   return "COD";
    case "bkash": return "bKash";
    case "nagad": return "Nagad";
    case "card":  return "Card";
    default:      return method;
  }
}

function formatBDT(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderWithItems = Order & { order_items?: OrderItem[] };

interface OrdersClientProps {
  orders: OrderWithItems[];
}

// ── Mobile card ───────────────────────────────────────────────────────────────

function MobileOrderCard({
  order,
  onClick,
}: {
  order: OrderWithItems;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[#0D1424] border border-white/06 rounded-[14px] p-4 flex flex-col gap-3 hover:border-white/12 hover:bg-white/02 transition-all active:scale-[0.99]"
    >
      {/* Row 1: Order # + Total */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[13px] font-semibold text-[#E6EAF2] tracking-wide">
            {order.order_number}
          </p>
          <p className="text-[11px] text-[#8B95A9] mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-BD", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="text-[15px] font-bold text-[#C4714A] tabular-nums flex-shrink-0">
          {formatBDT(Number(order.grand_total))}
        </span>
      </div>

      {/* Row 2: Customer */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-white/08 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-[#8B95A9] uppercase">
            {order.customer_name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-[#E6EAF2] font-medium truncate">{order.customer_name}</p>
          <p className="text-[11px] text-[#8B95A9]">{order.customer_phone}</p>
        </div>
      </div>

      {/* Row 3: Badges + View hint */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <AdminBadge variant={orderStatusVariant(order.order_status)}>
            {order.order_status}
          </AdminBadge>
          <AdminBadge variant={paymentStatusVariant(order.payment_status)}>
            {order.payment_status}
          </AdminBadge>
          <AdminBadge variant="muted">{paymentMethodLabel(order.payment_method)}</AdminBadge>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#8B95A9] flex-shrink-0">
          <Eye className="w-3 h-3" />
          <span>Details</span>
        </div>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [selected, setSelected] = useState<OrderWithItems | null>(null);

  return (
    <>
      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden md:block">
        <AdminTable>
          <AdminThead>
            <tr>
              <AdminTh>Order</AdminTh>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh align="center">Status</AdminTh>
              <AdminTh align="center">Payment</AdminTh>
              <AdminTh align="center">Method</AdminTh>
              <AdminTh align="right">Total</AdminTh>
              <AdminTh align="center">Details</AdminTh>
            </tr>
          </AdminThead>
          <AdminTbody>
            {orders.map((order) => {
              const date = new Date(order.created_at).toLocaleDateString("en-BD", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <AdminTr
                  key={order.id}
                  onClick={() => setSelected(order)}
                >
                  {/* Order number */}
                  <AdminTd>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[#E6EAF2] text-[13px] font-semibold tracking-wide">
                        {order.order_number}
                      </span>
                      {order.delivery_zone && (
                        <span className="text-[11px] text-[#8B95A9] capitalize">
                          {order.delivery_zone.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </AdminTd>

                  {/* Customer */}
                  <AdminTd>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#E6EAF2] font-medium">{order.customer_name}</span>
                      <span className="text-[11px] text-[#8B95A9]">{order.customer_phone}</span>
                      {order.customer_email && (
                        <span className="text-[11px] text-[#8B95A9]">{order.customer_email}</span>
                      )}
                    </div>
                  </AdminTd>

                  {/* Date */}
                  <AdminTd>
                    <span className="text-[#8B95A9] text-[12px]">{date}</span>
                  </AdminTd>

                  {/* Order status */}
                  <AdminTd align="center">
                    <AdminBadge variant={orderStatusVariant(order.order_status)}>
                      {order.order_status}
                    </AdminBadge>
                  </AdminTd>

                  {/* Payment status */}
                  <AdminTd align="center">
                    <AdminBadge variant={paymentStatusVariant(order.payment_status)}>
                      {order.payment_status}
                    </AdminBadge>
                  </AdminTd>

                  {/* Payment method */}
                  <AdminTd align="center">
                    <span className="text-[#8B95A9] text-[12px] font-medium">
                      {paymentMethodLabel(order.payment_method)}
                    </span>
                  </AdminTd>

                  {/* Grand total */}
                  <AdminTd align="right">
                    <span className="text-[#E6EAF2] font-semibold tabular-nums">
                      {formatBDT(Number(order.grand_total))}
                    </span>
                  </AdminTd>

                  {/* View button */}
                  <AdminTd align="center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(order); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11px] font-semibold text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/08 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </AdminTd>
                </AdminTr>
              );
            })}
          </AdminTbody>
        </AdminTable>
      </div>

      {/* ── Mobile cards (hidden on md+) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-8 h-8 text-[#8B95A9] mb-3" />
            <p className="text-[#8B95A9] text-[13px]">No orders yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              onClick={() => setSelected(order)}
            />
          ))
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

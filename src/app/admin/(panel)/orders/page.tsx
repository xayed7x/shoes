import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader, AdminCard } from "@/components/admin/ui/Cards";
import { ShoppingBag, Clock, CheckCircle2, XCircle, Truck, Package } from "lucide-react";
import type { Metadata } from "next";
import type { Order, OrderItem } from "@/types";
import { formatBDT } from "@/lib/utils";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "Orders | Soleil Admin",
  robots: { index: false, follow: false },
};

// ── Stat card data ─────────────────────────────────────────────────────────────

function buildStats(orders: Order[]) {
  const total    = orders.length;
  const pending  = orders.filter((o) => o.order_status === "pending").length;
  const shipped  = orders.filter((o) => o.order_status === "shipped" || o.order_status === "delivered").length;
  const revenue  = orders
    .filter((o) => o.order_status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.grand_total), 0);

  return [
    { label: "Total Orders",  value: total.toString(),   icon: ShoppingBag,  color: "#8B95A9" },
    { label: "Pending",       value: pending.toString(), icon: Clock,        color: "#F59E0B" },
    { label: "Shipped",       value: shipped.toString(), icon: Truck,        color: "#3B82F6" },
    { label: "Revenue (BDT)", value: formatBDT(revenue), icon: CheckCircle2, color: "#10B981" },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OrdersPage() {
  const supabase = createAdminClient();

  let orders: (Order & { order_items?: OrderItem[] })[] = [];
  let fetchError: string | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id, order_number, customer_name, customer_phone, customer_email,
        grand_total, subtotal, shipping_fee, discount_amount,
        order_status, payment_status, payment_method, payment_reference,
        delivery_zone, shipping_address, notes, access_token,
        created_at, updated_at,
        order_items (
          id, order_id, product_id, variant_id,
          product_name, size, color,
          unit_price, quantity, subtotal, image_url
        )
      `)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      fetchError = error.message;
    } else {
      orders = (data ?? []) as (Order & { order_items?: OrderItem[] })[];
    }
  } else {
    fetchError = "Database not connected (demo mode).";
  }

  const stats = buildStats(orders);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="View and manage all customer orders."
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <AdminCard key={s.label} padding="md" className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[#8B95A9] text-[11px] uppercase tracking-[0.1em]">{s.label}</p>
                <p className="text-[#E6EAF2] text-[18px] font-semibold leading-tight">{s.value}</p>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* ── Error state ── */}
      {fetchError && (
        <AdminCard padding="md" className="mb-6 border-red-500/20">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-[13px]">Failed to load orders: {fetchError}</p>
          </div>
        </AdminCard>
      )}

      {/* ── Orders (client: table on desktop, cards on mobile) ── */}
      {orders.length === 0 && !fetchError ? (
        <AdminCard padding="none">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/05 flex items-center justify-center text-[#8B95A9] mb-5">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-[#E6EAF2] font-semibold text-[16px] mb-2">No orders yet</h3>
            <p className="text-[#8B95A9] text-[13px] max-w-sm">
              When customers place orders they will appear here. Click any order to view full details.
            </p>
          </div>
        </AdminCard>
      ) : (
        <AdminCard padding="none">
          <div className="p-4">
            <OrdersClient orders={orders} />
          </div>
        </AdminCard>
      )}

      {orders.length > 0 && (
        <p className="text-[#8B95A9] text-[12px] mt-4 text-right">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}


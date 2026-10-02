import { PageHeader, AdminCard } from "@/components/admin/ui/Cards";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatBDT } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Premium Export Shoes Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = createAdminClient();

  let totalOrders = 0;
  let revenue = 0;
  let totalProducts = 0;
  let pendingOrders = 0;
  let recentOrders: {
    order_number: string;
    customer_name: string;
    grand_total: number;
    order_status: string;
    created_at: string;
  }[] = [];

  if (supabase) {
    const [ordersRes, productsRes, recentRes] = await Promise.all([
      supabase.from("orders").select("grand_total, order_status"),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select(
          "order_number, customer_name, grand_total, order_status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (ordersRes.data) {
      totalOrders = ordersRes.data.length;
      revenue = ordersRes.data
        .filter((o) => o.order_status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.grand_total), 0);
      pendingOrders = ordersRes.data.filter(
        (o) => o.order_status === "pending",
      ).length;
    }
    totalProducts = productsRes.count ?? 0;
    recentOrders = (recentRes.data ?? []) as typeof recentOrders;
  }

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "#8B95A9",
      href: "/admin/orders",
    },
    {
      label: "Revenue (BDT)",
      value: formatBDT(revenue),
      icon: TrendingUp,
      color: "#10B981",
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "#3B82F6",
      href: "/admin/products",
    },
    {
      label: "Pending",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "#F59E0B",
      href: "/admin/orders",
    },
  ];

  function statusColor(status: string) {
    switch (status) {
      case "pending":
        return "text-amber-400";
      case "processing":
        return "text-blue-400";
      case "shipped":
        return "text-[#E6EAF2]";
      case "delivered":
        return "text-emerald-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-[#8B95A9]";
    }
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's an overview of your store."
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <AdminCard
                padding="md"
                className="flex items-center gap-4 hover:border-white/12 transition-colors cursor-pointer group"
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[#8B95A9] text-[11px] uppercase tracking-[0.1em]">
                    {s.label}
                  </p>
                  <p className="text-[#E6EAF2] text-[18px] font-semibold leading-tight truncate">
                    {s.value}
                  </p>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>

      {/* ── Recent orders ── */}
      <AdminCard padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/06">
          <h2 className="text-[14px] font-semibold text-[#E6EAF2]">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-[11px] text-[#8B95A9] hover:text-[#E6EAF2] transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="w-6 h-6 text-[#8B95A9] mb-2" />
            <p className="text-[#8B95A9] text-[13px]">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/04">
            {recentOrders.map((order) => (
              <div
                key={order.order_number}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-white/02 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-white/08 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#8B95A9] uppercase">
                      {order.customer_name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#E6EAF2] font-medium truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-[11px] font-mono text-[#8B95A9]">
                      {order.order_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span
                    className={`text-[11px] font-semibold capitalize ${statusColor(order.order_status)}`}
                  >
                    {order.order_status}
                  </span>
                  <span className="text-[13px] font-semibold text-[#E6EAF2] tabular-nums">
                    {formatBDT(Number(order.grand_total))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

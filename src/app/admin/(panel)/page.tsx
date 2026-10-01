import { PageHeader } from "@/components/admin/ui/Cards";
import { EmptyState } from "@/components/admin/ui/Cards";
import { AdminCard } from "@/components/admin/ui/Cards";
import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Soleil Admin",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's an overview of your store."
      />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {["Total Orders", "Revenue", "Products", "Customers"].map((label) => (
          <AdminCard key={label} padding="md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8B95A9] mb-3">
              {label}
            </p>
            <div className="h-8 w-24 bg-white/05 rounded-[8px] animate-pulse" />
          </AdminCard>
        ))}
      </div>

      <AdminCard padding="none">
        <EmptyState
          icon={<LayoutDashboard className="w-6 h-6" />}
          title="Dashboard coming soon"
          description="Order charts, revenue graphs, and quick actions will appear here."
        />
      </AdminCard>
    </div>
  );
}

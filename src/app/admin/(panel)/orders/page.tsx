import { PageHeader } from "@/components/admin/ui/Cards";
import { EmptyState } from "@/components/admin/ui/Cards";
import { AdminCard } from "@/components/admin/ui/Cards";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Soleil Admin",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="View and manage customer orders."
      />
      <AdminCard padding="none">
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="No orders yet"
          description="When customers place orders they will appear here. You can update status, view details, and manage fulfilment."
        />
      </AdminCard>
    </div>
  );
}

import { PageHeader } from "@/components/admin/ui/Cards";
import { EmptyState } from "@/components/admin/ui/Cards";
import { AdminCard } from "@/components/admin/ui/Cards";
import { AdminButton } from "@/components/admin/ui/Button";
import { Package, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Soleil Admin",
  robots: { index: false, follow: false },
};

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalogue."
        actions={
          <AdminButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Add product
          </AdminButton>
        }
      />

      <AdminCard padding="none">
        <EmptyState
          icon={<Package className="w-6 h-6" />}
          title="No products yet"
          description="Your product catalogue will appear here. Add your first product to get started."
          action={
            <AdminButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add product
            </AdminButton>
          }
        />
      </AdminCard>
    </div>
  );
}

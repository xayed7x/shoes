import { PageHeader } from "@/components/admin/ui/Cards";
import { EmptyState } from "@/components/admin/ui/Cards";
import { AdminCard } from "@/components/admin/ui/Cards";
import { Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage | Premium Export Shoes Admin",
  robots: { index: false, follow: false },
};

export default function HomepagePage() {
  return (
    <div>
      <PageHeader
        title="Homepage"
        subtitle="Edit hero slides, featured collections, and banners."
      />
      <AdminCard padding="none">
        <EmptyState
          icon={<Home className="w-6 h-6" />}
          title="Homepage editor coming soon"
          description="You will be able to manage hero slides, featured products, and promotional banners from here."
        />
      </AdminCard>
    </div>
  );
}

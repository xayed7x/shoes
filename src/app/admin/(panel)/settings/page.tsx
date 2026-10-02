import { PageHeader } from "@/components/admin/ui/Cards";
import { EmptyState } from "@/components/admin/ui/Cards";
import { AdminCard } from "@/components/admin/ui/Cards";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Premium Export Shoes Admin",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Store name, shipping fees, payment details and more."
      />
      <AdminCard padding="none">
        <EmptyState
          icon={<Settings className="w-6 h-6" />}
          title="Settings coming soon"
          description="Store configuration, shipping zones, payment methods, and notification preferences will be managed here."
        />
      </AdminCard>
    </div>
  );
}

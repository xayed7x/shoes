import { requireAdmin } from "@/lib/auth/admin";
import AdminShell from "@/components/admin/layout/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard — redirects to /admin/login if not admin
  const admin = await requireAdmin();

  return (
    <AdminShell adminEmail={admin.email} adminName={admin.full_name}>
      {children}
    </AdminShell>
  );
}

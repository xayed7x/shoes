"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/layout/Sidebar";
import AdminTopbar from "@/components/admin/layout/Topbar";
import { ToastProvider } from "@/components/admin/ui/Toast";

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail: string;
  adminName?: string | null;
}

export default function AdminShell({
  children,
  adminEmail,
  adminName,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#070B14] flex" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Mobile Sidebar Drawer */}
        <AdminSidebar
          mobile
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar
            adminEmail={adminEmail}
            adminName={adminName}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex-1 p-5 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

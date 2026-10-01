"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, LogOut, ExternalLink } from "lucide-react";
import { DropdownMenu } from "@/components/admin/ui/DropdownMenu";
import { adminSignOutAction } from "@/app/actions/admin-auth";

interface AdminTopbarProps {
  adminEmail: string;
  adminName?: string | null;
  onMenuClick: () => void;
}

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/homepage")) return "Homepage";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

function getInitials(email: string, name?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function AdminTopbar({
  adminEmail,
  adminName,
  onMenuClick,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const pageTitle = getPageTitle(pathname);
  const initials = getInitials(adminEmail, adminName);

  const handleSignOut = async () => {
    setSigningOut(true);
    await adminSignOutAction();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-5 h-[60px] bg-[#070B14]/95 backdrop-blur-md border-b border-white/06 md:px-6">
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-controls="admin-sidebar-mobile"
        aria-expanded="false"
        className="flex md:hidden w-9 h-9 items-center justify-center rounded-[10px] text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/06 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Page title */}
      <h1
        className="flex-none text-[18px] font-bold italic text-[#E6EAF2] leading-none hidden md:block"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {pageTitle}
      </h1>

      {/* Search bar — centered */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B95A9]/60" />
          <input
            readOnly
            placeholder="Search..."
            aria-label="Search (press ⌘K to open command palette)"
            className="w-full pl-9 pr-14 py-2 bg-[#111A2E] border border-white/06 rounded-[10px] text-[13px] text-[#8B95A9] placeholder-[#8B95A9]/40 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8B95A9]/50 bg-white/05 border border-white/08 rounded px-1.5 py-0.5 leading-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-none">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/06 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger aria-label="Account menu">
            <div className="w-9 h-9 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] text-[12px] font-bold tracking-wide hover:border-[#10B981]/60 transition-colors">
              {initials}
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="right">
            <DropdownMenu.Label>Account</DropdownMenu.Label>
            <div className="px-3.5 pb-2">
              <p className="text-[12px] font-medium text-[#E6EAF2]">
                {adminName || "Admin"}
              </p>
              <p className="text-[11px] text-[#8B95A9] truncate max-w-[180px]">
                {adminEmail}
              </p>
            </div>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              href="/"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View storefront
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              variant="danger"
              icon={<LogOut className="w-3.5 h-3.5" />}
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}

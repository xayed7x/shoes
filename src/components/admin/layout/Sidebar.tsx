"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Home,
  Tag,
  Users,
  Settings,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
  soon?: boolean;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Products", href: "/admin/products", icon: <Package className="w-4 h-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Homepage", href: "/admin/homepage", icon: <Home className="w-4 h-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <Tag className="w-4 h-4" />, disabled: true, soon: true },
  { label: "Customers", href: "/admin/customers", icon: <Users className="w-4 h-4" />, disabled: true, soon: true },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

export default function AdminSidebar({ open, onClose, mobile = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo + close button */}
      <div className="flex items-center justify-between px-5 pt-5 pb-6">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[22px] font-bold italic text-[#E6EAF2] leading-none"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Soleil
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-[5px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20">
            Admin
          </span>
        </div>
        {mobile && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/06 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav label */}
      <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B95A9]/60">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5" aria-label="Admin navigation">
        {NAV.map((item) => {
          const active = isActive(item.href);
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[#8B95A9]/40 cursor-not-allowed select-none"
              >
                <span className="flex-none opacity-50">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[5px] bg-[#8B95A9]/10 text-[#8B95A9]/60">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              aria-current={active ? "page" : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                ${
                  active
                    ? "bg-white text-[#070B14] shadow-sm"
                    : "text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/05"
                }
              `}
            >
              <span className={`flex-none ${active ? "text-[#070B14]" : ""}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Live demo pill */}
      <div className="px-4 pb-5 pt-4 border-t border-white/06 mt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#111A2E] border border-white/06 text-[12px] text-[#8B95A9] hover:text-[#E6EAF2] hover:border-white/12 transition-all duration-150 group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse flex-none" />
          <span>Live storefront</span>
          <span className="ml-auto text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
        </a>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Drawer */}
        <aside
          id="admin-sidebar-mobile"
          aria-label="Admin navigation"
          className={`
            fixed top-0 left-0 z-50 h-full w-[260px]
            bg-[#070B14] border-r border-white/06
            transition-transform duration-200 ease-in-out motion-reduce:transition-none
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {inner}
        </aside>
      </>
    );
  }

  return (
    <aside
      className="hidden md:flex flex-col w-[228px] flex-none bg-[#070B14] border-r border-white/06 h-screen sticky top-0"
      aria-label="Admin navigation"
    >
      {inner}
    </aside>
  );
}

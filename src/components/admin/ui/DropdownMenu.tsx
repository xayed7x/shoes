"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  createContext,
  useContext,
} from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface DropdownCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const Ctx = createContext<DropdownCtx | null>(null);
const useDropdown = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("DropdownMenu parts must be inside DropdownMenu.Root");
  return ctx;
};

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <Ctx.Provider value={{ open, setOpen, triggerRef }}>
      <div ref={rootRef} className="relative inline-block">
        {children}
      </div>
    </Ctx.Provider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

function Trigger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, setOpen, triggerRef } = useDropdown();
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

function Content({
  children,
  align = "right",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  const { open } = useDropdown();
  if (!open) return null;
  return (
    <div
      role="menu"
      className={`
        absolute z-50 top-full mt-2 min-w-[200px]
        ${align === "right" ? "right-0" : "left-0"}
        bg-[#111A2E] rounded-[14px] border border-white/08
        shadow-[0_16px_48px_-8px_rgba(0,0,0,0.6)]
        animate-in fade-in zoom-in-95 origin-top-right duration-150
        py-1
      `}
    >
      {children}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
  href?: string;
}

function Item({
  children,
  onClick,
  icon,
  variant = "default",
  disabled = false,
  href,
}: ItemProps) {
  const { setOpen } = useDropdown();
  const cls = `
    flex items-center gap-3 w-full px-3.5 py-2.5 text-[13px] text-left
    transition-colors duration-100 cursor-pointer
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30
    disabled:opacity-40 disabled:cursor-not-allowed
    ${
      variant === "danger"
        ? "text-red-400 hover:bg-red-500/10"
        : "text-[#E6EAF2] hover:bg-white/05"
    }
  `;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  if (href) {
    return (
      <a
        role="menuitem"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={() => setOpen(false)}
      >
        {icon && <span className="flex-none opacity-60">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      role="menuitem"
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cls}
    >
      {icon && <span className="flex-none opacity-60">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

function Separator() {
  return <div role="separator" className="my-1 h-px bg-white/06 mx-2" />;
}

// ─── Label ────────────────────────────────────────────────────────────────────

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8B95A9]">
      {children}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const DropdownMenu = { Root, Trigger, Content, Item, Separator, Label };

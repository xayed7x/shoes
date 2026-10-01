"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-white text-[#070B14] font-semibold hover:bg-white/90 focus-visible:ring-white/50 border border-white/10",
  secondary:
    "bg-[#111A2E] text-[#E6EAF2] font-medium hover:bg-[#1a2540] focus-visible:ring-white/20 border border-white/08",
  ghost:
    "bg-transparent text-[#8B95A9] font-medium hover:bg-white/05 hover:text-[#E6EAF2] focus-visible:ring-white/20",
  danger:
    "bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 focus-visible:ring-red-500/40 border border-red-500/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-[12px] px-3 py-1.5 rounded-[10px] gap-1.5",
  md: "text-[13px] px-4 py-2 rounded-[10px] gap-2",
  lg: "text-[14px] px-5 py-2.5 rounded-[12px] gap-2",
};

export const AdminButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14]
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && <span className="flex-none">{icon}</span>
        )}
        {children && <span>{children}</span>}
      </button>
    );
  }
);
AdminButton.displayName = "AdminButton";

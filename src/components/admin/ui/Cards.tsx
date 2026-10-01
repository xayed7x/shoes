// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 lg:p-6",
  lg: "p-6 lg:p-8",
};

export function AdminCard({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        bg-[#0D1424] rounded-[16px] border border-white/06
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-[#E6EAF2]",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-red-500/15 text-red-400",
  info: "bg-blue-500/15 text-blue-400",
  muted: "bg-white/05 text-[#8B95A9]",
};

export function AdminBadge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-[6px]
        text-[11px] font-semibold uppercase tracking-[0.08em]
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/05 flex items-center justify-center text-[#8B95A9] mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-[#E6EAF2] font-semibold text-[16px] mb-2">{title}</h3>
      {description && (
        <p className="text-[#8B95A9] text-[13px] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/05 rounded-[8px] animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1
          className="font-serif italic text-[28px] lg:text-[34px] text-[#E6EAF2] leading-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#8B95A9] text-[13px] mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-none">{actions}</div>
      )}
    </div>
  );
}

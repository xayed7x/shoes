import { ReactNode } from "react";

// ─── Table ────────────────────────────────────────────────────────────────────

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function AdminTable({ children, className = "" }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto rounded-[16px] border border-white/06 ${className}`}>
      <table className="w-full border-collapse text-[13px]">
        {children}
      </table>
    </div>
  );
}

// ─── Thead ────────────────────────────────────────────────────────────────────

export function AdminThead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-[#0D1424] border-b border-white/06">
      {children}
    </thead>
  );
}

// ─── Th ───────────────────────────────────────────────────────────────────────

interface ThProps {
  children?: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function AdminTh({ children, className = "", align = "left" }: ThProps) {
  return (
    <th
      scope="col"
      className={`
        px-4 py-3
        text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8B95A9]
        whitespace-nowrap
        ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

// ─── Tbody ────────────────────────────────────────────────────────────────────

export function AdminTbody({ children }: { children: ReactNode }) {
  return (
    <tbody className="bg-[#0D1424] divide-y divide-white/04">
      {children}
    </tbody>
  );
}

// ─── Tr ───────────────────────────────────────────────────────────────────────

interface TrProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AdminTr({ children, onClick, className = "" }: TrProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        transition-colors duration-100
        ${onClick ? "cursor-pointer hover:bg-white/03" : "hover:bg-white/02"}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

// ─── Td ───────────────────────────────────────────────────────────────────────

interface TdProps {
  children?: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  colSpan?: number;
}

export function AdminTd({
  children,
  className = "",
  align = "left",
  colSpan,
}: TdProps) {
  return (
    <td
      colSpan={colSpan}
      className={`
        px-4 py-3 text-[#E6EAF2] whitespace-nowrap
        ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

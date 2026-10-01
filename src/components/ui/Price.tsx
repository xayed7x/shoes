import { formatBDT } from "@/lib/utils";

interface PriceProps {
  amount: number;
  className?: string;
  muted?: boolean;
  strikethrough?: boolean;
}

export default function Price({
  amount,
  className = "",
  muted = false,
  strikethrough = false,
}: PriceProps) {
  const formatted = amount.toLocaleString("en-BD");

  return (
    <span
      className={`inline-flex items-baseline ${
        muted ? "text-[#6B6560]" : ""
      } ${strikethrough ? "line-through text-[#6B6560]" : ""} ${className}`}
    >
      <span className="font-bengali mr-0.5 text-[0.9em]">৳</span>
      <span className="font-sans tabular-nums lining-nums">{formatted}</span>
    </span>
  );
}

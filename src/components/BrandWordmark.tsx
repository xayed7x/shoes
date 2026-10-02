import Link from "next/link";

type BrandWordmarkSize = "sm" | "md" | "lg";

interface BrandWordmarkProps {
  size?: BrandWordmarkSize;
  dark?: boolean;
  cream?: boolean; // Force cream variant for SHOES/EXPORT
  className?: string;
  mobileResponsive?: boolean;
}

const sizeConfig = {
  sm: {
    premium: "text-[14px]",
    export: "text-[7px]",
    shoes: "text-[14px]",
    gap: "gap-0.5",
  },
  md: {
    premium: "text-[18px]",
    export: "text-[9px]",
    shoes: "text-[18px]",
    gap: "gap-0.5",
  },
  lg: {
    premium: "text-[24px]",
    export: "text-[12px]",
    shoes: "text-[24px]",
    gap: "gap-1",
  },
};

const mobileSizeConfig = {
  sm: {
    premium: "text-[clamp(10px,3vw,14px)]",
    export: "text-[clamp(5px,1.5vw,7px)]",
    shoes: "text-[clamp(10px,3vw,14px)]",
  },
  md: {
    premium: "text-[clamp(12px,3.5vw,18px)]",
    export: "text-[clamp(6px,1.75vw,9px)]",
    shoes: "text-[clamp(12px,3.5vw,18px)]",
  },
  lg: {
    premium: "text-[clamp(16px,4vw,24px)]",
    export: "text-[clamp(8px,2vw,12px)]",
    shoes: "text-[clamp(16px,4vw,24px)]",
  },
};

export default function BrandWordmark({
  size = "md",
  dark = false,
  cream = false,
  className = "",
  mobileResponsive = false,
}: BrandWordmarkProps) {
  const config = mobileResponsive ? mobileSizeConfig[size] : sizeConfig[size];
  const gap = sizeConfig[size].gap;

  const textColor = dark
    ? "text-[#FAF8F4]"
    : cream
      ? "text-[#FAF8F4]"
      : "text-[#1C1917]";
  const premiumColor = "text-[#E31B23]";

  return (
    <Link
      href="/"
      className={`flex items-center ${gap} font-barlow-condensed font-extrabold italic uppercase tracking-tight leading-none ${className}`}
    >
      <span className={`${config.premium} ${premiumColor}`}>PREMIUM</span>
      <span className={`${config.export} ${textColor} tracking-[0.3em]`}>
        EXPORT
      </span>
      <span className={`${config.shoes} ${textColor}`}>SHOES</span>
    </Link>
  );
}

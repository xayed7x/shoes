import type { Metadata } from "next";
import {
  Inter,
  Fraunces,
  Noto_Sans_Bengali,
  Barlow_Condensed,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  style: "italic",
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://autex.vercel.app",
  ),
  title: "Premium Export Shoes - Luxury Handcrafted Footwear",
  description:
    "Experience unparalleled comfort with Premium Export Shoes' handcrafted footwear. Built for those who move with intention. Premium materials, minimal design.",
  openGraph: {
    title: "Premium Export Shoes - Luxury Handcrafted Footwear",
    description:
      "Experience unparalleled comfort with Premium Export Shoes' handcrafted footwear.",
    url: "https://autex.vercel.app/",
    siteName: "Premium Export Shoes",
    images: [
      {
        url: "/metadata/og-image.png",
        width: 1200,
        height: 630,
        alt: "Premium Export Shoes - Comfort, Redefined",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Export Shoes - Luxury Handcrafted Footwear",
    description:
      "Experience unparalleled comfort with Premium Export Shoes' handcrafted footwear.",
    images: ["/metadata/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`antialiased ${inter.variable} ${fraunces.variable} ${notoBengali.variable} ${barlowCondensed.variable}`}
    >
      <body className="w-full min-h-screen bg-[#F5F0E8] m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

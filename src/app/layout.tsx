import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soleil - Luxury Handcrafted Sleepers",
  description: "Experience unparalleled comfort with Soleil's handcrafted sleepers. Built for those who move with intention. Premium materials, minimal design.",
  openGraph: {
    title: "Soleil - Luxury Handcrafted Sleepers",
    description: "Experience unparalleled comfort with Soleil's handcrafted sleepers.",
    url: "https://autex.vercel.app/",
    siteName: "Soleil",
    images: [
      {
        url: "/metadata/og-image.png",
        width: 1200,
        height: 630,
        alt: "Soleil - Comfort, Redefined",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soleil - Luxury Handcrafted Sleepers",
    description: "Experience unparalleled comfort with Soleil's handcrafted sleepers.",
    images: ["/metadata/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="w-full min-h-screen bg-[#F5F0E8] m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

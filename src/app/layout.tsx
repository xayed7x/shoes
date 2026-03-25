import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soleil - Demo",
  description: "Soleil Luxury Sleepers Demo",
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

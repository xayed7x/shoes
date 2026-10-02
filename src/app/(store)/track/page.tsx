import { Metadata } from "next";
import TrackOrderForm from "@/components/track/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order | Premium Export Shoes",
  description: "Track the status of your Premium Export Shoes order.",
};

export default function TrackOrderPage() {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E8] pt-[120px] pb-[100px] px-5 lg:px-0">
      <div className="max-w-[700px] mx-auto bg-white border border-[#E8DFD0] rounded-[16px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h1 className="font-serif italic font-light text-4xl text-[#1C1917] mb-3 text-center">
          Track Your Order
        </h1>
        <p className="font-sans text-[14px] text-[#6B6560] text-center mb-8">
          Enter your order number and phone number to see its current status.
        </p>
        <TrackOrderForm />
      </div>
    </main>
  );
}

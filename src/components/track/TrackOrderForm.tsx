"use client";

import { useState, useTransition } from "react";
import { trackOrder, TrackOrderResult } from "@/app/actions/track";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TrackOrderResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!orderNumber || !phone) return;

    startTransition(async () => {
      const res = await trackOrder(orderNumber, phone);
      setResult(res);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-[#A8A29D]" />;
      case "processing":
        return <Package className="w-6 h-6 text-[#C4714A]" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-[#A8A29D]" />;
    }
  };

  const inputClass = "w-full bg-[#FAF8F4] border border-[#E8DFD0] rounded-[8px] px-4 py-4 font-sans text-[14px] text-[#1C1917] placeholder:text-[#A8A29D] focus:outline-none focus:border-[#C4714A] transition-colors mb-4";

  return (
    <div className="w-full font-sans">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-8">
        <div>
          <label className="block font-sans text-[11px] uppercase tracking-[0.1em] text-[#6B6560] mb-2">Order Number *</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className={inputClass}
            placeholder="e.g. SOL-251030-A1B2"
            required
          />
        </div>
        <div>
          <label className="block font-sans text-[11px] uppercase tracking-[0.1em] text-[#6B6560] mb-2">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="e.g. 017..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !orderNumber || !phone}
          className="w-full bg-[#1C1917] text-[#FAF8F4] py-4 rounded-[8px] font-sans text-[13px] uppercase tracking-[0.15em] font-semibold hover:bg-[#C4714A] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? "Searching..." : "Track Order"}
        </button>
      </form>

      {result && !result.ok && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-[8px] font-sans text-[14px] text-center">
          {result.message}
        </div>
      )}

      {result && result.ok && (
        <div className="bg-[#FAF8F4] border border-[#E8DFD0] rounded-[12px] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center border-b border-[#E8DFD0] pb-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-1">Order</p>
              <p className="text-[16px] text-[#1C1917] font-medium">{result.order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium mb-1">Date</p>
              <p className="text-[14px] text-[#1C1917]">{new Date(result.order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E8DFD0]">
              {getStatusIcon(result.order.order_status)}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] uppercase tracking-[0.15em] text-[#A8A29D] font-medium">Status</span>
              <span className="text-[18px] text-[#1C1917] capitalize font-medium">{result.order.order_status}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8DFD0] rounded-[8px] p-4 text-[13px] flex justify-between items-center">
            <span className="text-[#6B6560]">Payment ({result.order.payment_method.toUpperCase()}):</span>
            <span className="text-[#1C1917] font-medium capitalize">{result.order.payment_status}</span>
          </div>
        </div>
      )}
    </div>
  );
}

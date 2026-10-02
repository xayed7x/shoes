"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  color?: string | null;
  quantity: number;
  subtotal: number;
}

interface OrderConfirmedModalProps {
  orderNumber: string;
  items: OrderItem[];
}

function formatBDT(amount: number) {
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

export default function OrderConfirmedModal({ orderNumber, items }: OrderConfirmedModalProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ocm-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ocm-slide {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ocm-icon-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ocm-card-in {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ocm-backdrop-anim { animation: ocm-backdrop 0.3s ease both; }
        .ocm-closing-bd    { animation: ocm-backdrop 0.25s ease reverse both; }
        .ocm-panel-anim    { animation: ocm-slide 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .ocm-closing-pn    { animation: ocm-slide 0.25s ease reverse both; }
        .ocm-icon          { animation: ocm-icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
        .ocm-card          { animation: ocm-card-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`${closing ? "ocm-closing-bd" : "ocm-backdrop-anim"} fixed inset-0 z-[200] bg-black/50 backdrop-blur-[3px] flex items-end sm:items-center justify-center p-4 sm:p-6`}
        onClick={close}
      >
        {/* Panel */}
        <div
          className={`${closing ? "ocm-closing-pn" : "ocm-panel-anim"} relative w-full max-w-[520px] bg-[#FAF8F4] rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#E8DFD0] flex items-center justify-center text-[#6B6560] hover:bg-[#1C1917] hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X size={14} strokeWidth={2} />
          </button>

          {/* Header stripe */}
          <div className="bg-gradient-to-r from-[#C4714A] to-[#D4885F] px-8 py-6 flex flex-col items-center text-center">
            <div className="ocm-icon mb-3">
              <CheckCircle2 className="w-14 h-14 text-white drop-shadow-lg" strokeWidth={1.5} />
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/70 mb-1">
              Order Confirmed
            </p>
            <h2 className="font-serif italic font-light text-[26px] text-white leading-tight">
              Your order is placed!
            </h2>
            <p className="font-sans text-[12px] text-white/80 mt-1 tracking-wider">
              {orderNumber}
            </p>
          </div>

          {/* Product cards */}
          <div className="px-6 py-5 flex flex-col gap-3 max-h-[280px] overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="ocm-card flex items-center gap-4 bg-white border border-[#E8DFD0] rounded-[12px] px-4 py-3"
                style={{ animationDelay: `${0.35 + i * 0.07}s` }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FFF7ED] border border-[#F8C5A0] flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-[#C4714A]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[13px] font-semibold text-[#1C1917] truncate">
                    {item.product_name}
                  </p>
                  <p className="font-sans text-[11px] text-[#A8A29D] mt-0.5">
                    Size {item.size}
                    {item.color ? ` · ${item.color}` : ""} · Qty {item.quantity}
                  </p>
                  <p className="font-sans text-[11px] text-[#C4714A] font-medium mt-0.5">
                    This product has been confirmed ✓
                  </p>
                </div>
                <span className="font-sans text-[13px] font-semibold text-[#1C1917] tabular-nums flex-shrink-0">
                  {formatBDT(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="px-6 pb-6 pt-3 flex flex-col gap-3 border-t border-[#E8DFD0]">
            <Link
              href="/shop"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full bg-[#1C1917] text-[#FAF8F4] rounded-[10px] py-3.5 font-sans text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-[#C4714A] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(196,113,74,0.3)]"
            >
              <ShoppingBag size={14} strokeWidth={2} />
              Return to Shop
            </Link>
            <button
              onClick={close}
              className="w-full text-center font-sans text-[11px] text-[#6B6560] hover:text-[#1C1917] transition-colors"
            >
              View order details below
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

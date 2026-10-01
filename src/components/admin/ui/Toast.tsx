"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastCtx {
  toast: (message: string, variant?: ToastVariant) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

const borderColors: Record<ToastVariant, string> = {
  success: "border-emerald-500/20",
  error: "border-red-500/20",
  info: "border-blue-500/20",
  warning: "border-amber-500/20",
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      {/* Toast viewport */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-sm
              bg-[#111A2E] border ${borderColors[t.variant]} rounded-[12px]
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              animate-in slide-in-from-right-4 fade-in duration-200
              motion-reduce:animate-none
            `}
          >
            {icons[t.variant]}
            <p className="flex-1 text-[13px] text-[#E6EAF2] leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="flex-none text-[#8B95A9] hover:text-[#E6EAF2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

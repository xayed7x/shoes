"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { AdminButton } from "./Button";

// ─── Modal / Dialog ───────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** max-width class, default "max-w-lg" */
  size?: string;
}

export function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  size = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-desc" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm motion-reduce:transition-none" />

      {/* Panel */}
      <div
        className={`
          relative w-full ${size} bg-[#0D1424] rounded-[20px]
          border border-white/08 shadow-2xl
          animate-in fade-in zoom-in-95 duration-150
        `}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/06">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-[16px] font-semibold text-[#E6EAF2]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-desc" className="text-[12px] text-[#8B95A9] mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="flex-none w-7 h-7 rounded-[8px] flex items-center justify-center text-[#8B95A9] hover:text-[#E6EAF2] hover:bg-white/08 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AdminModal open={open} onClose={onClose} size="max-w-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[#E6EAF2]">{title}</h2>
          {description && (
            <p className="text-[13px] text-[#8B95A9] mt-2">{description}</p>
          )}
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <AdminButton variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}

"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AdminInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8B95A9]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3.5 py-2.5 rounded-[10px] text-[13px]
            bg-[#111A2E] text-[#E6EAF2] placeholder-[#8B95A9]/50
            border border-white/08 
            focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-red-500/50 focus:ring-red-500/30" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-[#8B95A9]">{hint}</p>}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8B95A9]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`
            w-full px-3.5 py-2.5 rounded-[10px] text-[13px] resize-y
            bg-[#111A2E] text-[#E6EAF2] placeholder-[#8B95A9]/50
            border border-white/08
            focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-red-500/50 focus:ring-red-500/30" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);
AdminTextarea.displayName = "AdminTextarea";

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8B95A9]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full px-3.5 py-2.5 rounded-[10px] text-[13px]
            bg-[#111A2E] text-[#E6EAF2]
            border border-white/08
            focus:outline-none focus:ring-2 focus:ring-white/20
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-red-500/50" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);
AdminSelect.displayName = "AdminSelect";

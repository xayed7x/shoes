import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import LoginForm from "./LoginForm";
import type { Metadata } from "next";
import BrandWordmark from "@/components/BrandWordmark";

export const metadata: Metadata = {
  title: "Admin Login | Premium Export Shoes",
  description: "Sign in to the Premium Export Shoes admin panel.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // If already logged in as admin, skip login
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "admin") {
          redirect("/admin");
        }
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-[#070B14] flex items-center justify-center px-4"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#10B981]/05 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[380px]">
        {/* Wordmark */}
        <div className="text-center mb-8">
          <BrandWordmark size="lg" dark />
          <p className="text-[12px] text-[#8B95A9] mt-2 tracking-wide">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1424] rounded-[20px] border border-white/08 p-7 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)]">
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold text-[#E6EAF2]">
              Sign in
            </h2>
            <p className="text-[12px] text-[#8B95A9] mt-1">
              Enter your admin credentials to continue.
            </p>
          </div>

          <LoginForm dbConnected={isSupabaseConfigured()} />
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#8B95A9]/50 mt-6">
          © {new Date().getFullYear()} Premium Export Shoes. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

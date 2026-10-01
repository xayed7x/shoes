"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction, LoginState } from "@/app/actions/admin-auth";
import { AdminInput } from "@/components/admin/ui/Inputs";
import { AdminButton } from "@/components/admin/ui/Button";
import { AlertCircle, Wifi } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Invalid email or password.",
  no_access: "Your account does not have admin access.",
  db_not_configured: "Database not connected. Set SUPABASE env vars.",
};

export default function LoginForm({ dbConnected }: { dbConnected: boolean }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(
    adminLoginAction,
    null
  );

  useEffect(() => {
    if (state?.success) router.push("/admin");
  }, [state, router]);

  if (!dbConnected) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <Wifi className="w-5 h-5 text-amber-400" />
        </div>
        <p className="text-[14px] text-[#8B95A9] text-center">
          Database not connected.
          <br />
          <span className="text-amber-400">Set Supabase environment variables.</span>
        </p>
      </div>
    );
  }

  const errorMsg =
    state && !state.success
      ? ERROR_MESSAGES[state.error] ?? "Something went wrong. Please try again."
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <AdminInput
        label="Email"
        name="email"
        type="email"
        id="admin-email"
        placeholder="admin@example.com"
        autoComplete="email"
        required
        disabled={isPending}
      />
      <AdminInput
        label="Password"
        name="password"
        type="password"
        id="admin-password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        disabled={isPending}
      />

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-none" />
          <p className="text-[12px] text-red-300">{errorMsg}</p>
        </div>
      )}

      <AdminButton
        variant="primary"
        size="lg"
        type="submit"
        loading={isPending}
        disabled={isPending}
        className="w-full mt-1"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </AdminButton>
    </form>
  );
}

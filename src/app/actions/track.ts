"use server";

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type TrackOrderResult =
  | { ok: true; order: { order_number: string; created_at: string; order_status: string; payment_method: string; payment_status: string } }
  | { ok: false; message: string };

const trackRateLimits = new Map<string, { count: number; expires: number }>();

function checkTrackRateLimit(ipOrPhone: string): boolean {
  const now = Date.now();
  const limit = trackRateLimits.get(ipOrPhone);
  if (!limit || now > limit.expires) {
    trackRateLimits.set(ipOrPhone, { count: 1, expires: now + 60 * 1000 * 5 }); // 5 minutes
    return true;
  }
  if (limit.count >= 10) return false;
  limit.count++;
  return true;
}

export async function trackOrder(orderNumber: string, phone: string): Promise<TrackOrderResult> {
  if (!checkTrackRateLimit(phone)) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { ok: false, message: "Database disconnected." };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("order_number, order_status, created_at, payment_method, payment_status")
    .eq("order_number", orderNumber.trim())
    .eq("customer_phone", phone.trim())
    .single();

  if (error || !data) {
    // Generic message to prevent info leakage
    return { ok: false, message: "Order not found. Please check your order number and phone number." };
  }

  return { ok: true, order: data };
}

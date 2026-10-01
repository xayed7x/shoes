"use server";

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validation/checkout";

export type CheckoutResult =
  | { ok: true; orderNumber: string; token: string }
  | { ok: false; code: "VALIDATION_ERROR"; message: string; fieldErrors?: Record<string, string[]> }
  | { ok: false; code: "OUT_OF_STOCK"; message: string }
  | { ok: false; code: "RATE_LIMITED"; message: string }
  | { ok: false; code: "SERVER_ERROR"; message: string }
  | { ok: false; code: "DEMO_MODE"; message: string };

// Simple in-memory rate limiting: max 5 orders per phone per hour
// Note: In a real distributed app, use Redis or DB-based rate limiting.
const rateLimits = new Map<string, { count: number; expires: number }>();

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(phone);

  if (!limit || now > limit.expires) {
    rateLimits.set(phone, { count: 1, expires: now + 60 * 60 * 1000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count += 1;
  return true;
}

export async function submitCheckout(data: CheckoutFormValues): Promise<CheckoutResult> {
  try {
    // 1. Zod Validation
    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Invalid form data. Please check your inputs.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const {
      fullName,
      phone,
      email,
      addressLine,
      area,
      district,
      deliveryZone,
      paymentMethod,
      paymentReference,
      notes,
      items,
      botField,
    } = parsed.data;

    // 2. Honeypot check
    if (botField) {
      return { ok: false, code: "VALIDATION_ERROR", message: "Invalid request." };
    }

    // 3. Rate Limiting
    if (!checkRateLimit(phone)) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many orders placed from this phone number. Please try again later.",
      };
    }

    // 4. Supabase Admin Client
    const supabase = createAdminClient();
    if (!supabase) {
      return {
        ok: false,
        code: "DEMO_MODE",
        message: "Demo Mode: The database is not connected. Your order cannot be placed.",
      };
    }

    // 5. Call create_order RPC
    const shippingAddress = {
      address_line1: addressLine,
      area: area,
      city: district,
    };

    const rpcItems = items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity }));

    // p_customer_id is null since we are not doing auth yet
    const { data: result, error } = await supabase.rpc("create_order", {
      p_customer_id: null,
      p_customer_name: fullName,
      p_customer_email: email || "",
      p_customer_phone: phone,
      p_shipping_address: shippingAddress,
      p_delivery_zone: deliveryZone,
      p_payment_method: paymentMethod,
      p_payment_reference: paymentReference || null,
      p_coupon_code: null,
      p_items: rpcItems,
      p_notes: notes || null,
    });

    if (error) {
      console.error("[Checkout RPC Error]:", error.message);
      if (error.message.includes("Insufficient stock") || error.message.includes("not found")) {
        return {
          ok: false,
          code: "OUT_OF_STOCK",
          message: "One or more items in your cart are currently out of stock. Please update your cart.",
        };
      }
      return {
        ok: false,
        code: "SERVER_ERROR",
        message: "Failed to place order due to a server error. Please try again.",
      };
    }

    if (!result || result.length === 0) {
      return {
        ok: false,
        code: "SERVER_ERROR",
        message: "Failed to confirm order placement.",
      };
    }

    const { order_number, access_token } = result[0];

    return {
      ok: true,
      orderNumber: order_number,
      token: access_token,
    };
  } catch (err) {
    console.error("[Checkout Server Action Error]:", err);
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: "An unexpected error occurred.",
    };
  }
}

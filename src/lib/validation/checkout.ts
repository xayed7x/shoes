import { z } from "zod";
import { BD_DISTRICTS } from "../data/districts";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(val), {
      message: "Please enter a valid Bangladeshi mobile number (e.g. 017...)",
    }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  addressLine: z.string().min(5, "Address is required").max(200),
  area: z.string().min(2, "Area/Thana is required").max(100),
  district: z.enum(BD_DISTRICTS, {
    message: "Please select a valid district",
  }),
  deliveryZone: z.enum(["inside_dhaka", "outside_dhaka"] as const, {
    message: "Please select a valid delivery zone",
  }),
  paymentMethod: z.enum(["cod", "bkash", "nagad"]),
  paymentReference: z.string().max(50).optional(),
  notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1, "Variant ID is required"),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Your cart is empty"),
  botField: z.string().max(0, "Bot detected").optional(),
}).refine(
  (data) => {
    if (data.paymentMethod === "bkash" || data.paymentMethod === "nagad") {
      return data.paymentReference && data.paymentReference.trim().length >= 8;
    }
    return true;
  },
  {
    message: "Transaction ID is required for bKash/Nagad payments",
    path: ["paymentReference"],
  }
);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

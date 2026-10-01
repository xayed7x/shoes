/**
 * Soleil Luxury Footwear - Strict TypeScript Definitions
 */

// Shoe Size Type (EU standard used in Bangladesh)
export type EUShoeSize = '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46';

// Category Definitions
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  image_url?: string | null;
  created_at: string;
}

// Footwear Product Variant (Size & Optional Colorway)
export interface ProductVariant {
  id: string;
  product_id: string;
  size: EUShoeSize;
  color?: string | null;
  sku: string;
  stock: number;
  price_override?: number | null;
  created_at: string;
  updated_at?: string;
}

// Main Product Entity
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // In BDT (৳)
  compare_at_price?: number | null; // Original price for sale items
  category_id: string;
  category?: Category;
  images: string[];
  
  // Luxury Footwear Specific Attributes
  material?: string | null; // e.g. "Full-grain calfskin leather"
  care_instructions?: string | null; // e.g. "Apply natural balm monthly"
  is_handcrafted: boolean;
  
  // Merchandising flags
  is_featured: boolean;
  is_new: boolean; // Flag for "New Arrivals" collection
  
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

// Delivery Zones for Bangladesh
export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

// Customer Delivery Address
export interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  zone: DeliveryZone;
  postal_code?: string;
  notes?: string;
}

// Order & Payment Status Unions
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

// Order Item Line
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  size: EUShoeSize;
  color?: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image_url?: string | null;
}

// Order Entity
export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  grand_total: number;
  payment_method: PaymentMethod;
  payment_reference?: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_zone?: DeliveryZone | null;
  access_token?: string | null;
  notes?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Customer / Admin User Profile
export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string; // References auth.users ID in Supabase
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role: UserRole;
  default_address?: Address | null;
  created_at: string;
  updated_at?: string;
}

// Shopping Cart Item State
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// Coupon / Discount Code Entity
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // Percentage off (e.g. 15 for 15%) or flat BDT
  min_spend?: number | null;
  max_discount_amount?: number | null;
  expires_at?: string | null;
  is_active: boolean;
  created_at: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

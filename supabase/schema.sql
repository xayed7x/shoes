-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.store_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'Soleil Footwear'::text,
  store_phone text NOT NULL DEFAULT '+880 1700-000000'::text,
  currency text NOT NULL DEFAULT 'BDT'::text,
  shipping_fee_inside_dhaka numeric NOT NULL DEFAULT 60.00 CHECK (shipping_fee_inside_dhaka >= 0::numeric),
  shipping_fee_outside_dhaka numeric NOT NULL DEFAULT 120.00 CHECK (shipping_fee_outside_dhaka >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT store_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  compare_at_price numeric,
  category_id uuid,
  images ARRAY NOT NULL DEFAULT '{}'::text[],
  material text,
  care_instructions text,
  is_handcrafted boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  size character varying NOT NULL,
  color text,
  sku text NOT NULL UNIQUE,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price_override numeric CHECK (price_override >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'admin'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL DEFAULT 'Dhaka'::text,
  zone text NOT NULL CHECK (zone = ANY (ARRAY['inside_dhaka'::text, 'outside_dhaka'::text])),
  postal_code text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address jsonb NOT NULL,
  subtotal numeric NOT NULL CHECK (subtotal >= 0::numeric),
  discount_amount numeric NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0::numeric),
  shipping_fee numeric NOT NULL DEFAULT 60.00 CHECK (shipping_fee >= 0::numeric),
  grand_total numeric NOT NULL CHECK (grand_total >= 0::numeric),
  payment_method text NOT NULL DEFAULT 'cod'::text CHECK (payment_method = ANY (ARRAY['cod'::text, 'bkash'::text, 'nagad'::text, 'card'::text])),
  payment_status text NOT NULL DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text])),
  order_status text NOT NULL DEFAULT 'pending'::text CHECK (order_status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payment_reference text,
  delivery_zone text CHECK (delivery_zone = ANY (ARRAY['inside_dhaka'::text, 'outside_dhaka'::text])),
  access_token uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid,
  variant_id uuid,
  product_name text NOT NULL,
  size character varying NOT NULL,
  color text,
  unit_price numeric NOT NULL CHECK (unit_price >= 0::numeric),
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0::numeric),
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])),
  discount_value numeric NOT NULL CHECK (discount_value > 0::numeric),
  min_spend numeric DEFAULT 0.00,
  max_discount_amount numeric,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
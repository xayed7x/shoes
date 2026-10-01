-- Add new columns to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS delivery_zone TEXT CHECK (delivery_zone IN ('inside_dhaka', 'outside_dhaka')),
ADD COLUMN IF NOT EXISTS access_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Update payment_method constraint if necessary (though our schema.sql already allows 'cod','bkash','nagad','card')
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
-- ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('cod', 'bkash', 'nagad', 'card'));

-- Drop existing function to update its signature and return type
DROP FUNCTION IF EXISTS public.create_order(UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, JSONB, TEXT);

-- Recreate with new signature and behavior
CREATE OR REPLACE FUNCTION public.create_order(
    p_customer_id UUID,
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_shipping_address JSONB,
    p_delivery_zone TEXT,
    p_payment_method TEXT,
    p_payment_reference TEXT,
    p_coupon_code TEXT,
    p_items JSONB, -- Array of objects: [{"variant_id": "...", "quantity": 2}]
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    grand_total NUMERIC,
    access_token UUID
) AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_access_token UUID;
    v_subtotal NUMERIC(10, 2) := 0;
    v_discount NUMERIC(10, 2) := 0;
    v_shipping_fee NUMERIC(10, 2) := 60.00;
    v_grand_total NUMERIC(10, 2) := 0;
    v_item RECORD;
    v_variant RECORD;
    v_product RECORD;
    v_unit_price NUMERIC(10, 2);
    v_item_subtotal NUMERIC(10, 2);
    v_coupon RECORD;
    v_date_prefix TEXT;
    v_random_suffix TEXT;
    v_collision_check BOOLEAN;
BEGIN
    -- Determine delivery zone fee from store settings
    SELECT 
        CASE 
            WHEN p_delivery_zone = 'outside_dhaka' THEN shipping_fee_outside_dhaka
            ELSE shipping_fee_inside_dhaka
        END INTO v_shipping_fee
    FROM public.store_settings
    LIMIT 1;

    IF v_shipping_fee IS NULL THEN
        v_shipping_fee := 60.00;
    END IF;

    -- Generate unique order number (SOL-YYMMDD-XXXX)
    v_date_prefix := TO_CHAR(NOW(), 'YYMMDD');
    LOOP
        v_random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        v_order_number := 'SOL-' || v_date_prefix || '-' || v_random_suffix;
        
        -- Check collision
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE public.orders.order_number = v_order_number) INTO v_collision_check;
        EXIT WHEN NOT v_collision_check;
    END LOOP;

    v_order_id := gen_random_uuid();
    v_access_token := gen_random_uuid();

    -- Iterate and validate items, verify DB prices, check and decrement stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(variant_id UUID, quantity INT)
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than 0';
        END IF;

        -- Fetch variant and lock row for update to prevent race conditions
        SELECT * INTO v_variant 
        FROM public.product_variants 
        WHERE id = v_item.variant_id 
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant ID % not found', v_item.variant_id;
        END IF;

        IF v_variant.stock < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for variant ID % (Requested: %, Available: %)', 
                v_item.variant_id, v_item.quantity, v_variant.stock;
        END IF;

        -- Fetch parent product
        SELECT * INTO v_product 
        FROM public.products 
        WHERE id = v_variant.product_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Parent product for variant % not found', v_item.variant_id;
        END IF;

        -- Determine exact unit price directly from DB (never trust client)
        v_unit_price := COALESCE(v_variant.price_override, v_product.price);
        v_item_subtotal := v_unit_price * v_item.quantity;
        v_subtotal := v_subtotal + v_item_subtotal;

        -- Insert into order_items
        INSERT INTO public.order_items (
            order_id, product_id, variant_id, product_name, size, color, unit_price, quantity, subtotal, image_url
        ) VALUES (
            v_order_id, 
            v_product.id, 
            v_variant.id, 
            v_product.name, 
            v_variant.size, 
            v_variant.color, 
            v_unit_price, 
            v_item.quantity, 
            v_item_subtotal, 
            COALESCE(v_product.images[1], NULL)
        );

        -- Decrement stock atomically
        UPDATE public.product_variants
        SET stock = stock - v_item.quantity
        WHERE id = v_variant.id;
    END LOOP;

    -- Process coupon discount if provided
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
        SELECT * INTO v_coupon 
        FROM public.coupons 
        WHERE LOWER(code) = LOWER(TRIM(p_coupon_code)) 
          AND is_active = true 
          AND (expires_at IS NULL OR expires_at > NOW());

        IF FOUND THEN
            IF v_coupon.min_spend IS NULL OR v_subtotal >= v_coupon.min_spend THEN
                IF v_coupon.discount_type = 'percentage' THEN
                    v_discount := (v_subtotal * v_coupon.discount_value) / 100.0;
                    IF v_coupon.max_discount_amount IS NOT NULL AND v_discount > v_coupon.max_discount_amount THEN
                        v_discount := v_coupon.max_discount_amount;
                    END IF;
                ELSE
                    v_discount := v_coupon.discount_value;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Calculate grand total
    v_grand_total := (v_subtotal - v_discount) + v_shipping_fee;
    IF v_grand_total < 0 THEN
        v_grand_total := 0;
    END IF;

    -- Insert master order record
    INSERT INTO public.orders (
        id, order_number, customer_id, customer_name, customer_email, customer_phone,
        shipping_address, delivery_zone, subtotal, discount_amount, shipping_fee, grand_total,
        payment_method, payment_reference, payment_status, order_status, notes, access_token
    ) VALUES (
        v_order_id, v_order_number, p_customer_id, p_customer_name, p_customer_email, p_customer_phone,
        p_shipping_address, p_delivery_zone, v_subtotal, v_discount, v_shipping_fee, v_grand_total,
        p_payment_method, p_payment_reference, 'pending', 'pending', p_notes, v_access_token
    );

    RETURN QUERY SELECT v_order_id, v_order_number, v_grand_total, v_access_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.create_order FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_order FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_order FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_order TO service_role;

-- Reload the PostgREST schema cache so the API recognizes the new function signature immediately
NOTIFY pgrst, 'reload schema';

-- Verification Query
-- select p.oid::regprocedure, has_function_privilege('anon', p.oid, 'execute') as anon_can_run from pg_proc p where proname = 'create_order';

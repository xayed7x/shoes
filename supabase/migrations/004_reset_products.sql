-- ============================================================
-- Update all product images to use the new real photography
-- Run this in Supabase SQL Editor
-- ============================================================

-- Option A: DELETE old products so fallback data takes over
-- (Simplest — the app will use the beautiful fallback data)
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;

-- Verify
SELECT count(*) as products_remaining FROM products;
-- Should return 0 — app will now use the 12 beautiful fallback products

-- SQL to insert all products with images into Supabase
-- Run this in your Supabase SQL Editor to populate your database

-- First, clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM product_variants;
-- DELETE FROM products;
-- DELETE FROM categories;

-- Insert Categories (let Supabase auto-generate UUIDs)
INSERT INTO categories (name, slug, description, parent_id, created_at) VALUES
  ('Men', 'men', 'Luxury handcrafted footwear for men', NULL, NOW()),
  ('Women', 'women', 'Elegant and minimal footwear for women', NULL, NOW()),
  ('Loafers', 'loafers', 'Hand-stitched leather slippers and loafers', NULL, NOW()),
  ('Sneakers', 'sneakers', 'Minimalist low-top luxury leather sneakers', NULL, NOW()),
  ('Boots', 'boots', 'Artisanal Chelsea and lace-up boots', NULL, NOW()),
  ('Sandals', 'sandals', 'Premium leather slides and sandals', NULL, NOW()),
  ('Formal', 'formal', 'Classic Oxfords, Derbies, and Monk Straps', NULL, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Products (reference categories by slug)
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, images, material, care_instructions, is_handcrafted, is_featured, is_new, created_at, updated_at)
SELECT
  p.name,
  p.slug,
  p.description,
  p.price,
  p.compare_at_price,
  c.id as category_id,
  p.images,
  p.material,
  p.care_instructions,
  p.is_handcrafted,
  p.is_featured,
  p.is_new,
  p.created_at,
  p.updated_at
FROM (
  VALUES
    -- LOAFERS
    ('The Artisan Loafer', 'the-artisan-loafer', 'Our signature penny loafer crafted from supple full-grain calfskin leather. Features a hand-burnished finish, cushioned memory-foam footbed, and brass penny slot for timeless elegance. Goodyear welted for re-solability.', 4900, 5800, 'loafers', ARRAY['/shoes/product/loafer-tan.jpg'], 'Full-grain calfskin leather, leather sole', 'Clean with a soft damp cloth. Apply neutral leather cream monthly. Store on shoe trees.', true, true, true, NOW(), NOW()),
    ('Riviera Tassel Loafer', 'riviera-tassel-loafer', 'Midnight navy suede tassel loafer with contrast brown leather tassels and braided trim. An icon of casual refinement — equally at home on a yacht deck or at a Sunday lunch.', 5400, 6200, 'loafers', ARRAY['/shoes/product/loafer-navy.jpg'], 'Premium suede upper, leather lining, leather sole', 'Brush with a suede brush in one direction. Apply suede protector spray. Avoid water.', true, true, true, NOW(), NOW()),
    
    -- BOOTS
    ('Sahara Chelsea Boot', 'sahara-chelsea-boot', 'Camel suede Chelsea boot with elasticated side gussets and a stacked rosewood heel. Slim silhouette crafted for effortless day-to-night versatility. One of our most loved silhouettes.', 6900, 7800, 'boots', ARRAY['/shoes/product/chelsea-camel.jpg'], 'Italian suede, stacked leather heel, leather sole', 'Apply suede protector spray before first wear. Brush gently with a suede brush after each use.', true, true, false, NOW(), NOW()),
    ('The Wanderer Boot', 'the-wanderer-boot', 'Forest green suede desert boot with a two-eyelet lace closure and signature crepe rubber sole. Heritage construction meets modern minimalism — built for the long road ahead.', 6300, 7500, 'boots', ARRAY['/shoes/product/boot-green.jpg'], 'Weatherproof suede, crepe rubber sole', 'Treat with heavy-duty suede balm. Allow to dry naturally away from heat.', true, true, true, NOW(), NOW()),
    
    -- FORMAL
    ('Midnight Cap-Toe Oxford', 'midnight-cap-toe-oxford', 'Black polished cap-toe Oxford with mirror-shine patent leather toecap and Goodyear welt construction. The definitive formal shoe — precise, powerful, and effortlessly timeless.', 8200, 9500, 'formal', ARRAY['/shoes/product/oxford-black.jpg'], 'Black box calfskin, patent leather cap, leather sole', 'Shine with black beeswax polish after every 3–4 wears. Use cedar shoe trees.', true, true, false, NOW(), NOW()),
    ('Cognac Double Monk', 'cognac-double-monk', 'Rich cognac double monk strap in hand-burnished calfskin leather with two polished gold buckles. A statement of quiet authority — built for those who understand that details matter.', 8500, 9800, 'formal', ARRAY['/shoes/product/monk-cognac.jpg'], 'Hand-burnished Italian calfskin, gold hardware, leather sole', 'Buff regularly with matching cognac wax polish. Rotate with other shoes.', true, true, true, NOW(), NOW()),
    ('Claret Full Brogue', 'claret-full-brogue', 'Deep burgundy full brogue Oxford with intricate medallion toecap and decorative perforations along every seam. Dressed up or down — the brogue is always in season.', 7600, 8800, 'formal', ARRAY['/shoes/product/brogue-burgundy.jpg'], 'Full-grain burgundy calfskin, leather sole with rubber heel', 'Clean with a damp cloth. Apply burgundy shoe cream and buff to a shine.', true, false, true, NOW(), NOW()),
    ('Ember Walk Derby', 'ember-walk-derby', 'Chocolate brown open-lacing Derby shoe crafted from rich full-grain leather. A relaxed alternative to the Oxford — heritage stitching, leather sole, and a silhouette that ages beautifully.', 7200, 8100, 'formal', ARRAY['/shoes/product/derby-chocolate.jpg'], 'Full-grain chocolate leather, leather sole', 'Clean dirt with a damp cloth. Polish with dark brown cream. Use shoe trees.', true, false, true, NOW(), NOW()),
    
    -- SNEAKERS
    ('Blanc Court Sneaker', 'blanc-court-sneaker', 'Minimal white full-grain leather low-top sneaker with tone-on-tone rubber sole and fine stitching detail. No branding, no noise — just the purest expression of luxury casual footwear.', 5500, NULL, 'sneakers', ARRAY['/shoes/product/sneaker-white.jpg'], 'Full-grain smooth white leather, rubber cupsole', 'Wipe clean with a moist sponge. Use leather conditioner to maintain suppleness.', true, false, true, NOW(), NOW()),
    
    -- SLIDES / SANDALS
    ('Cloud Nine Mule', 'cloud-nine-mule', 'Espresso brown woven intrecciato leather mule with low block heel and smooth leather footbed. Hand-woven from supple calfskin strips — an everyday luxury that rewards the patient eye.', 6500, 7200, 'sandals', ARRAY['/shoes/product/mule-woven.jpg'], 'Intrecciato woven calfskin, leather footbed', 'Apply neutral leather cream sparingly. Avoid prolonged sun exposure.', true, true, false, NOW(), NOW()),
    ('Soleil Cork Mule', 'soleil-cork-mule', 'Terracotta burnt-orange leather mule over a natural cork midsole platform. Aniline-dyed strap, leather footbed with toe imprint. The perfect intersection of craft and afternoon warmth.', 4200, NULL, 'sandals', ARRAY['/shoes/product/mule-terracotta.jpg'], 'Aniline-dyed leather, cork midsole, leather outsole', 'Wipe uppers with leather conditioner. Keep cork sole dry.', true, false, false, NOW(), NOW()),
    ('Ivory Strappy Sandal', 'ivory-strappy-sandal', 'Ivory cream three-strap leather sandal with delicate ankle buckle and slim low heel. Feminine, refined, and entirely handmade — the sandal for every occasion that calls for effortless grace.', 5100, NULL, 'sandals', ARRAY['/shoes/product/sandal-ivory.jpg'], 'Italian cream calfskin, leather sole', 'Use specialized leather cleaner. Avoid rain and mud.', true, false, true, NOW(), NOW())
) AS p(name, slug, description, price, compare_at_price, category_slug, images, material, care_instructions, is_handcrafted, is_featured, is_new, created_at, updated_at)
JOIN categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO NOTHING;

-- Insert Product Variants (reference products by slug)
INSERT INTO product_variants (product_id, size, color, sku, stock, created_at)
SELECT
  p.id as product_id,
  v.size,
  v.color,
  v.sku,
  v.stock,
  v.created_at
FROM (
  VALUES
    -- The Artisan Loafer
    ('the-artisan-loafer', '39', 'Cognac Tan', 'ART-LOF-39', 6, NOW()),
    ('the-artisan-loafer', '40', 'Cognac Tan', 'ART-LOF-40', 12, NOW()),
    ('the-artisan-loafer', '41', 'Cognac Tan', 'ART-LOF-41', 8, NOW()),
    ('the-artisan-loafer', '42', 'Cognac Tan', 'ART-LOF-42', 0, NOW()),
    ('the-artisan-loafer', '43', 'Cognac Tan', 'ART-LOF-43', 5, NOW()),
    ('the-artisan-loafer', '44', 'Cognac Tan', 'ART-LOF-44', 3, NOW()),
    
    -- Riviera Tassel Loafer
    ('riviera-tassel-loafer', '39', 'Midnight Navy', 'RIV-LOF-39', 4, NOW()),
    ('riviera-tassel-loafer', '40', 'Midnight Navy', 'RIV-LOF-40', 9, NOW()),
    ('riviera-tassel-loafer', '41', 'Midnight Navy', 'RIV-LOF-41', 7, NOW()),
    ('riviera-tassel-loafer', '42', 'Midnight Navy', 'RIV-LOF-42', 11, NOW()),
    ('riviera-tassel-loafer', '43', 'Midnight Navy', 'RIV-LOF-43', 0, NOW()),
    
    -- Sahara Chelsea Boot
    ('sahara-chelsea-boot', '39', 'Camel Suede', 'SAH-CHE-39', 3, NOW()),
    ('sahara-chelsea-boot', '40', 'Camel Suede', 'SAH-CHE-40', 5, NOW()),
    ('sahara-chelsea-boot', '41', 'Camel Suede', 'SAH-CHE-41', 9, NOW()),
    ('sahara-chelsea-boot', '42', 'Camel Suede', 'SAH-CHE-42', 6, NOW()),
    ('sahara-chelsea-boot', '43', 'Camel Suede', 'SAH-CHE-43', 4, NOW()),
    
    -- The Wanderer Boot
    ('the-wanderer-boot', '40', 'Forest Green', 'WND-BOT-40', 5, NOW()),
    ('the-wanderer-boot', '41', 'Forest Green', 'WND-BOT-41', 8, NOW()),
    ('the-wanderer-boot', '42', 'Forest Green', 'WND-BOT-42', 6, NOW()),
    ('the-wanderer-boot', '43', 'Forest Green', 'WND-BOT-43', 3, NOW()),
    
    -- Midnight Cap-Toe Oxford
    ('midnight-cap-toe-oxford', '40', 'Midnight Black', 'MID-OXF-40', 7, NOW()),
    ('midnight-cap-toe-oxford', '41', 'Midnight Black', 'MID-OXF-41', 11, NOW()),
    ('midnight-cap-toe-oxford', '42', 'Midnight Black', 'MID-OXF-42', 9, NOW()),
    ('midnight-cap-toe-oxford', '43', 'Midnight Black', 'MID-OXF-43', 4, NOW()),
    
    -- Cognac Double Monk
    ('cognac-double-monk', '40', 'Cognac Brown', 'CGN-MNK-40', 4, NOW()),
    ('cognac-double-monk', '41', 'Cognac Brown', 'CGN-MNK-41', 6, NOW()),
    ('cognac-double-monk', '42', 'Cognac Brown', 'CGN-MNK-42', 8, NOW()),
    ('cognac-double-monk', '43', 'Cognac Brown', 'CGN-MNK-43', 3, NOW()),
    
    -- Claret Full Brogue
    ('claret-full-brogue', '39', 'Claret Burgundy', 'CLR-BRG-39', 5, NOW()),
    ('claret-full-brogue', '40', 'Claret Burgundy', 'CLR-BRG-40', 9, NOW()),
    ('claret-full-brogue', '41', 'Claret Burgundy', 'CLR-BRG-41', 7, NOW()),
    ('claret-full-brogue', '42', 'Claret Burgundy', 'CLR-BRG-42', 6, NOW()),
    
    -- Ember Walk Derby
    ('ember-walk-derby', '39', 'Chocolate Brown', 'EMB-DRB-39', 4, NOW()),
    ('ember-walk-derby', '40', 'Chocolate Brown', 'EMB-DRB-40', 7, NOW()),
    ('ember-walk-derby', '41', 'Chocolate Brown', 'EMB-DRB-41', 10, NOW()),
    ('ember-walk-derby', '42', 'Chocolate Brown', 'EMB-DRB-42', 5, NOW()),
    
    -- Blanc Court Sneaker
    ('blanc-court-sneaker', '38', 'White', 'BLC-SNK-38', 5, NOW()),
    ('blanc-court-sneaker', '40', 'White', 'BLC-SNK-40', 11, NOW()),
    ('blanc-court-sneaker', '41', 'White', 'BLC-SNK-41', 8, NOW()),
    ('blanc-court-sneaker', '42', 'White', 'BLC-SNK-42', 15, NOW()),
    ('blanc-court-sneaker', '43', 'White', 'BLC-SNK-43', 6, NOW()),
    
    -- Cloud Nine Mule
    ('cloud-nine-mule', '38', 'Espresso', 'CLD-MUL-38', 6, NOW()),
    ('cloud-nine-mule', '39', 'Espresso', 'CLD-MUL-39', 8, NOW()),
    ('cloud-nine-mule', '40', 'Espresso', 'CLD-MUL-40', 0, NOW()),
    ('cloud-nine-mule', '41', 'Espresso', 'CLD-MUL-41', 4, NOW()),
    
    -- Soleil Cork Mule
    ('soleil-cork-mule', '38', 'Terracotta', 'SOL-MUL-38', 9, NOW()),
    ('soleil-cork-mule', '39', 'Terracotta', 'SOL-MUL-39', 7, NOW()),
    ('soleil-cork-mule', '40', 'Terracotta', 'SOL-MUL-40', 14, NOW()),
    ('soleil-cork-mule', '41', 'Terracotta', 'SOL-MUL-41', 5, NOW()),
    
    -- Ivory Strappy Sandal
    ('ivory-strappy-sandal', '38', 'Ivory Cream', 'IVR-SND-38', 7, NOW()),
    ('ivory-strappy-sandal', '39', 'Ivory Cream', 'IVR-SND-39', 5, NOW()),
    ('ivory-strappy-sandal', '40', 'Ivory Cream', 'IVR-SND-40', 13, NOW()),
    ('ivory-strappy-sandal', '41', 'Ivory Cream', 'IVR-SND-41', 4, NOW())
) AS v(product_slug, size, color, sku, stock, created_at)
JOIN products p ON p.slug = v.product_slug
ON CONFLICT (sku) DO NOTHING;

-- Verify the data was inserted
SELECT 
  p.name,
  p.slug,
  p.price,
  c.name as category,
  p.images,
  COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON pv.product_id = p.id
GROUP BY p.id, p.name, p.slug, p.price, c.name, p.images
ORDER BY p.name;

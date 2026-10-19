-- ============================================================
-- Style Secrets — Initial Seed Data
-- Run this in your Supabase SQL Editor after running 001_initial_schema.sql
-- ============================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, name_bn, slug, description, image_url, sort_order, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Salwar Kameez', 'সালোয়ার কামিজ', 'salwar-kameez', 'Festive and daily wear designer salwar kameez sets', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 1, true),
    ('c2222222-2222-2222-2222-222222222222', 'Kurtis & Tunics', 'কুর্তি ও টিউনিক', 'kurtis-tunics', 'Single designer kurtis and formal tops', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', 2, true),
    ('c3333333-3333-3333-3333-333333333333', 'Sarees', 'শাড়ি', 'sarees', 'Jamdani, Silk, Katan and festive party sarees', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80', 3, true),
    ('c4444444-4444-4444-4444-444444444444', 'Abayas & Hijabs', 'আবায়া ও হিজাব', 'abayas-hijabs', 'Modest luxury imported abayas and chiffon hijabs', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80', 4, true),
    ('c5555555-5555-5555-5555-555555555555', 'Western Wear', 'ওয়েস্টার্ন পোশাক', 'western-wear', 'Modern coordinate sets, shirts and trousers', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Payment Settings
INSERT INTO public.payment_settings (method, is_enabled, account_number, account_type, instructions, sort_order)
VALUES
    ('cod', true, '+8801700000000', 'Cash on Delivery', 'Pay cash directly to the courier delivery agent upon receiving your parcel. Please keep exact change ready.', 1),
    ('bkash', true, '01711223344', 'Merchant (Make Payment)', '1. Dial *247# or open bKash App\n2. Select "Make Payment"\n3. Enter Merchant No: 01711223344\n4. Enter total amount\n5. Enter reference: Order number\n6. Enter TrxID during checkout', 2),
    ('nagad', true, '01811223344', 'Merchant', '1. Dial *167# or open Nagad App\n2. Select "Merchant Pay"\n3. Enter Merchant No: 01811223344\n4. Enter amount and reference\n5. Enter TrxID in confirmation', 3),
    ('rocket', true, '019112233445', 'Merchant', '1. Open Rocket App\n2. Select Merchant Payment\n3. Enter Account No: 019112233445\n4. Input order number reference', 4)
ON CONFLICT (method) DO NOTHING;

-- 3. Insert Service Cards
INSERT INTO public.service_cards (title, description, icon, sort_order, is_active)
VALUES
    ('Free Delivery', 'On orders over ৳1500 across Bangladesh', 'Truck', 1, true),
    ('100% Secure Payment', 'Verified bKash & Cash on Delivery', 'ShieldCheck', 2, true),
    ('7-Day Easy Returns', 'Hassle-free exchange guarantee', 'RotateCcw', 3, true),
    ('24/7 Dedicated Support', 'Always here to assist via WhatsApp', 'Headphones', 4, true)
ON CONFLICT DO NOTHING;

-- 4. Insert Hero Slides
INSERT INTO public.hero_slides (title, subtitle, description, image_url, button_text, button_link, sort_order, is_active)
VALUES
    ('Spring Festive Luxe 2026', 'NEW ARRIVALS & FESTIVE COLLECTION', 'Discover handcrafted pure fabrics adorned with regal zari embroidery and delicate organza dupattas.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80', 'Explore Collection', '/categories/salwar-kameez', 1, true),
    ('The Royal Jamdani Edition', 'HERITAGE HANDLOOM WEAVES', 'Timeless luxury handwoven Jamdani sarees crafted by master weavers of Narayanganj.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=80', 'View Sarees', '/categories/sarees', 2, true),
    ('Modern Modest Elegance', 'IMPORTED NIDHA ABAYAS & CHIFFON', 'Understated refinement designed for contemporary grace and comfortable daily wear.', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80', 'Shop Abayas', '/categories/abayas-hijabs', 3, true)
ON CONFLICT DO NOTHING;

-- 5. Insert Promo Banners
INSERT INTO public.promo_banners (title, subtitle, description, image_url, button_text, button_link, discount_text, sort_order, is_active)
VALUES
    ('Mid-Season Kurti Fest', 'Up to 30% Off Selected Styles', 'Limited period offer on all premium office and festive kurtis.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'Shop Kurtis', '/categories/kurtis-tunics', 'Flat 30% OFF', 1, true),
    ('Free Delivery Across Dhaka', 'On orders over ৳1,500', 'Fast doorstep delivery with try-and-check service available.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', 'Start Shopping', '/products', 'FREE SHIPPING', 2, true)
ON CONFLICT DO NOTHING;

-- 6. Insert Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active)
VALUES
    ('STYLE10', 'Welcome 10% discount on entire cart', 'percentage', 10, 1000, 500, 500, true),
    ('FLAT200', 'Flat ৳200 discount for orders above ৳2000', 'fixed', 200, 2000, NULL, 200, true),
    ('EID2026', 'Festive Eid Special 15% discount', 'percentage', 15, 3000, 1500, 1000, true)
ON CONFLICT (code) DO NOTHING;

-- 7. Insert Initial Products
INSERT INTO public.products (id, name, slug, sku, description, short_description, regular_price, sale_price, is_variable, is_featured, is_new, status, category_id, featured_image_url, avg_rating, review_count, total_stock)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        'Premium Georgette Three Piece with Heavy Zari Work',
        'premium-georgette-three-piece',
        'SS-SK-001',
        'Graceful pure georgette kameez with intricate gold zari and sequin embroidery along the neckline and hem. Includes pure santoon inner & salwar, paired with a digital printed lightweight organza dupatta.',
        'Luxury festive 3-piece set with handcrafted dupatta',
        3850,
        3490,
        true,
        true,
        true,
        'published',
        'c1111111-1111-1111-1111-111111111111',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        4.8,
        24,
        45
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'Royal Dhakai Jamdani Handloom Festive Saree',
        'royal-dhakai-jamdani-saree',
        'SS-SR-001',
        'Authentic 100-count handwoven Jamdani cotton-silk saree featuring traditional floral jaal motifs and an ornate pallu. Breathable, featherlight, and royal.',
        'Pure Dhakai Jamdani traditional handloom saree',
        6800,
        6490,
        false,
        true,
        false,
        'published',
        'c3333333-3333-3333-3333-333333333333',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        4.9,
        38,
        18
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'Designer Embroidered Cotton Kurti with Palazzo',
        'designer-embroidered-cotton-kurti',
        'SS-KT-001',
        '100% fine combed cotton kurti with delicate pastel thread embroidery on yolk. Comes with a matching flared palazzo with elasticated waistband.',
        'Daily & semi-formal comfortable cotton ensemble',
        2150,
        1850,
        true,
        false,
        true,
        'published',
        'c2222222-2222-2222-2222-222222222222',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        4.7,
        19,
        28
    )
ON CONFLICT (slug) DO NOTHING;

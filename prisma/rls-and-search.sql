-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Execute este script en Supabase SQL Editor
-- DESPUÉS de ejecutar: npx prisma db push

-- ============================================
-- 1. USERS TABLE
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid()::text = auth_id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid()::text = auth_id);

-- Users can insert their own data (on signup)
CREATE POLICY "Users can insert own data"
ON users FOR INSERT
WITH CHECK (auth.uid()::text = auth_id);

-- ============================================
-- 2. ADDRESSES TABLE
-- ============================================

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
ON addresses FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = addresses.user_id
));

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
ON addresses FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = addresses.user_id
));

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
ON addresses FOR UPDATE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = addresses.user_id
));

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
ON addresses FOR DELETE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = addresses.user_id
));

-- ============================================
-- 3. PETS TABLE
-- ============================================

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Users can view their own pets
CREATE POLICY "Users can view own pets"
ON pets FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = pets.user_id
));

-- Users can insert their own pets
CREATE POLICY "Users can insert own pets"
ON pets FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = pets.user_id
));

-- Users can update their own pets
CREATE POLICY "Users can update own pets"
ON pets FOR UPDATE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = pets.user_id
));

-- Users can delete their own pets
CREATE POLICY "Users can delete own pets"
ON pets FOR DELETE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = pets.user_id
));

-- ============================================
-- 4. PRODUCTS & CATEGORIES (PUBLIC READ)
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories (public)
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
USING (true);

-- Everyone can read active products (public)
CREATE POLICY "Active products are viewable by everyone"
ON products FOR SELECT
USING (status = 'ACTIVE' AND deleted_at IS NULL);

-- ============================================
-- 5. CART ITEMS
-- ============================================

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
ON cart_items FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = cart_items.user_id
));

-- Users can insert to their own cart
CREATE POLICY "Users can insert to own cart"
ON cart_items FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = cart_items.user_id
));

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
ON cart_items FOR UPDATE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = cart_items.user_id
));

-- Users can delete from their own cart
CREATE POLICY "Users can delete from own cart"
ON cart_items FOR DELETE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = cart_items.user_id
));

-- ============================================
-- 6. WISHLIST ITEMS
-- ============================================

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
ON wishlist_items FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = wishlist_items.user_id
));

-- Users can insert to their own wishlist
CREATE POLICY "Users can insert to own wishlist"
ON wishlist_items FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = wishlist_items.user_id
));

-- Users can delete from their own wishlist
CREATE POLICY "Users can delete from own wishlist"
ON wishlist_items FOR DELETE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = wishlist_items.user_id
));

-- ============================================
-- 7. ORDERS
-- ============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = orders.user_id
));

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = orders.user_id
));

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
ON orders FOR UPDATE
USING (
  auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = orders.user_id
  )
  AND status = 'PENDING'
);

-- Users can view their own order items
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()::text
    )
  )
);

-- ============================================
-- 8. REVIEWS
-- ============================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (deleted_at IS NULL);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = reviews.user_id
));

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = reviews.user_id
));

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = reviews.user_id
));

-- ============================================
-- 9. SUBSCRIPTIONS
-- ============================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = subscriptions.user_id
));

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = subscriptions.user_id
));

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
ON subscriptions FOR UPDATE
USING (auth.uid()::text IN (
  SELECT auth_id FROM users WHERE id = subscriptions.user_id
));

-- Users can cancel their own subscriptions
CREATE POLICY "Users can cancel own subscriptions"
ON subscriptions FOR UPDATE
USING (
  auth.uid()::text IN (
    SELECT auth_id FROM users WHERE id = subscriptions.user_id
  )
);

-- ============================================
-- FULL-TEXT SEARCH INDEXES
-- ============================================

-- Create text search configurations
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================
-- 1. PRODUCTS FULL-TEXT SEARCH
-- ============================================

-- Add tsvector column for full-text search
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index on search vector
CREATE INDEX IF NOT EXISTS products_search_idx 
ON products USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.name, ''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.description, ''))), 'B') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.short_desc, ''))), 'C') ||
    setweight(to_tsvector('spanish', unaccent(array_to_string(NEW.tags, ' '))), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search vector
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- Update existing products
UPDATE products SET search_vector = 
  setweight(to_tsvector('spanish', unaccent(coalesce(name, ''))), 'A') ||
  setweight(to_tsvector('spanish', unaccent(coalesce(description, ''))), 'B') ||
  setweight(to_tsvector('spanish', unaccent(coalesce(short_desc, ''))), 'C') ||
  setweight(to_tsvector('spanish', unaccent(array_to_string(tags, ' '))), 'D');

-- Create trigram index for fuzzy search
CREATE INDEX IF NOT EXISTS products_name_trgm_idx 
ON products USING GIN(name gin_trgm_ops);

-- ============================================
-- 2. CATEGORIES FULL-TEXT SEARCH
-- ============================================

-- Add tsvector column
ALTER TABLE categories ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index
CREATE INDEX IF NOT EXISTS categories_search_idx 
ON categories USING GIN(search_vector);

-- Create function
CREATE OR REPLACE FUNCTION categories_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.name, ''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.description, ''))), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS categories_search_vector_trigger ON categories;
CREATE TRIGGER categories_search_vector_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION categories_search_vector_update();

-- Update existing
UPDATE categories SET search_vector = 
  setweight(to_tsvector('spanish', unaccent(coalesce(name, ''))), 'A') ||
  setweight(to_tsvector('spanish', unaccent(coalesce(description, ''))), 'B');

-- ============================================
-- 3. REVIEWS FULL-TEXT SEARCH
-- ============================================

-- Add tsvector column
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index
CREATE INDEX IF NOT EXISTS reviews_search_idx 
ON reviews USING GIN(search_vector);

-- Create function
CREATE OR REPLACE FUNCTION reviews_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(NEW.comment, ''))), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS reviews_search_vector_trigger ON reviews;
CREATE TRIGGER reviews_search_vector_trigger
  BEFORE INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION reviews_search_vector_update();

-- Update existing
UPDATE reviews SET search_vector = 
  setweight(to_tsvector('spanish', unaccent(coalesce(title, ''))), 'A') ||
  setweight(to_tsvector('spanish', unaccent(coalesce(comment, ''))), 'B');

-- ============================================
-- HELPER FUNCTIONS FOR SEARCH
-- ============================================

-- Function to search products
CREATE OR REPLACE FUNCTION search_products(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price float,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::uuid,
    p.name::text,
    p.description::text,
    p.price::float,
    ts_rank(p.search_vector, websearch_to_tsquery('spanish', unaccent(search_query))) as rank
  FROM products p
  WHERE 
    p.search_vector @@ websearch_to_tsquery('spanish', unaccent(search_query))
    AND p.status = 'ACTIVE'
    AND p.deleted_at IS NULL
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Function for fuzzy search (typos)
CREATE OR REPLACE FUNCTION fuzzy_search_products(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  similarity real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::uuid,
    p.name::text,
    similarity(p.name, search_query) as sim
  FROM products p
  WHERE 
    p.name % search_query
    AND p.status = 'ACTIVE'
    AND p.deleted_at IS NULL
  ORDER BY sim DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PERFORMANCE VIEWS
-- ============================================

-- View for popular products
CREATE OR REPLACE VIEW popular_products AS
SELECT 
  p.*,
  COUNT(DISTINCT oi.order_id) as order_count,
  AVG(r.rating) as avg_rating,
  COUNT(DISTINCT r.id) as review_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN reviews r ON p.id = r.product_id AND r.deleted_at IS NULL
WHERE p.status = 'ACTIVE' AND p.deleted_at IS NULL
GROUP BY p.id
ORDER BY order_count DESC, avg_rating DESC;

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.tier,
  u.points,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total), 0) as total_spent,
  COUNT(DISTINCT p.id) as total_pets,
  COUNT(DISTINCT s.id) as active_subscriptions
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.deleted_at IS NULL
LEFT JOIN pets p ON u.id = p.user_id AND p.deleted_at IS NULL
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'ACTIVE' AND s.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies created successfully!';
  RAISE NOTICE '✅ Full-text search indexes created!';
  RAISE NOTICE '✅ Helper functions created!';
  RAISE NOTICE '✅ Performance views created!';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Test search with: SELECT * FROM search_products(''comida perro'');';
  RAISE NOTICE '📊 View popular products: SELECT * FROM popular_products LIMIT 10;';
  RAISE NOTICE '👤 View user stats: SELECT * FROM user_stats WHERE email = ''test@example.com'';';
END $$;

-- 管理者
INSERT INTO admins (name, email, password, role, is_deleted, created_at, updated_at)
VALUES (
  'システム管理者',
  'admin@example.com',
  '$2a$10$awv0Pxsga2h9oRBGqLgdhurECJBXOt.j4oDkv.xVa8.4TeMqTBIkq',
  'SUPER_ADMIN',
  FALSE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ユーザー
INSERT INTO users (name, email, password, phone, address, is_deleted, created_at, updated_at)
VALUES (
  'TESTユーザー',
  'test@test.com',
  '$2a$10$awv0Pxsga2h9oRBGqLgdhurECJBXOt.j4oDkv.xVa8.4TeMqTBIkq',
  '080-1234-5678',
  '東京都新宿区1-1-1',
  FALSE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- カテゴリー
INSERT INTO categories (name, is_deleted, created_at, updated_at) VALUES
('トップス', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ボトムス', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('シューズ', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('アクセサリー', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 商品
INSERT INTO products (sku, name, description, price, stock, is_published, is_deleted, created_at, updated_at) VALUES
('SKU001', 'シンプルTシャツ', '着心地の良いTシャツ', 2500, 100, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SKU002', 'デニムパンツ', '丈夫なデニム素材のパンツ', 4800, 50, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 商品カテゴリー紐付け
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1),  -- シンプルTシャツ → トップス
(2, 2);  -- デニムパンツ → ボトムス

-- 商品画像
INSERT INTO product_images (product_id, image_url, sort_order, created_at, updated_at) VALUES
(1, 'uploads/images/products/test1.svg', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'uploads/images/products/test2.svg', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- カート
INSERT INTO carts (user_id, is_deleted, created_at, updated_at)
VALUES (1, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


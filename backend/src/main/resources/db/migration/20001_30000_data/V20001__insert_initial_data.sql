INSERT INTO admins (name, email, password, role, is_deleted, created_at, updated_at)
VALUES (
  'システム管理者',
  'admin@example.com',
  '$2a$10$Yw93uTx1UFH3pLLRL2iJ6OAxh8peN1e.W5Ed8Zx.FbJP26e4YxKT6',
  'SUPER_ADMIN',
  FALSE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);


INSERT INTO categories (name, is_deleted, created_at, updated_at) VALUES
('トップス', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ボトムス', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('シューズ', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('アクセサリー', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO products (sku, name, description, price, stock, is_published, is_deleted, created_at, updated_at) VALUES
('SKU001', 'シンプルTシャツ', '着心地の良いTシャツ', 2500, 100, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SKU002', 'デニムパンツ', '丈夫なデニム素材のパンツ', 4800, 50, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1),  -- シンプルTシャツ → トップス
(2, 2);  -- デニムパンツ → ボトムス


INSERT INTO product_images (product_id, image_url, sort_order, created_at, updated_at) VALUES
(1, 'https://example.com/images/tshirt.jpg', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'https://example.com/images/denim.jpg', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

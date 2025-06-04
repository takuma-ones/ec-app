CREATE TABLE product_categories (
  PRIMARY KEY (product_id, category_id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

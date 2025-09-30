CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- DROP TABLE IF EXISTS
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS products;

-- products 테이블
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    image TEXT,
    description TEXT,
    category TEXT,
    tag VARCHAR(10)
);

-- 인덱스
CREATE UNIQUE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_products_name_lower_prefix ON products (lower(name) text_pattern_ops);

-- price_history 테이블
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price INT NOT NULL,
    discount DECIMAL DEFAULT 0,
    record_date DATE NOT NULL
);

-- 인덱스
CREATE INDEX idx_price_history_product_record_date ON price_history(product_id, record_date DESC);




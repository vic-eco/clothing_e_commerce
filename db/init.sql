
-- DROP TABLES

DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_variant CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS size CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;


-- USERS

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);


-- ADDRESSES

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(200) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE
);


-- CATEGORIES

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


-- PRODUCTS

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    material VARCHAR(50),
    gender VARCHAR(10) CHECK (gender IN ('male','female','unisex')),
    category_id INT REFERENCES category(id) ON DELETE SET NULL
);


-- SIZE

CREATE TABLE size (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) UNIQUE NOT NULL
);


-- PRODUCT VARIANTS

CREATE TABLE product_variant (
    id SERIAL PRIMARY KEY,
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(6,2) NOT NULL,
    color VARCHAR(50) NOT NULL,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    size_id INT REFERENCES size(id) ON DELETE SET NULL,
    UNIQUE(color, product_id, size_id)
);


-- CART

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    cart_id INT REFERENCES cart(id) ON DELETE CASCADE,
    product_variant_id INT REFERENCES product_variant(id) ON DELETE CASCADE,
    UNIQUE(cart_id, product_variant_id)
);


-- ORDERS

CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'pending',
    total_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(6,2) NOT NULL,
    order_id INT REFERENCES "order"(id) ON DELETE CASCADE,
    product_variant_id INT REFERENCES product_variant(id) ON DELETE CASCADE,
    UNIQUE(order_id, product_variant_id)
);

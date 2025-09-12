-- USERS

INSERT INTO "user" (email, password, first_name, last_name)
VALUES 
('john.doe@example.com', 'hashedpassword123', 'John', 'Doe'),
('mike.doe@example.com', 'password123', 'Mike', 'Doe');

-- CATEGORIES

INSERT INTO category (name)
VALUES 
('T-Shirts');

-- PRODUCTS

INSERT INTO product (name, description, material, gender, category_id)
VALUES
('Classic T-Shirt', 'A timeless cotton t-shirt for everyday wear.', 'Cotton', 'unisex', 1),
('Graphic T-Shirt', 'Trendy t-shirt with modern graphic prints.', 'Cotton', 'unisex', 1);

-- SIZES

INSERT INTO size (label)
VALUES 
('S'), 
('M'), 
('L'), 
('XL');

-- PRODUCT VARIANTS (Classic T-Shirt)

INSERT INTO product_variant (stock, price, color, product_id, size_id)
VALUES
(100, 19.99, 'White', 1, 1),
(80, 19.99, 'White', 1, 2),
(60, 19.99, 'White', 1, 3),
(40, 19.99, 'White', 1, 4),
(90, 21.99, 'Black', 1, 1),
(70, 21.99, 'Black', 1, 2),
(50, 21.99, 'Black', 1, 3),
(30, 21.99, 'Black', 1, 4);

-- PRODUCT VARIANTS (Graphic T-Shirt)

INSERT INTO product_variant (stock, price, color, product_id, size_id)
VALUES
(120, 24.99, 'Blue', 2, 1),
(100, 24.99, 'Blue', 2, 2),
(80, 24.99, 'Blue', 2, 3),
(60, 24.99, 'Blue', 2, 4),
(110, 26.99, 'Red', 2, 1),
(90, 26.99, 'Red', 2, 2),
(70, 26.99, 'Red', 2, 3),
(50, 26.99, 'Red', 2, 4);
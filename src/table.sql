DROP TABLE IF EXISTS users CASCADE;  -- Xóa bảng nếu tồn tại

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL DEFAULT '',
    lastname TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT NOT NULL DEFAULT '',
    roles TEXT[] NOT NULL DEFAULT ARRAY['USER'],
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    rate INT NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO products (name, price, description, images, category, brand, rate, stock, is_active)
VALUES 
('Wireless Mouse', 29.99, 'Ergonomic wireless mouse with 2.4GHz connectivity.', ARRAY['mouse1.jpg', 'mouse2.jpg', 'mouse3.jpg', 'mouse4.jpg'], 'Electronics', 'Logitech', 3, 50, true),
('Mechanical Keyboard', 89.99, 'RGB backlit mechanical keyboard with brown switches.', ARRAY['keyboard1.jpg', 'keyboard2.jpg', 'keyboard3.jpg', 'keyboard4.jpg'], 'Electronics', 'Keychron', 4, 30, true),
('Smartphone Stand', 15.99, 'Adjustable aluminum smartphone stand for desk use.', ARRAY['stand1.jpg', 'stand2.jpg', 'stand3.jpg', 'stand4.jpg'], 'Accessories', 'Anker', 5, 100, true),
('Bluetooth Headphones', 199.99, 'Noise-canceling over-ear Bluetooth headphones.', ARRAY['headphones1.jpg', 'headphones2.jpg', 'headphones3.jpg', 'headphones4.jpg'], 'Audio', 'Sony', 4, 20, true),
('Gaming Chair', 249.99, 'Ergonomic gaming chair with lumbar support and adjustable armrests.', ARRAY['chair1.jpg', 'chair2.jpg', 'chair3.jpg', 'chair4.jpg'], 'Furniture', 'Secretlab', 5, 10, true);

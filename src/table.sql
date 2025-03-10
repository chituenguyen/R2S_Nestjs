CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
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
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO products (name, price, description, image, category, brand, stock, is_active)
VALUES 
('Wireless Mouse', 29.99, 'Ergonomic wireless mouse with 2.4GHz connectivity.', 'mouse.jpg', 'Electronics', 'Logitech', 50, true),
('Mechanical Keyboard', 89.99, 'RGB backlit mechanical keyboard with brown switches.', 'keyboard.jpg', 'Electronics', 'Keychron', 30, true),
('Smartphone Stand', 15.99, 'Adjustable aluminum smartphone stand for desk use.', 'stand.jpg', 'Accessories', 'Anker', 100, true),
('Bluetooth Headphones', 199.99, 'Noise-canceling over-ear Bluetooth headphones.', 'headphones.jpg', 'Audio', 'Sony', 20, true),
('Gaming Chair', 249.99, 'Ergonomic gaming chair with lumbar support and adjustable armrests.', 'chair.jpg', 'Furniture', 'Secretlab', 10, true);

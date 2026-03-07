CREATE TABLE IF NOT EXISTS users(
    id BIGINT SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    phone_no BIGINT UNIQUE,
    CHECK (email IS NOT NULL OR phone_no IS NOT NULL),
    password_hash TEXT NOT NULL,
    username TEXT,
    is_verified BOOLEAN,
    is_active BOOLEAN,
    role TEXT,
    failed_login_attempt INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
);

-- @block
CREATE TABLE IF NOT EXISTS carts(
    cart_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id)
);


-- @block
CREATE TABLE IF NOT EXISTS products(
    product_id BIGINT SERIAL PRIMARY KEY,
    product TEXT UNIQUE,
    description TEXT,
    price NUMERIC(10, 2),
);

CREATE TABLE IF NOT EXISTS cart_items(
    cart_items_id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(cart_id),
    product_id BIGINT REFERENCES products(product_id),
    quantity BIGINT
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    color_id INT REFERENCES colors(id),
    size_id INT REFERENCES sizes(id),
    stock INT,
    track_inventory BOOLEAN DEFAULT TRUE
);

CREATE TABLE colors (
	id SERIAL PRIMARY KEY,
	color VARCHAR(255) NOT NULL
);

CREATE TABLE sizes (
	id SERIAL PRIMARY KEY,
	size VARCHAR(255) NOT NULL
);

CREATE TABLE shapes (
	id SERIAL PRIMARY KEY,
	shape VARCHAR(255) NOT NULL
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    color_id INT REFERENCES colors(id),
    size_id INT REFERENCES sizes(id),
	shape_id INT REFERENCES shapes(id),
    stock INT,
    track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (
        (track_inventory = TRUE AND stock IS NOT NULL)
        OR
        (track_inventory = FALSE)
    )
);

ALTER TABLE product_variants
ADD CONSTRAINT unique_variant_combination
UNIQUE (product_id, color_id, size_id, shape_id);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),

    order_number VARCHAR(50) UNIQUE NOT NULL,

    total_amount NUMERIC(10,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),

    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),

    delivery_address TEXT NOT NULL,

    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    variant_id INT REFERENCES product_variants(id),
    quantity INT NOT NULL,
    price_at_purchase NUMERIC(10,2) NOT NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,

    order_id INT REFERENCES orders(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id),

    payment_provider VARCHAR(50) NOT NULL,  -- Razorpay, Stripe, etc

    transaction_reference VARCHAR(100) UNIQUE, -- gateway transaction id

    amount NUMERIC(10,2) NOT NULL,

    status VARCHAR(30) NOT NULL,
    CHECK (status IN ('pending', 'success', 'failed', 'refunded')),

    payment_method VARCHAR(50), -- card, upi, netbanking

    gateway_response JSONB, -- full raw response from gateway

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPTZ
);

-- First drop the existing foreign key constraint
--@block
ALTER TABLE cart_items DROP CONSTRAINT cart_items_product_id_fkey;
--@block
-- Re-add it with ON DELETE CASCADE
ALTER TABLE cart_items
ADD CONSTRAINT cart_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE;

-- Repeat for every table that references products


CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id) NOT NULL,
	total_amount BIGINT NOT NULL,
	status VARCHAR(50) NOT NULL,
	payment_method VARCHAR(50),
	created_at TIMESTAMPTZ
)

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT,
    variant_id INT,
    product_name VARCHAR(255) NOT NULL, 
    variant_color VARCHAR(50), 
    variant_size VARCHAR(50),
    quantity INT NOT NULL,
    price_at_purchase BIGINT NOT NULL
);

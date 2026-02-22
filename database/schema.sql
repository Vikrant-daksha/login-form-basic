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
    product_types TEXT,
    product_colors TEXT,
    product_sizes TEXT,
    FOREIGN KEY (product_colors) REFERENCES product_colors (id),
    FOREIGN KEY (product_types) REFERENCES product_types (id),
    FOREIGN KEY (product_sizes) REFERENCES product_sizes (id)
);

CREATE TABLE IF NOT EXISTS cart_items(
    cart_items_id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(cart_id),
    product_id BIGINT REFERENCES products(product_id),
    quantity BIGINT
);
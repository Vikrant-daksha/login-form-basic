import { query } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import stripe from "../config/stripe.js";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, //30 Days
};

export const createToken = async (user) => {
  return jwt.sign({ sub: user.id }, process.env.JWT_KEY, { expiresIn: "30d" });
};

export const userbase = async (userData) => {
  const { email, phone_no } = userData;

  if (!userData) {
    return;
  }

  if (email) {
    const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return rows[0];
  }

  if (phone_no) {
    const { rows } = await query(`SELECT * FROM users WHERE phone_no = $1`, [
      phone_no,
    ]);
    return rows[0];
  }
};

export const getUserById = async (user_id) => {
  if (!user_id) {
    return null;
  }

  const { rows } = await query(
    `SELECT * FROM users
        WHERE id = $1`,
    [user_id]
  );

  return rows[0];
};

export const passCheck = async (userData) => {
  if (!userData) {
    return;
  }

  const { password, password_hash } = userData;
  const check = await bcrypt.compare(password, password_hash);

  return check;
};

export const loginUser = async (userData) => {
  if (!userData) {
    return;
  }

  const { identifier } = userData;

  const { rows } = await query(
    `SELECT * FROM users
        WHERE email = $1 OR phone_no = $1 LIMIT 1`,
    [identifier]
  );

  return rows[0];
};

export const fetchCart = async (user_id) => {
  const { rows } = await query(
    `SELECT 
        ci.cart_items_id,
        ci.quantity,
        pi.product_id,               -- Explicitly take it from the products table
        pi.product AS product,          -- Rename columns to be cleaner for frontend
        pi.price AS price,
        pi.images AS images,
        pi.sale AS sale,
        pi.slug AS slug,
        pv.id AS variant_id,
        cs.color AS color,
        sz.size AS size,
        sh.shape AS shape,
        c.cart_id AS cart_id 
    FROM carts c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN products pi ON ci.product_id = pi.product_id
    LEFT JOIN product_variants pv ON ci.product_variant_id = pv.id
    LEFT JOIN colors cs ON pv.color_id = cs.id
    LEFT JOIN shapes sh ON pv.shape_id = sh.id
    LEFT JOIN sizes sz ON pv.size_id = sz.id
    WHERE c.user_id = $1`,
    [user_id]
  );

  return rows;
};

export const createUser = async (userData) => {
  if (!userData) {
    return;
  }
  const { email, phone_no, password } = userData;
  if ((!email && !phone_no) || !password) {
    return;
  }
  const isAlreadyExists = await userbase(userData);
  if (isAlreadyExists) {
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (email, phone_no, password_hash, username, is_verified, is_active, role, failed_login_attempt, created_at, updated_at, last_login)
        VALUES ($1, $2, $3, COALESCE($1, $2), false, true, 'user', 0, NOW(), NOW(), NOW()) RETURNING *
        `,
    [email ?? null, phone_no ?? null, hashedPassword]
  );
  return rows[0];
};

export const createProduct = async (product) => {
  if (!product) {
    return;
  }

  const { name, description, price, sale, slug, images } = product;

  const { rows } = await query(
    `INSERT INTO products (product, description, price, sale, slug, created_at, images)
        VALUES ($1, $2, $3, $4, $5, NOW(), $6) RETURNING *`,
    [name, description, price, sale, slug, images]
  );

  return rows[0];
};

export const editProduct = async (productId, productData) => {
  if (!productId) {
    return;
  }

  const { name, description, price, sale, slug, images } = productData;

  const { rows } = await query(
    `UPDATE products
    SET product = $1,
        description = $2,
        price = $3,
        sale = $4,
        slug = $5,
        created_at = NOW(),
        images = CASE
           WHEN $6::text[] IS NOT NULL THEN array_cat(images, $6::text[])
           ELSE images
         END
    WHERE product_id = $7 RETURNING *`,
    [name, description, price, sale, slug, images || null, productId]
  );

  return rows[0];
};

export const deleteProduct = async (productId) => {
  if (!productId) {
    return;
  }

  const { rows } = await query(
    `DELETE FROM products WHERE product_id = $1 RETURNING *`,
    [productId]
  );

  return rows[0];
};

export const getCloudinary = async () => {
  const result = await cloudinary.api.ping();
  return result;
};

export const uploadCloudinary = async (filesArray, imgName) => {
  const uploads = filesArray.map((file, i) =>
    cloudinary.uploader.upload(file.path, {
      folder: `products/${imgName}`,
      public_id: `${imgName}-${i + 1}`,
    })
  );

  const results = await Promise.all(uploads);

  return results.map((r) => r.secure_url);
};

export const createSession = async (cartItem) => {
  const lineItems = await cartItem
    .filter(
      (item) =>
        (item.product && item.price && item.quantity > 0 && item.images) ||
        item.variant_id
    )
    .map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product,
          images: [Object.values(item.images)[0]],
          description: item.variant_id
            ? `${item.size}, ${item.color}, ${item.shape}`
            : [],
        },
        unit_amount: item.price * 100, // convert ₹ to paise
      },
      quantity: item.quantity,
    }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    ui_mode: "embedded",
    line_items: lineItems,
    return_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session;
};

export const buyNowSession = async (cartItem) => {
  let lineItems;

  if (cartItem.variant) {
    lineItems = `${cartItem.size}, ${cartItem.color}, ${cartItem.shape}`;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: cartItem.name,
            images: [Object.values(cartItem.images)[0]],
            description: lineItems || [],
          },
          unit_amount: cartItem.price * 100,
        },
        quantity: cartItem.quantity || 1,
      },
    ],
    return_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session;
};

export const verifySession = async (session_id) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (!session) {
      return;
    }

    return session;
  } catch (err) {
    return err.statusCode;
  }
};

export const getVariants = async () => {
  const colors = await query(`SELECT * FROM colors`);
  const sizes = await query(`SELECT * FROM sizes`);
  const shapes = await query(`SELECT * FROM shapes`);

  return {
    colors: colors.rows,
    sizes: sizes.rows,
    shapes: shapes.rows,
  };
};

export const addProductVariant = async (
  productId,
  color,
  size,
  shape,
  stock,
  trackInventory
) => {
  const { rows } = await query(
    `INSERT INTO
    product_variants(product_id, color_id, size_id, shape_id, stock, track_inventory)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [productId, color, size, shape, stock || null, trackInventory]
  );

  return rows;
};

export const addProductColor = async (color) => {
  const { rows } = await query(
    `INSERT INTO colors(color) VALUES($1) RETURNING *`,
    [color]
  );

  return rows;
};

export const addProductSize = async (size) => {
  const { rows } = await query(
    `INSERT INTO sizes(size) VALUES($1) RETURNING *`,
    [size]
  );

  return rows;
};

export const addProductShape = async (shape) => {
  const { rows } = await query(
    `INSERT INTO shapes(shape) VALUES($1) RETURNING *`,
    [shape]
  );

  return rows;
};

export const createOrder = async (
  user_id,
  amount,
  status,
  payment_method,
  address_id
) => {
  const { rows } = await query(
    `
    INSERT INTO orders(user_id, total_amount, status, payment_method, created_at, address_id)
    VALUES($1, $2, $3, $4, NOW(), $5) RETURNING *
    `,
    [user_id, amount, status, payment_method, address_id]
  );

  return rows[0];
};

export const editOrder = async (status, order_id) => {
  const { rows } = await query(
    `
    UPDATE orders
    SET status = $1 WHERE id = $2 RETURNING *`,
    [status, order_id]
  );

  return rows[0];
};

export const orderItemsCartId = async (order_id, cart_id) => {
  const { rows } = await query(
    `INSERT INTO order_items (
      order_id, 
      product_id, 
      variant_id, 
      product_name, 
      variant_color, 
      variant_size,
      variant_shape,
      quantity, 
      price_at_purchase
    )
    SELECT 
      $1,                
      ci.product_id, 
      ci.product_variant_id, 
      p.product,         
      col.color,         
      sz.size,           
      sh.shape,
      ci.quantity, 
      p.price    
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id
    LEFT JOIN product_variants pv ON ci.product_variant_id = pv.id
    LEFT JOIN colors col ON pv.color_id = col.id
    LEFT JOIN sizes sz ON pv.size_id = sz.id
    LEFT JOIN shapes sh ON pv.shape_id = sh.id
    WHERE ci.cart_id = $2
    RETURNING *
`,
    [order_id, cart_id]
  );

  return rows;
};

export const orderItemsProductId = async (order_id, product) => {
  const { product_id, variant, name, color, shape, size, quantity, price } =
    product;

  const roundedNumber = Math.round(price);

  const { rows } = await query(
    ` INSERT INTO order_items (
    order_id, 
    product_id, 
    variant_id, 
    product_name, 
    variant_color, 
    variant_size,
    variant_shape,
    quantity, 
    price_at_purchase
  ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
  `,
    [
      order_id,
      product_id,
      variant || null,
      name,
      color || null,
      shape || null,
      size || null,
      quantity,
      roundedNumber,
    ]
  );

  return rows;
};

export const orderByOrderId = async (user_id, order_id, role = "user") => {
  let sql = `
    SELECT
      odr.id AS order_id,
      odr.total_amount AS total_amount,
      odr.status AS payment_status,
      odr.payment_method AS payment_method,
      odr.created_at AS order_date,
      odr.is_email_sent AS is_email_sent,
      oi.product_id AS product_id,
      oi.quantity AS quantity,
      oi.price_at_purchase AS price,
      oi.product_name AS name, 
      oi.variant_color AS color,
      oi.variant_size AS size,
      oi.variant_shape AS shape,
      pi.images AS image,
      ads.address_name AS recipient,
      ads.apt AS apartment,
      ads.address AS address,
      ads.area AS area,
      ads.state_name AS state,
      ads.city AS city,
      ads.pincode AS pincode,
      ads.mobile_no AS mobile,
      txn.gateway_txn_id AS txn_id,
      txn.payment_method AS payment_method,
      txn.amount AS amount,
      txn.status AS status,
      txn.created_at AS created_at,
      u.email AS user_email
    FROM orders odr
    JOIN order_items oi ON odr.id = oi.order_id
    JOIN products pi ON oi.product_id = pi.product_id
    JOIN address ads ON odr.address_id = ads.id
    LEFT JOIN transactions txn ON odr.id = txn.order_id
    JOIN users u ON odr.user_id = u.id
    WHERE odr.id = $1`;

  const params = [order_id];

  if (role !== "admin") {
    sql += ` AND odr.user_id = $2`;
    params.push(user_id);
  }

  const { rows } = await query(sql, params);

  return rows;
};

export const orderHistory = async (user_id) => {
  const { rows } = await query(
    `
    SELECT
      odr.created_at AS date,
      odr.id AS order_id,
      odr.payment_method AS payment_method,
      odr.status AS status,
      odr.total_amount AS total_amount,
      usr.username AS name
    FROM orders odr 
    JOIN users usr ON usr.id = odr.user_id
    WHERE odr.user_id = $1
    ORDER BY odr.created_at DESC;
    `,
    [user_id]
  );

  return rows;
};

export const allOrders = async () => {
  const { rows } = await query(
    `
    SELECT
      odr.created_at AS date,
      odr.id AS order_id,
      odr.payment_method AS payment_method,
      odr.status AS status,
      odr.total_amount AS total_amount,
      usr.username AS name
    FROM orders odr 
    JOIN users usr ON usr.id = odr.user_id
    ORDER BY odr.created_at DESC;
    `
  );

  return rows;
};

export const createAddress = async (user_id, address) => {
  const {
    name,
    apt,
    exact_address,
    state,
    area,
    state_name,
    city,
    pincode,
    mobile,
  } = address;

  if (Number(mobile) === NaN) {
    return;
  }

  const mobileNumber = Number(mobile);

  const { rows } = await query(
    `
    INSERT INTO address(user_id, address_name, apt, address, area, state_name, city, pincode, mobile_no)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `,
    [
      user_id,
      name,
      apt,
      exact_address,
      area || null,
      state_name,
      city,
      pincode,
      mobileNumber,
    ]
  );

  return rows[0];
};

export const getUserAddress = async (user_id) => {
  const { rows } = await query(
    `
    SELECT * FROM address WHERE user_id = $1
    `,
    [user_id]
  );

  return rows;
};

export const getAddressById = async (user_id, address_id) => {
  const { rows } = await query(
    `
    SELECT * FROM address WHERE user_id = $1 AND id = $2
    `,
    [user_id, address_id]
  );

  return rows[0];
};

export const createTransaction = async (order_id, txn) => {
  const txn_id = txn.payment_intent.id;
  const payment_type = txn.payment_method_types[0];
  const total_amount = Math.round(txn.amount_total / 100);
  const payment_status = txn.payment_status;
  const gateway_response = JSON.stringify(txn.payment_intent);

  const { rows } = await query(
    `
    INSERT INTO transactions(order_id, gateway_txn_id, payment_method, amount, status, gateway_response, created_at)
    VALUES($1, $2, $3, $4, $5, $6, NOW()) RETURNING *
    `,
    [
      order_id,
      txn_id,
      payment_type,
      total_amount,
      payment_status,
      gateway_response,
    ]
  );

  return rows[0];
};

export const deleteOrder = async (user_id, order_id) => {
  const { rows } = await query(
    `
    DELETE FROM orders WHERE user_id = $1 AND id = $2 RETURNING *
    `,
    [user_id, order_id]
  );

  return rows;
};

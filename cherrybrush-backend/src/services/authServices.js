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

//Fetching User By ID for AuthMiddleware
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
    `SELECT * FROM carts c
        JOIN cart_items ci 
        ON c.cart_id = ci.cart_id
        JOIN products pi 
        ON ci.product_id = pi.product_id 
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
      (item) => item.product && item.price && item.quantity > 0 && item.images
    )
    .map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product,
          images: [Object.values(item.images)[0]],
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
  // const lineItems = {
  //   price_data: {
  //     currency: "inr",
  //     product_data: {
  //       name: cartItem.product,
  //       images: [Object.values(cartItem.images)[0]],
  //     },
  //     unit_amount: cartItem.price * 100, // convert ₹ to paise
  //   },
  //   quantity: cartItem.quantity,
  // };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: cartItem.product,
            images: [Object.values(cartItem.images)[0]],
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
    const session = await stripe.checkout.sessions.retrieve(session_id);

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
    `INSERT INTO colors(color) VALUE ($1) RETURNING *`,
    [color]
  );

  return rows;
};

export const fetchToken = async () => {};

export const login = async () => {};

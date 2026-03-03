import { query } from "../config/db.js";
import bcrypt from "bcrypt";

export const getUsers = async () => {
  const { rows } = await query("SELECT * FROM users");
  return rows;
};

export const updateUser = async (userData, userId) => {
  const { email, phone_no } = userData;
  const { rows } = await query(
    `UPDATE users SET email = $1, phone_no = $2
         WHERE id = $3 RETURNING *`,
    [email, phone_no, userId]
  );
  return rows[0];
};

export const deleteUser = async (userId) => {
  const { rowCount } = await query(`DELETE FROM users WHERE id = $1`, [userId]);
  return rowCount > 0;
};

export const searchUser = async (searchTerm) => {
  const { rows } = await query(
    `SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};

export const getAllProducts = async () => {
  const { rows } = await query(`SELECT * FROM products`);

  return rows;
};

export const getSingleProduct = async (slug) => {
  const { rows } = await query(
    `SELECT * FROM products WHERE slug = $1 LIMIT 1`,
    [slug]
  );

  return rows[0];
};

export const getProductVariants = async (product_id) => {
  const { rows } = await query(
    `SELECT 
      pv.id,
      pv.product_id,
      c.color AS color,
      s.size AS size,
      sh.shape AS shape
    FROM product_variants pv
    INNER JOIN colors c ON c.id = pv.color_id
    INNER JOIN sizes s ON s.id = pv.size_id
    INNER JOIN shapes sh ON sh.id = pv.shape_id
    WHERE pv.product_id = $1`,
    [product_id]
  );

  return rows;
};

export const addItem = async (cart_id, product_id) => {
  const { rows } = await query(
    `INSERT INTO cart_items (product_id, quantity, cart_id)
        VALUES ($1, 1, $2) 
        
        ON CONFLICT (product_id, cart_id)

        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
        
        RETURNING *`,
    [product_id, cart_id]
  );

  return rows[0];
};

export const updateQuantity = async (cart_id, product_id, quantity) => {
  if (quantity < 1) return;

  const { rows } = await query(
    `UPDATE cart_items
    SET quantity = $1
    WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
    [quantity, cart_id, product_id]
  );

  return rows[0];
};

// export const deleteCart = async(cart_id) => {

//     const { rows } = await query(
//         `INSERT INTO cart_items (product_id, quantity, cart_id)
//         VALUES ($1, 1, $2)

//         ON CONFLICT (product_id, cart_id)

//         DO UPDATE SET quantity = cart_items.quantity + 1

//         RETURNING *`,
//         [product_id, cart_id]
//     );

//     return rows[0]
// }

export const createCart = async (user_id) => {
  const { rows } = await query(
    `INSERT INTO carts(user_id)
        VALUES($1)
        ON CONFLICT(user_id) DO NOTHING
        RETURNING *`,
    [user_id]
  );

  return rows[0];
};

export const getUserCart = async (user_id) => {
  let { rows } = await query(`SELECT * FROM carts WHERE user_id = $1`, [
    user_id,
  ]);

  if (rows.length > 0) {
    return rows[0];
  }

  const newCart = await createCart(user_id);
  return newCart;
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

export const cartItemRemove = async (user_id, product_id) => {
  const cart = await fetchCart(user_id);

  const { cart_id } = cart[0];

  const { rows } = await query(
    `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
    [cart_id, product_id]
  );

  if (!cart) {
    return;
  }

  return rows;
};

import jwt from "jsonwebtoken";
import * as authService from "../services/authServices.js";

export const loginUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.loginUser(userData);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const passData = {
      password: userData.password,
      password_hash: user.password_hash,
    };
    const compare = await authService.passCheck(passData);

    if (!compare) {
      return res.status(200).json({ message: "Incorrect Password" });
    }

    const token = await authService.createToken(user);
    res.cookie("token", token, authService.cookieOptions);
    res.status(200).json(token);
  } catch (err) {
    console.error("Login Failed", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.createUser(userData);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or Phone Number cannot be empty" });
    }
    const token = await authService.createToken(user);
    res.cookie("token", token, authService.cookieOptions);
    res.status(200).json(token);
  } catch (err) {
    console.error("Cannot Create User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const profile = async(req, res) => {
//     try {
//         const user = req.user;
//         if(!user) {
//             res.status(404).json({ message: 'User is Not Logged In' })
//         }
//         res.status(200).json(user);
//     } catch (err) {
//         console.error('Cannot Find User', err);
//         res.status(500).json({ message: 'Internal Server Error' })
//     }
// }

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { ...authService.cookieOptions, maxAge: 1 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (err) {
    console.error("Cannot Logout");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cart = async (req, res) => {
  try {
    const user = req.id;
    const cartItem = await authService.fetchCart(user);
    // const { product_variant_id } = cartItem;
    // if (product_variant_id !== null) {
    //   console.log(product_variant_id);
    // }
    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Cannot Show Cart", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const imgName = req.body.slug;
    const fileArray = req.files;
    const images = await authService.uploadCloudinary(fileArray, imgName);

    const productData = { ...req.body, images };
    const create = await authService.createProduct(productData);
    res.status(200).json(create);
  } catch (err) {
    console.error("Cannot Show Cart");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const imgName = req.body.slug;
      const fileArray = req.files;
      const images = await authService.uploadCloudinary(fileArray, imgName);
      productData.images = images;
      // console.log(imgName, fileArray);
    }

    const editedProduct = await authService.editProduct(productId, productData);

    // const create = await authService.createProduct(productData);
    res.status(200).json(editedProduct);
  } catch (err) {
    console.error("Cannot Show Cart", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await authService.deleteProduct(productId);
    res.status(200).json(deletedProduct);
  } catch (err) {
    console.error("Cannot Show Cart", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const upload = async (req, res) => {
  try {
    const product = { images: result };
    const array = await authService.createProduct(product);
    res.status(200).json(array);
  } catch (err) {
    console.error("Error Connecting to Cloudinary", err);
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const user = req.id;
    const cartItem = await authService.fetchCart(user);
    const session = await authService.createSession(cartItem);

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe session failed" });
  }
};

export const buyNow = async (req, res) => {
  try {
    const user = req.id;
    const { cart } = req.body;
    const session = await authService.buyNowSession(cart);

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe session failed" });
  }
};

export const sessionConfirmation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionInfo = await authService.verifySession(sessionId);

    res.json(sessionInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment Status Check failed" });
  }
};

export const getVariants = async (req, res) => {
  try {
    const variants = await authService.getVariants();
    res.status(200).json(variants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment Status Check failed" });
  }
};

export const addProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size, shape, stock, trackInventory } = req.body;
    const variant = await authService.addProductVariant(
      productId,
      color,
      size,
      shape,
      stock,
      trackInventory
    );
    res.status(200).json(variant);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createOrder = async (req, res) => {
  try {
    const user_id = req.id;
    const address_id = req.body;
    const cart = await authService.fetchCart(user_id);

    // const order = await authService.createOrder(
    //   user_id,
    //   4000,
    //   "pending",
    //   "stripe",
    //   address_id
    // );

    // const orderItems = await authService.orderItems(2, cart[0].cart_id);

    // const { color, size, shape, stock, trackInventory } = req.body;
    // const variant = await authService.addProductVariant(
    //   productId,
    //   color,
    //   size,
    //   shape,
    //   stock,
    //   trackInventory
    // );
    res.status(200).json(address_id);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const fetchOrders = async (req, res) => {
  try {
    const user_id = req.id;
    const orders = await authService.orderHistory(user_id);

    res.status(200).json(orders);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getOrderById = async (req, res) => {
  try {
    const user_id = req.id;
    const { orderId } = req.params;
    const order = await authService.orderByOrderId(user_id, orderId);

    res.status(200).json(order);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createAddress = async (req, res) => {
  try {
    const user_id = req.id;
    const addressData = req.body;
    const address = await authService.createAddress(user_id, addressData);
    res.status(200).json(address);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getUserAddress = async (req, res) => {
  try {
    const user_id = req.id;
    const usersAddress = await authService.getUserAddress(user_id);
    res.status(200).json(usersAddress);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

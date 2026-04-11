import jwt from "jsonwebtoken";
import * as authService from "../services/authServices.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

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
    }

    const editedProduct = await authService.editProduct(productId, productData);
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

export const fetchAllOrders = async (req, res) => {
  try {
    const allOrders = await authService.allOrders();

    res.status(200).json(allOrders);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getOrderById = async (req, res) => {
  try {
    const user_id = req.id;
    const { orderId } = req.params;
    const role = req.user.role;
    const order = await authService.orderByOrderId(user_id, orderId, role);

    res.status(200).json(order);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const user_id = req.id;
    const { orderId } = req.params;
    const order = await authService.deleteOrder(user_id, orderId);

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

export const getAddressById = async (req, res) => {
  try {
    const user_id = req.id;
    const { addressId } = req.params;
    const usersAddress = await authService.getAddressById(user_id, addressId);
    res.status(200).json(usersAddress);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createOrder = async (req, res) => {
  try {
    const user_id = req.id;
    const { address_id, cart_id, productData, payment_method } = req.body;

    let total_amount;
    let discount;
    let coupon_id;

    if (cart_id) {
      const cart = await authService.fetchCart(user_id);

      total_amount = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      if (cart[0].coupon_code) {
        const coupon = await authService.getDiscountCouponByCode(
          cart[0].coupon_code
        );
        discount = coupon.discount_price;
        total_amount = total_amount - Number(discount);
        coupon_id = coupon.id;
      }
    }

    if (productData) {
      const { price, quantity } = productData;
      total_amount = price * quantity;
    }

    const order = await authService.createOrder(
      user_id,
      total_amount,
      "pending",
      payment_method,
      address_id,
      discount
    );

    let orderItems;

    if (productData) {
      orderItems = await authService.orderItemsProductId(order.id, productData);
    }

    if (cart_id) {
      orderItems = await authService.orderItemsCartId(order.id, cart_id);
      await authService.createCouponRedemption(user_id, order.id, coupon_id);
      await authService.updateCouponUsedCount(coupon_id);
    }
    res.status(200).json({ order_id: order.id, order: orderItems });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createTransaction = async (req, res) => {
  try {
    const user_id = req.id;
    const { orderId } = req.params;
    const { transaction } = req.body;
    const role = req.user.role;

    const createdTxn = await authService.createTransaction(
      orderId,
      transaction
    );
    const orderStatus = await authService.editOrder("paid", orderId);

    const orderDetails = await authService.orderByOrderId(
      user_id,
      orderId,
      role
    );

    if (orderDetails && orderDetails.length > 0) {
      const orderInfo = orderDetails[0];

      if (!orderInfo.is_email_sent) {
        await sendOrderConfirmationEmail(orderInfo.user_email, orderDetails);
        // await authService.sendEmail(orderId);
      }
    }

    res.status(200).json({ createdTxn, orderStatus });
  } catch (err) {
    console.error("Error confirm transaction:", err);
    res.status(500).json("Internal Server Error");
  }
};

export const addColor = async (req, res) => {
  try {
    const { color } = req.body;
    const addedColor = await authService.addProductColor(color);

    res.status(200).json(addedColor);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const addShape = async (req, res) => {
  try {
    const { shape } = req.body;
    const addedShape = await authService.addProductShape(shape);

    res.status(200).json(addedShape);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const addSize = async (req, res) => {
  try {
    const { size } = req.body;
    const addedSize = await authService.addProductSize(size);

    res.status(200).json(addedSize);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createComment = async (req, res) => {
  try {
    const user_id = req.id;
    const commentData = req.body;
    const comment = await authService.createComment(user_id, commentData);
    res.status(200).json(comment);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await authService.getCommentsForProduct(productId);
    res.status(200).json(comments);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await authService.getAllComment();
    res.status(200).json(comments);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const createDiscountCoupon = async (req, res) => {
  try {
    const couponInfo = req.body;
    const createCoupon = await authService.createDiscountCoupon(couponInfo);
    res.status(200).json(createCoupon);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getDiscountCoupons = async (req, res) => {
  try {
    const coupons = await authService.getAllDiscountCoupon();
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getCreatorCoupon = async (req, res) => {
  try {
    const user_id = req.id;
    const coupons = await authService.getCreatorCoupons(user_id);
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const adminCoupons = async (req, res) => {
  try {
    const coupons = await authService.getAdminDiscountCoupons();
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const getDiscountCouponByCode = async (req, res) => {
  try {
    const discount_code = req.params.code;
    const coupon = await authService.getDiscountCouponByCode(discount_code);
    res.status(200).json(coupon);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await authService.deleteUser(userId);
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).send();
  } catch (err) {
    console.error("Error Deleting User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await authService.searchUser(searchTerm);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error Searching User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCoupon = async (req, res) => {
  try {
    const user_id = req.id;
    const coupon_id = req.params.id;
    let message;
    let addedCoupon;
    const coupon_is_used = await authService.userCouponUsedCount(
      user_id,
      coupon_id
    );
    const max_coupon_redemption = await authService.maxRedemptions(coupon_id);
    if (
      max_coupon_redemption.max_per_user_redemption &&
      max_coupon_redemption.global_max_redemption &&
      coupon_is_used.count >= max_coupon_redemption.max_per_user_redemption
    ) {
      message = "You have Already used this Coupon!";
    } else {
      addedCoupon = await authService.addCouponToCart(user_id, coupon_id);
    }
    res.status(200).json({ coupon: addedCoupon, message: message });
  } catch (err) {
    console.error("Error Adding Coupon", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const user_id = req.id;
    const deletedCoupon = await authService.deleteCouponFromCart(user_id);
    res.status(200).json(deletedCoupon);
  } catch (err) {
    console.error("Error Deleting Coupon", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const orderCoupons = async (req, res) => {
  try {
    const user_id = req.id;
    const orders = await authService.ordersWithCoupons(user_id);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editUserRole = async (req, res) => {
  try {
    const { user_id, role, password } = req.body;
    const editedUserRole = await authService.updateUserRole(user_id, role);
    const editedUserPassword = await authService.updateUserPassword(
      user_id,
      password
    );
    res
      .status(200)
      .json({ newUser: editedUserRole, newPassword: editedUserPassword });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.id;
    const { cartId } = req.params;
    const clearCartItems = await authService.removeCartItems(cartId);
    const clearCoupon = await authService.removeCartCoupon(userId);
    res.status(200).json({ cartItems: clearCartItems, coupon: clearCoupon });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

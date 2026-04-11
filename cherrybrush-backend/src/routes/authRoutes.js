import express from "express";
import * as authController from "../controllers/authControllers.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as adminMiddleware from "../middleware/adminMiddleware.js";
import * as uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", authController.createUser);

router.post("/login", authController.loginUser);

router.post("/logout", authController.logout);

router.get("/cart", authMiddleware.loginRequire, authController.cart);

router.post(
  "/create-product",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  uploadMiddleware.uploadImage,
  authController.createProduct
);

router.get(
  "/create-checkout",
  authMiddleware.loginRequire,
  authController.createCheckoutSession
);

router.post(
  "/buy-now/:productId",
  authMiddleware.loginRequire,
  authController.buyNow
);

router.post("/check", authController.upload);

router.get(
  "/checkout/:sessionId",
  authMiddleware.loginRequire,
  authController.sessionConfirmation
);

router.post(
  "/product/add-variant/:productId",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.addProductVariant
);

router.delete("/product/delete/:productId", authController.deleteProduct);

router.post(
  "/edit-product/:productId",
  uploadMiddleware.uploadImage,
  authController.editProduct
);

router.get("/product/variants", authController.getVariants);

router.post(
  "/create-order",
  authMiddleware.loginRequire,
  authController.createOrder
);

router.get(
  "/order-history",
  authMiddleware.loginRequire,
  authController.fetchOrders
);

router.get(
  "/order-history/admin",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.fetchAllOrders
);

router.get(
  "/order-history/:orderId",
  authMiddleware.loginRequire,
  authController.getOrderById
);

router.post(
  "/add-address",
  authMiddleware.loginRequire,
  authController.createAddress
);

router.get(
  "/get-user-address",
  authMiddleware.loginRequire,
  authController.getUserAddress
);

router.get(
  "/address/:addressId",
  authMiddleware.loginRequire,
  authController.getAddressById
);

router.post(
  "/create-transaction/:orderId",
  authMiddleware.loginRequire,
  authController.createTransaction
);

router.delete(
  "/order/:orderId",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.deleteOrder
);

router.post(
  "/add-color",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.addColor
);

router.post(
  "/add-size",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.addSize
);

router.post(
  "/add-shape",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.addShape
);

router.post(
  "/post-comment",
  authMiddleware.loginRequire,
  authController.createComment
);

router.get("/get-comments/:productId", authController.getComments);

router.get("/all-comments/", authController.getAllComments);

router.post(
  "/create-coupon",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.createDiscountCoupon
);

router.get(
  "/all-coupons",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.adminCoupons
);

router.get(
  "/coupons",
  authMiddleware.loginRequire,
  authController.getDiscountCoupons
);

router.get(
  "/coupon/:code",
  authMiddleware.loginRequire,
  authController.getDiscountCouponByCode
);

router.get(
  "/orders-with-coupons",
  authMiddleware.loginRequire,
  authController.orderCoupons
);

router.get(
  "/get-user/search",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.searchUser
);

router.post(
  "/cart-coupon/:id",
  authMiddleware.loginRequire,
  authController.addCoupon
);

router.delete(
  "/delete-cart-coupon",
  authMiddleware.loginRequire,
  authController.deleteCoupon
);

router.get(
  "/all-users",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.getAllUsers
);

router.delete(
  "/delete-user/:id",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.deleteUser
);

router.delete(
  "/clear-cart/:cartId",
  authMiddleware.loginRequire,
  authController.clearCart
);

router.post(
  "/edit-user-role",
  authMiddleware.loginRequire,
  adminMiddleware.adminRole,
  authController.editUserRole
);

router.get(
  "/creator-coupons",
  authMiddleware.loginRequire,
  authController.getCreatorCoupon
);

export default router;

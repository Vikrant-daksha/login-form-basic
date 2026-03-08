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

router.post("/buy-now/:productId", authController.buyNow);

router.post("/check", authController.upload);

router.get("/checkout/:sessionId", authController.sessionConfirmation);

router.post(
  "/product/add-variant/:productId",
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

export default router;

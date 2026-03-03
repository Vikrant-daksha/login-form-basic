import express from "express";
import * as clientController from "../controllers/clientController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as adminMiddleware from "../middleware/adminMiddleware.js";
import cashfreeOrder from "../config/cashfree.js";
import { createCheckoutSession } from "../config/stripe.js";

const router = express.Router();

router.get("/client", clientController.getUsers);

router.get("/products", clientController.productsList);

router.get("/products/:slug", clientController.getProductBySlug);

router.put(
  "/client/update",
  authMiddleware.loginRequire,
  clientController.updateUser
);

router.get("/profile", authMiddleware.loginRequire, clientController.profile);

router.post(
  "/add-to-cart",
  authMiddleware.loginRequire,
  clientController.addToCart
);

router.patch(
  "/update-quantity",
  authMiddleware.loginRequire,
  clientController.updateQuantity
);

router.delete(
  "/remove/:productId",
  authMiddleware.loginRequire,
  clientController.removeFromCart
);

// router.get("/create-order", authMiddleware.loginRequire, authController.cart, createCheckoutSession);

// router.delete("/client/:id", clientController.deleteUser);

// router.get("/client/search", clientController.searchUser);

export default router;

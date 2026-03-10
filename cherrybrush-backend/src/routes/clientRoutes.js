import express from "express";
import * as clientController from "../controllers/clientController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/client", clientController.getUsers);

router.get("/products", clientController.productsList);

router.get("/products/:slug", clientController.getProductBySlug);

router.get(
  "/products/cart-item/:cart_items_id",
  authMiddleware.loginRequire,
  clientController.getProductByCartItemsId
);

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

export default router;

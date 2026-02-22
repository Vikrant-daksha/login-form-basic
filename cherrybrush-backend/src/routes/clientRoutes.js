import express from "express";
import * as clientController from "../controllers/clientController.js";
import * as authMiddleware from "../middleware/authMiddleware.js"
import * as adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/client", clientController.getUsers);

router.get("/products", clientController.productsList);

router.get("/products/:slug", clientController.getProductBySlug);

router.put("/client/update", authMiddleware.loginRequire , clientController.updateUser);

router.get("/profile", authMiddleware.loginRequire , clientController.profile);

router.post("/add-to-cart", authMiddleware.loginRequire, clientController.addToCart)

// router.delete("/client/:id", clientController.deleteUser);

// router.get("/client/search", clientController.searchUser);

export default router;
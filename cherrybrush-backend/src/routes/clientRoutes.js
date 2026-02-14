import express from "express";
import * as clientController from "../controllers/clientController.js";

const router = express.Router();

router.get("/client", clientController.getUsers);

router.post("/create", clientController.createUser);

router.put("/client/:id", clientController.updateUser);

router.delete("/client/:id", clientController.deleteUser);

router.get("/client/search", clientController.searchUser);

export default router;
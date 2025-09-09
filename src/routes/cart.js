import express from "express";
import { showProducts, addToCart, showCart, getCartAPI } from "../controllers/cartController.js";

const router = express.Router();

// Routes légères, tout est délégué au controller
router.get("/", showProducts);
router.post("/cart/add", addToCart);
router.get("/cart", showCart);
router.get("/api/cart", getCartAPI);

export default router;

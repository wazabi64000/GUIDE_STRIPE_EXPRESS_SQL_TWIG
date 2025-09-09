import express from "express";
import { checkout, success, cancel } from "../controllers/paymentController.js";

const router = express.Router();

// Routes légères, toute la logique est dans le controller
router.post("/checkout", checkout);
router.get("/success", success);
router.get("/cancel", cancel);

export default router;

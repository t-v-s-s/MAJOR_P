// routes/orderRoutes.js
import express from "express";
import { getAllOrdersAdmin, getMyOrders, placeOrder } from "../api_admin_p/Orders/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place order
router.post("/place", verifyToken, placeOrder);
router.get("/my", verifyToken, getMyOrders);
router.get("/admin/all", verifyToken, getAllOrdersAdmin);

export default router;

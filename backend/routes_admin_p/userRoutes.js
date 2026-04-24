import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
    getMe,
    getShippingAddress,
    getUserInfo,
    upsertShippingAddress,
    placeOrder,
    getOrders
} from "../api_admin_p/User/userController.js";

import {
    addMyAddress,
    deleteMyAddress,
    getMyAddresses,
    setMyDefaultAddress,
    updateMyAddress,
} from "../api_admin_p/User/addressController.js";

const router = express.Router();

// User info
router.get("/userinfo", getUserInfo);

// Current user (auth)
router.get("/me", verifyToken, getMe);

// Shipping address (auth)
router.get("/shipping-address", verifyToken, getShippingAddress);
router.put("/shipping-address", verifyToken, upsertShippingAddress);

// Addresses (auth)
router.get("/addresses", verifyToken, getMyAddresses);
router.post("/addresses", verifyToken, addMyAddress);
router.put("/addresses/:id", verifyToken, updateMyAddress);
router.put("/addresses/:id/default", verifyToken, setMyDefaultAddress);
router.delete("/addresses/:id", verifyToken, deleteMyAddress);

// Orders (auth)
router.post("/order", verifyToken, placeOrder);
router.get("/orders", verifyToken, getOrders);

export default router;

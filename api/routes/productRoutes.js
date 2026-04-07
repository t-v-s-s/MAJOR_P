import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from "../controllers/Product/product_controller.js";

const router = express.Router();

// Create product
router.post("/", verifyToken, upload.single("image"), addProduct);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Update product
router.put("/:id", verifyToken, upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", verifyToken, deleteProduct);

// Get products by category
router.get("/category/:category", getProductsByCategory);

export default router;
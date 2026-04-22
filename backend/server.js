import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin_authRoutes from "./routes_admin_p/authRoutes.js";
import admin_productRoutes from "./routes_admin_p/productRoutes.js";
import admin_masterRoutes from "./routes_admin_p/masterRoutes.js";
import admin_userRoutes from "./routes_admin_p/userRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", admin_authRoutes);
app.use("/api/master", admin_masterRoutes);
app.use("/api/products", admin_productRoutes);
app.use("/api/user", admin_userRoutes);
app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
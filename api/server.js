import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
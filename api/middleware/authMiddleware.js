import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    console.log("verifyToken called")
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: "No token ❌" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token ❌" });
    }
};
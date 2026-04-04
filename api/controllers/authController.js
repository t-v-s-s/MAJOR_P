import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  const { username, email, phone, password, country_id, state_id, city_id, area_id } = req.body;

  // Validate all fields
  if (!username || !email || !phone || !password || !country_id || !state_id || !city_id || !area_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB including all new fields
    await pool.query(
      "INSERT INTO user_info (username, email, phone, password, country_id, state_id, city_id, area_id) \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [username, email, phone, hashedPassword, country_id, state_id, city_id, area_id]
    );

    res.json({ message: "Registration Successful ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query(
      "SELECT * FROM user_info WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Return response
    res.json({
      message: "Login Successful",
      token,
      username: user.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed" });
  }
};

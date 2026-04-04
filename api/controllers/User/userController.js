import pool from "../../config/db.js";

// ================================
// GET ALL USER
// ================================
export const getUserInfo = async (req, res) => {
    try {
        const result = await pool.query(`
                                        SELECT 
                                            user_info.id,
                                            user_info.username
                                        FROM user_info
                                        ORDER BY user_info.id ASC
                                        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching user info :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
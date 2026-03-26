import pool from "../../config/db.js";

// ================================
// GET ALL AREAS
// ================================
export const getAreas = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        area.id,
        area.name,
        area.city_id,
        city.name AS city_name
      FROM area
      JOIN city ON area.city_id = city.id
      ORDER BY area.id ASC
    `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching areas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// GET AREA BY ID
// ================================
export const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      SELECT 
        area.id,
        area.name,
        area.city_id,
        city.name AS city_name
      FROM area
      JOIN city ON area.city_id = city.id
      WHERE area.id = $1
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Area not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching area by id:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// ADD AREA
// ================================
export const addArea = async (req, res) => {
    try {
        const { name, city_id } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Area name is required" });
        }

        if (!city_id) {
            return res.status(400).json({ message: "City ID is required" });
        }

        const cityCheck = await pool.query(
            "SELECT * FROM city WHERE id = $1",
            [city_id]
        );

        if (cityCheck.rows.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        const result = await pool.query(
            "INSERT INTO area (name, city_id) VALUES ($1, $2) RETURNING *",
            [name.trim(), city_id]
        );

        res.status(201).json({
            message: "Area added successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error adding area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// UPDATE AREA
// ================================
export const updateArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city_id } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Area name is required" });
        }

        if (!city_id) {
            return res.status(400).json({ message: "City ID is required" });
        }

        const cityCheck = await pool.query(
            "SELECT * FROM city WHERE id = $1",
            [city_id]
        );

        if (cityCheck.rows.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        const result = await pool.query(
            "UPDATE area SET name = $1, city_id = $2 WHERE id = $3 RETURNING *",
            [name.trim(), city_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Area not found" });
        }

        res.status(200).json({
            message: "Area updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// DELETE AREA
// ================================
export const deleteArea = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM area WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Area not found" });
        }

        res.status(200).json({
            message: "Area deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// GET AREAS BY CITY ID
// ================================
export const getAreasByCityId = async (req, res) => {
    try {
        const { cityId } = req.params;
        const result = await pool.query(
            "SELECT id, name, city_id FROM area WHERE city_id = $1 ORDER BY id ASC",
            [cityId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching areas by city id:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
import pool from "../../config/db.js";

// ======================================
// GET ALL CITIES
// ======================================
export const getCities = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM city ORDER BY id ASC"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error while fetching cities" });
    }
};

// ======================================
// GET CITY BY ID
// ======================================
export const getCityById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM city WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching city by id:", error);
        res.status(500).json({ message: "Server error while fetching city" });
    }
};

// ======================================
// ADD CITY
// ======================================
export const addCity = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "City name is required" });
        }

        const result = await pool.query(
            "INSERT INTO city (name) VALUES ($1) RETURNING *",
            [name.trim()]
        );

        res.status(201).json({
            message: "City added successfully",
            city: result.rows[0]
        });
    } catch (error) {
        console.error("Error adding city:", error);

        if (error.code === "23505") {
            return res.status(400).json({ message: "City already exists" });
        }

        res.status(500).json({ message: "Server error while adding city" });
    }
};

// ======================================
// UPDATE CITY
// ======================================
export const updateCity = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "City name is required" });
        }

        const result = await pool.query(
            "UPDATE city SET name = $1 WHERE id = $2 RETURNING *",
            [name.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({
            message: "City updated successfully",
            city: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating city:", error);

        if (error.code === "23505") {
            return res.status(400).json({ message: "City already exists" });
        }

        res.status(500).json({ message: "Server error while updating city" });
    }
};

// ======================================
// DELETE CITY
// ======================================
export const deleteCity = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM city WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({
            message: "City deleted successfully",
            city: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting city:", error);
        res.status(500).json({ message: "Server error while deleting city" });
    }
};

// ======================================
// GET CITIES BY STATE ID
// ======================================
export const getCitiesByStateId = async (req, res) => {
    try {
        const { stateId } = req.params;
        const result = await pool.query(
            "SELECT * FROM city WHERE state_id = $1 ORDER BY id ASC",
            [stateId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching cities by state id:", error);
        res.status(500).json({ message: "Server error while fetching cities" });
    }
};
import pool from "../../config/db.js";

// GET ALL STATES
export const getStates = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM state ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching states" });
    }
};

// GET STATE BY ID
export const getStateById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM state WHERE id = $1",
            [id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching state" });
    }
};

// ADD STATE
export const addState = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query(
            "INSERT INTO state (name) VALUES ($1) RETURNING *",
            [name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding state" });
    }
};

// UPDATE STATE
export const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const result = await pool.query(
            "UPDATE state SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating state" });
    }
};

// DELETE STATE
export const deleteState = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM state WHERE id = $1",
            [id]
        );

        res.json({ message: "State deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting state" });
    }
};

// GET STATES BY COUNTRY ID
export const getStatesByCountryId = async (req, res) => {
    try {
        const { countryId } = req.params;
        const result = await pool.query(
            "SELECT * FROM state WHERE country_id = $1 ORDER BY id ASC",
            [countryId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching states by country id:", error);
        res.status(500).json({ message: "Error fetching states" });
    }
};


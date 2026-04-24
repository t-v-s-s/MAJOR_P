import pool from "../../config/db.js";

let shippingAddressTableEnsured = false;

const ensureShippingAddressTable = async () => {
    if (shippingAddressTableEnsured) return;

    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_shipping_address (
            user_id INTEGER PRIMARY KEY REFERENCES user_info(id) ON DELETE CASCADE,
            full_name TEXT,
            phone TEXT,
            email TEXT,
            address_line TEXT,
            pincode TEXT,
            country_id INTEGER,
            state_id INTEGER,
            city_id INTEGER,
            area_id INTEGER,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    shippingAddressTableEnsured = true;
};

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

// ================================
// GET CURRENT USER (AUTH)
// ================================
export const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await pool.query(
            `SELECT id, username, email, phone, country_id, state_id, city_id, area_id FROM user_info WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching current user :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// GET SHIPPING ADDRESS (AUTH)
// ================================
export const getShippingAddress = async (req, res) => {
    try {
        await ensureShippingAddressTable();

        const userId = req.user?.id;
        const result = await pool.query(
            `SELECT * FROM user_shipping_address WHERE user_id = $1`,
            [userId]
        );

        res.status(200).json(result.rows[0] || null);
    } catch (error) {
        console.error("Error fetching shipping address :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// UPSERT SHIPPING ADDRESS (AUTH)
// ================================
export const upsertShippingAddress = async (req, res) => {
    try {
        await ensureShippingAddressTable();

        const userId = req.user?.id;
        const {
            full_name,
            phone,
            email,
            address_line,
            pincode,
            country_id,
            state_id,
            city_id,
            area_id,
        } = req.body;

        const result = await pool.query(
            `
                INSERT INTO user_shipping_address
                    (user_id, full_name, phone, email, address_line, pincode, country_id, state_id, city_id, area_id)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (user_id) DO UPDATE SET
                    full_name = EXCLUDED.full_name,
                    phone = EXCLUDED.phone,
                    email = EXCLUDED.email,
                    address_line = EXCLUDED.address_line,
                    pincode = EXCLUDED.pincode,
                    country_id = EXCLUDED.country_id,
                    state_id = EXCLUDED.state_id,
                    city_id = EXCLUDED.city_id,
                    area_id = EXCLUDED.area_id,
                    updated_at = NOW()
                RETURNING *
            `,
            [
                userId,
                full_name || null,
                phone || null,
                email || null,
                address_line || null,
                pincode || null,
                country_id || null,
                state_id || null,
                city_id || null,
                area_id || null,
            ]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error saving shipping address :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================================
// ORDERS
// ================================

let ordersTableEnsured = false;

const ensureOrdersTable = async () => {
    if (ordersTableEnsured) return;

    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE,
            address_line TEXT,
            country_id INTEGER,
            state_id INTEGER,
            city_id INTEGER,
            area_id INTEGER,
            price DECIMAL,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    ordersTableEnsured = true;
};

export const placeOrder = async (req, res) => {
    try {
        await ensureOrdersTable();

        const userId = req.user?.id;
        const {
            address_line,
            country_id,
            state_id,
            city_id,
            area_id,
            price,
            description
        } = req.body;

        const result = await pool.query(
            `
                INSERT INTO orders
                    (user_id, address_line, country_id, state_id, city_id, area_id, price, description)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `,
            [
                userId,
                address_line || null,
                country_id || null,
                state_id || null,
                city_id || null,
                area_id || null,
                price || 0,
                description || ""
            ]
        );

        res.status(201).json({ message: "Order placed successfully", order: result.rows[0] });
    } catch (error) {
        console.error("Error placing order :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrders = async (req, res) => {
    try {
        await ensureOrdersTable();

        const userId = req.user?.id;
        const result = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching orders :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../../config/db.js";

let userAddressesTableEnsured = false;

const ensureUserAddressesTable = async () => {
    if (userAddressesTableEnsured) return;

    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_addresses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
            label TEXT,
            full_name TEXT,
            phone TEXT,
            email TEXT,
            address_line TEXT,
            pincode TEXT,
            country_id INTEGER REFERENCES country(id) ON DELETE SET NULL,
            state_id INTEGER REFERENCES state(id) ON DELETE SET NULL,
            city_id INTEGER REFERENCES city(id) ON DELETE SET NULL,
            area_id INTEGER REFERENCES area(id) ON DELETE SET NULL,
            is_default BOOLEAN NOT NULL DEFAULT FALSE,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id)`);
    await pool.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS ux_user_addresses_default_per_user
         ON user_addresses(user_id)
         WHERE is_default = TRUE AND is_active = TRUE`
    );

    // Best-effort migration from legacy single-address table (if it exists)
    try {
        await pool.query(`
            INSERT INTO user_addresses
                (user_id, full_name, phone, email, address_line, pincode, country_id, state_id, city_id, area_id, is_default)
            SELECT
                usa.user_id,
                usa.full_name,
                usa.phone,
                usa.email,
                usa.address_line,
                usa.pincode,
                usa.country_id,
                usa.state_id,
                usa.city_id,
                usa.area_id,
                TRUE
            FROM user_shipping_address usa
            WHERE NOT EXISTS (
                SELECT 1 FROM user_addresses ua WHERE ua.user_id = usa.user_id
            )
        `);
    } catch {
        // ignore if user_shipping_address doesn't exist
    }

    userAddressesTableEnsured = true;
};

export const getMyAddresses = async (req, res) => {
    try {
        await ensureUserAddressesTable();

        const userId = req.user?.id;
        const result = await pool.query(
            `
                SELECT
                    ua.*,
                    c.name AS country_name,
                    s.name AS state_name,
                    ci.name AS city_name,
                    a.name AS area_name
                FROM user_addresses ua
                LEFT JOIN country c ON c.id = ua.country_id
                LEFT JOIN state s ON s.id = ua.state_id
                LEFT JOIN city ci ON ci.id = ua.city_id
                LEFT JOIN area a ON a.id = ua.area_id
                WHERE ua.user_id = $1 AND ua.is_active = TRUE
                ORDER BY ua.is_default DESC, ua.updated_at DESC, ua.id DESC
            `,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching addresses :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addMyAddress = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureUserAddressesTable();

        const userId = req.user?.id;
        const {
            label,
            full_name,
            phone,
            email,
            address_line,
            pincode,
            country_id,
            state_id,
            city_id,
            area_id,
            is_default,
        } = req.body;

        await client.query("BEGIN");

        // If this is the first address, default it.
        const existingCount = await client.query(
            `SELECT COUNT(*)::int AS count FROM user_addresses WHERE user_id = $1 AND is_active = TRUE`,
            [userId]
        );

        const shouldDefault = Boolean(is_default) || existingCount.rows[0]?.count === 0;

        if (shouldDefault) {
            await client.query(
                `UPDATE user_addresses SET is_default = FALSE, updated_at = NOW()
                 WHERE user_id = $1 AND is_active = TRUE`,
                [userId]
            );
        }

        const result = await client.query(
            `
                INSERT INTO user_addresses
                    (user_id, label, full_name, phone, email, address_line, pincode, country_id, state_id, city_id, area_id, is_default)
                VALUES
                    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                RETURNING *
            `,
            [
                userId,
                label || null,
                full_name || null,
                phone || null,
                email || null,
                address_line || null,
                pincode || null,
                country_id || null,
                state_id || null,
                city_id || null,
                area_id || null,
                shouldDefault,
            ]
        );

        await client.query("COMMIT");
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error adding address :", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
};

export const updateMyAddress = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureUserAddressesTable();

        const userId = req.user?.id;
        const addressId = Number(req.params.id);
        const {
            label,
            full_name,
            phone,
            email,
            address_line,
            pincode,
            country_id,
            state_id,
            city_id,
            area_id,
            is_default,
        } = req.body;

        await client.query("BEGIN");

        if (is_default) {
            await client.query(
                `UPDATE user_addresses SET is_default = FALSE, updated_at = NOW()
                 WHERE user_id = $1 AND is_active = TRUE`,
                [userId]
            );
        }

        const result = await client.query(
            `
                UPDATE user_addresses SET
                    label = $1,
                    full_name = $2,
                    phone = $3,
                    email = $4,
                    address_line = $5,
                    pincode = $6,
                    country_id = $7,
                    state_id = $8,
                    city_id = $9,
                    area_id = $10,
                    is_default = CASE WHEN $11::boolean IS TRUE THEN TRUE ELSE is_default END,
                    updated_at = NOW()
                WHERE id = $12 AND user_id = $13 AND is_active = TRUE
                RETURNING *
            `,
            [
                label || null,
                full_name || null,
                phone || null,
                email || null,
                address_line || null,
                pincode || null,
                country_id || null,
                state_id || null,
                city_id || null,
                area_id || null,
                Boolean(is_default),
                addressId,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Address not found" });
        }

        await client.query("COMMIT");
        res.status(200).json(result.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating address :", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
};

export const setMyDefaultAddress = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureUserAddressesTable();

        const userId = req.user?.id;
        const addressId = Number(req.params.id);

        await client.query("BEGIN");

        const exists = await client.query(
            `SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2 AND is_active = TRUE`,
            [addressId, userId]
        );
        if (exists.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Address not found" });
        }

        await client.query(
            `UPDATE user_addresses SET is_default = FALSE, updated_at = NOW()
             WHERE user_id = $1 AND is_active = TRUE`,
            [userId]
        );
        await client.query(
            `UPDATE user_addresses SET is_default = TRUE, updated_at = NOW()
             WHERE id = $1 AND user_id = $2 AND is_active = TRUE`,
            [addressId, userId]
        );

        await client.query("COMMIT");
        res.status(200).json({ message: "Default address updated" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error setting default address :", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
};

export const deleteMyAddress = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureUserAddressesTable();

        const userId = req.user?.id;
        const addressId = Number(req.params.id);

        await client.query("BEGIN");

        const result = await client.query(
            `
                UPDATE user_addresses
                SET is_active = FALSE, is_default = FALSE, updated_at = NOW()
                WHERE id = $1 AND user_id = $2 AND is_active = TRUE
                RETURNING id
            `,
            [addressId, userId]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Address not found" });
        }

        // If they deleted default, pick another as default (if exists)
        await client.query(
            `
                UPDATE user_addresses ua SET is_default = TRUE, updated_at = NOW()
                WHERE ua.id = (
                    SELECT id FROM user_addresses
                    WHERE user_id = $1 AND is_active = TRUE
                    ORDER BY updated_at DESC, id DESC
                    LIMIT 1
                )
                AND NOT EXISTS (
                    SELECT 1 FROM user_addresses
                    WHERE user_id = $1 AND is_active = TRUE AND is_default = TRUE
                )
            `,
            [userId]
        );

        await client.query("COMMIT");
        res.status(200).json({ message: "Address deleted" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error deleting address :", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
};


// controllers/orderController.js
import db from "../../config/db.js"; // your pg connection

let ordersEnsured = false;

const ensureOrderTables = async () => {
    if (ordersEnsured) return;

    // Ensure addresses table exists (orders may reference it)
    await db.query(`
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

    await db.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
            total_amount NUMERIC NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'PLACED',
            shipping_address_id INTEGER REFERENCES user_addresses(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS order_addresses (
            order_id INTEGER PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
            user_address_id INTEGER REFERENCES user_addresses(id) ON DELETE SET NULL,
            full_name TEXT,
            phone TEXT,
            email TEXT,
            address_line TEXT,
            pincode TEXT,
            country_name TEXT,
            state_name TEXT,
            city_name TEXT,
            area_name TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER,
            product_name TEXT NOT NULL,
            price NUMERIC NOT NULL DEFAULT 0,
            quantity INTEGER NOT NULL DEFAULT 1,
            image TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    // In case tables already exist without some newer columns
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id INTEGER`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PLACED'`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    await db.query(`ALTER TABLE order_addresses ADD COLUMN IF NOT EXISTS user_address_id INTEGER`);
    await db.query(`ALTER TABLE order_addresses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);

    ordersEnsured = true;
};

export const placeOrder = async (req, res) => {
    const client = await db.connect();
    try {
        await ensureOrderTables();
        const userId = req.user.id;

        const {
            address_id,
            full_name,
            phone,
            email,
            address_line,
            pincode,
            country_id,
            state_id,
            city_id,
            area_id,
            total_amount,
            items,
        } = req.body;

        console.log("Incoming order:", req.body);

        await client.query("BEGIN");

        let resolved = {
            full_name,
            phone,
            email,
            address_line,
            pincode,
            country_id,
            state_id,
            city_id,
            area_id,
            user_address_id: null,
        };

        if (address_id) {
            const addr = await client.query(
                `
                    SELECT *
                    FROM user_addresses
                    WHERE id = $1 AND user_id = $2 AND is_active = TRUE
                `,
                [address_id, userId]
            );
            if (addr.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Address not found" });
            }
            const a = addr.rows[0];
            resolved = {
                full_name: a.full_name,
                phone: a.phone,
                email: a.email,
                address_line: a.address_line,
                pincode: a.pincode,
                country_id: a.country_id,
                state_id: a.state_id,
                city_id: a.city_id,
                area_id: a.area_id,
                user_address_id: a.id,
            };
        }

        if (!resolved.address_line) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Address is required" });
        }

        //  1. Get names from master tables
        const country = await client.query(
            "SELECT name FROM country WHERE id = $1",
            [resolved.country_id]
        );

        const state = await client.query(
            "SELECT name FROM state WHERE id = $1",
            [resolved.state_id]
        );

        const city = await client.query(
            "SELECT name FROM city WHERE id = $1",
            [resolved.city_id]
        );

        const area = await client.query(
            "SELECT name FROM area WHERE id = $1",
            [resolved.area_id]
        );

        //  2. Insert Order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, status)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [userId, Number(total_amount) || 1000, "PLACED"] // replace 1000 with cart total later
        );

        const orderId = orderResult.rows[0].id;

        console.log("Order created ID:", orderId);

        if (resolved.user_address_id) {
            await client.query(
                `UPDATE orders SET shipping_address_id = $1 WHERE id = $2 AND user_id = $3`,
                [resolved.user_address_id, orderId, userId]
            );
        }

        //  3. Insert Address Snapshot
        await client.query(
            `INSERT INTO order_addresses
            (order_id, user_address_id, full_name, phone, email, address_line, pincode,
             country_name, state_name, city_name, area_name)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
                orderId,
                resolved.user_address_id,
                resolved.full_name,
                resolved.phone,
                resolved.email,
                resolved.address_line,
                resolved.pincode,
                country.rows[0]?.name || "",
                state.rows[0]?.name || "",
                city.rows[0]?.name || "",
                area.rows[0]?.name || "",
            ]
        );

        if (Array.isArray(items) && items.length > 0) {
            for (const it of items) {
                const productId = it?.product_id ?? it?.id ?? null;
                const productName = it?.product_name ?? it?.name ?? "";
                const price = Number(it?.price) || 0;
                const quantity = Number(it?.quantity ?? it?.qty) || 1;
                const image = it?.image ?? null;

                if (!productName) continue;

                await client.query(
                    `
                        INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `,
                    [orderId, productId, productName, price, quantity, image]
                );
            }
        }

        await client.query("COMMIT");
        res.json({
            message: "Order placed successfully ",
            orderId,
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("ORDER ERROR:", error);
        res.status(500).json({
            message: "Order failed ",
        });
    } finally {
        client.release();
    }
};

export const getMyOrders = async (req, res) => {
    try {
        await ensureOrderTables();
        const userId = req.user.id;

        const result = await db.query(
            `
                SELECT
                    o.id,
                    o.total_amount,
                    o.status,
                    o.created_at,
                    oa.full_name,
                    oa.phone,
                    oa.email,
                    oa.address_line,
                    oa.pincode,
                    oa.country_name,
                    oa.state_name,
                    oa.city_name,
                    oa.area_name,
                    COALESCE(oi.items, '[]'::json) AS items
                FROM orders o
                LEFT JOIN order_addresses oa ON oa.order_id = o.id
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'product_id', item.product_id,
                            'product_name', item.product_name,
                            'price', item.price,
                            'quantity', item.quantity,
                            'image', item.image
                        )
                        ORDER BY item.id ASC
                    ) AS items
                    FROM order_items item
                    WHERE item.order_id = o.id
                ) oi ON TRUE
                WHERE o.user_id = $1
                ORDER BY o.created_at DESC, o.id DESC
            `,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        await ensureOrderTables();

        const requesterId = req.user?.id;
        const role = await db.query(`SELECT role FROM user_info WHERE id = $1`, [requesterId]);
        if (role.rows[0]?.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        const result = await db.query(
            `
                SELECT
                    o.id,
                    o.total_amount,
                    o.status,
                    o.created_at,
                    u.id AS user_id,
                    u.username,
                    u.email AS user_email,
                    u.phone AS user_phone,
                    oa.full_name AS shipping_full_name,
                    oa.phone AS shipping_phone,
                    oa.email AS shipping_email,
                    oa.address_line,
                    oa.pincode,
                    oa.country_name,
                    oa.state_name,
                    oa.city_name,
                    oa.area_name,
                    COALESCE(oi.items, '[]'::json) AS items
                FROM orders o
                JOIN user_info u ON u.id = o.user_id
                LEFT JOIN order_addresses oa ON oa.order_id = o.id
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'product_id', item.product_id,
                            'product_name', item.product_name,
                            'price', item.price,
                            'quantity', item.quantity,
                            'image', item.image
                        )
                        ORDER BY item.id ASC
                    ) AS items
                    FROM order_items item
                    WHERE item.order_id = o.id
                ) oi ON TRUE
                ORDER BY o.created_at DESC, o.id DESC
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("GET ALL ORDERS ADMIN ERROR:", error);
        res.status(500).json({ message: "Failed to fetch admin orders" });
    }
};

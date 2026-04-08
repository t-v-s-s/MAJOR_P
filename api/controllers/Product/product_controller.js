import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

/* =========================
   Add Product
========================= */
export const addProduct = async (req, res) => {
    console.log("addProduct called")
    try {
        const { product_name, price, description } = req.body;
        const image = req.file ? req.file.filename : null;

        const result = await pool.query(
            "INSERT INTO products (product_name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *",
            [product_name || null, price !== undefined ? price : null, description || null, image || null]
        );

        res.json({
            message: "Product added",
            product: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =========================
   Get All Products
========================= */
export const getProducts = async (req, res) => {
    console.log("Called getProducts")
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id Asc");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =========================
   Get Single Product
========================= */
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =========================
   Update Product
========================= */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, price, category } = req.body;
        const image = req.file ? req.file.filename : null;

        const result = await pool.query(
            "UPDATE products SET product_name=COALESCE($1, product_name), price=COALESCE($2, price), category=COALESCE($3, category), image=COALESCE($4, image) WHERE id=$5 RETURNING *",
            [product_name || null, price !== undefined ? price : null, category || null, image || null, id]
        );
        res.json({
            message: "Product updated",
            product: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* =========================
   Delete Product
========================= */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM products WHERE id = $1", [id]);

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get Products By Category

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const result = await pool.query(
            "SELECT * FROM products WHERE category = $1",
            [category]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
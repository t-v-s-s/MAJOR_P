import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Product() {
    const [productData, setProductData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productName, setProductName] = useState("");

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [discounts, setDiscounts] = useState("");
    const [information, setInformation] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 5;

    //  FILTER FIRST
    const filteredProducts = productData.filter((p) =>
        (p.product_name || "").toLowerCase().includes(search.toLowerCase())
    );

    // PAGINATION ON FILTERED DATA
    const totalPages = Math.ceil(filteredProducts.length / limit);

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * limit,
        page * limit
    );

    const [editId, setEditId] = useState(null);

    const resetForm = () => {
        setProductName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setDiscounts("");
        setInformation("");
        setImage(null);
        setExistingImage(null);
        setIsLoadingProduct(false);
        setLoadError("");
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // FETCH PRODUCTS WITH TOKEN
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:3000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProductData(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddProduct = () => {
        setEditId(null);
        resetForm();
        setShowModal(true);
    };

    const fetchProductById = async (id) => {
        const token = localStorage.getItem("token");
        const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined;

        const res = await axios.get(
            `http://localhost:3000/api/products/${id}`,
            config
        );

        return res.data;
    };

    const handleEdit = async (product) => {
        setEditId(product.id);
        setShowModal(true);
        setLoadError("");

        // Prefill from current row for instant UI, then load latest from API.
        setProductName(product.product_name || "");
        setPrice(product.price || "");
        setDescription(product.description || "");
        setCategory(product.category || "");
        setDiscounts(product.discounts ?? "");
        setInformation(product.information ?? "");
        setExistingImage(product.image || null);
        setImage(null);

        try {
            setIsLoadingProduct(true);
            const latest = await fetchProductById(product.id);
            if (latest) {
                setProductName(latest.product_name || "");
                setPrice(latest.price || "");
                setDescription(latest.description || "");
                setCategory(latest.category || "");
                setDiscounts(latest.discounts ?? "");
                setInformation(latest.information ?? "");
                setExistingImage(latest.image || null);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setLoadError("Could not load latest product info.");
        } finally {
            setIsLoadingProduct(false);
        }
    };

    // DELETE WITH TOKEN
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:3000/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // SAVE product
    const saveProduct = async () => {
        try {
            const token = localStorage.getItem("token");

            // VALIDATION
            if (!productName || !price || !category) {
                alert("Please fill all required fields");
                return;
            }

            //  USE FORMDATA
            const formData = new FormData();
            formData.append("product_name", productName);
            formData.append("price", price);
            if (description) formData.append("description", description);
            formData.append("category", category);
            if (discounts !== "") formData.append("discounts", discounts);
            if (information) formData.append("information", information);
            if (image) formData.append("image", image);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            if (editId) {
                await axios.put(
                    `http://localhost:3000/api/products/${editId}`,
                    formData,
                    config
                );
            } else {
                await axios.post(
                    "http://localhost:3000/api/products",
                    formData,
                    config
                );
            }



            // RESET + REFRESH
            setShowModal(false);
            resetForm();

            fetchProducts();
            setEditId(null);


            //  POPUP
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);

        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <>
            {showPopup && (
                <Motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        background: "#22c55e",
                        color: "white",
                        padding: "14px 22px",
                        borderRadius: "10px"
                    }}
                >
                    {editId ? "Product Updated" : "Product Added"}
                </Motion.div>
            )}

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "12px",
                            width: "300px",
                            textAlign: "center"
                        }}
                    >
                        <h3>{editId ? "Edit Product" : "Add Product"}</h3>
                        {isLoadingProduct && (
                            <p style={{ marginTop: "6px", fontSize: "12px", color: "#777" }}>
                                Loading latest product info...
                            </p>
                        )}
                        {loadError && (
                            <p style={{ marginTop: "6px", fontSize: "12px", color: "#dc2626" }}>
                                {loadError}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />
                        {/* Price */}
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />

                        {/* Description  */}
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />

                        {/* CATEGORY */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Cosmetics">Cosmetics</option>
                            <option value="Decor">Decor</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Furniture">Furniture</option>
                        </select>

                        {/* DISCOUNTS */}
                        <input
                            type="number"
                            placeholder="Discount (optional)"
                            value={discounts}
                            onChange={(e) => setDiscounts(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />

                        {/* INFORMATION */}
                        <input
                            type="text"
                            placeholder="Information (optional)"
                            value={information}
                            onChange={(e) => setInformation(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}
                        />

                        {editId && existingImage && (
                            <div style={{ marginTop: "10px", textAlign: "left" }}>
                                <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
                                    Current image:
                                </div>
                                <img
                                    src={`http://localhost:3000/uploads/${existingImage}`}
                                    alt="Current product"
                                    width="70"
                                    style={{ borderRadius: "8px", border: "1px solid #eee" }}
                                />
                            </div>
                        )}

                        {/* IMAGE */}
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{
                                width: "100%",
                                marginTop: "10px"
                            }}
                        />

                        <div style={{ marginTop: "15px" }}>
                            <button
                                onClick={saveProduct}
                                disabled={isLoadingProduct}
                                style={{
                                    background: "#22c55e",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 15px",
                                    marginRight: "10px",
                                    borderRadius: "6px"
                                }}
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditId(null);
                                    resetForm();
                                }}
                                style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 15px",
                                    borderRadius: "6px"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </Motion.div>
                </div>
            )}


            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    marginTop: "10px",
                    background: "rgba(255,255,255,0.8)",
                    padding: "20px",
                    borderRadius: "15px"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>


                    <h2>Product List</h2>
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                        <div className="card">Total Products: {productData.length}</div>
                        <div className="card">Categories: 6</div>
                    </div>

                    <button
                        onClick={handleAddProduct}
                        style={{
                            background: "#f97316",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                    <thead>
                        <tr style={{ background: "#fff3eb" }}>
                            <th style={{ padding: "12px" }}>ID</th>
                            <th style={{ padding: "12px" }}>Product Name</th>
                            <th style={{ padding: "12px" }}>Price</th>
                            <th style={{ padding: "12px" }}>Description</th>
                            <th style={{ padding: "12px" }}>Category</th>
                            <th style={{ padding: "12px" }}>Discount</th>
                            <th style={{ padding: "12px" }}>Image</th>
                            <th style={{ padding: "12px" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={{ padding: "12px" }}>{product.id}</td>
                                <td style={{ padding: "12px" }}>{product.product_name}</td>
                                <td style={{ padding: "12px" }}>{product.price}</td>
                                <td style={{ padding: "12px" }}>{product.description}</td>
                                <td style={{ padding: "12px" }}>{product.category || "-"}</td>
                                <td style={{ padding: "12px" }}>{product.discounts ?? "-"}</td>
                                <td style={{ padding: "12px" }}>
                                    {product.image && (
                                        <img
                                            src={`http://localhost:3000/uploads/${product.image}`}
                                            width="50"
                                        />
                                    )}
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <button onClick={() => handleEdit(product)}>
                                        <Pencil size={18} color="#f97316" />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}>
                                        <Trash2 size={18} color="#ef4444" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    gap: "10px"
                }}>
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        style={{
                            padding: "8px 12px",
                            background: page === 1 ? "#ccc" : "#f97316",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Prev
                    </button>

                    <span style={{ padding: "8px 12px" }}>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        style={{
                            padding: "8px 12px",
                            background: page === totalPages ? "#ccc" : "#f97316",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Next
                    </button>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // VERY IMPORTANT
                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            width: "250px"
                        }}
                    />
                </div>

            </Motion.div>
        </>
    );
}

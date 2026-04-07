import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Product() {
    const [productData, setProductData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productName, setProductName] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        console.log("fetchProducts called")
        try {
            const res = await axios.get("http://localhost:3000/api/products");
            setProductData(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddProduct = () => {
        setEditId(null);
        setProductName("");
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setProductName(product.name);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const saveProduct = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:3000/api/products/${editId}`, {
                    name: productName
                });
            } else {
                await axios.post("http://localhost:3000/api/products", {
                    name: productName
                });
            }

            setShowModal(false);
            setProductName("");
            setEditId(null);
            fetchProducts();

            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);

        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <>
            {showPopup && (
                <motion.div
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
                </motion.div>
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
                    <motion.div
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

                        <div style={{ marginTop: "15px" }}>
                            <button
                                onClick={saveProduct}
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
                                onClick={() => setShowModal(false)}
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
                    </motion.div>
                </div>
            )}

            <motion.div
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
                            <th style={{ padding: "12px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.map((product) => (
                            <tr key={product.id}>
                                <td style={{ padding: "12px" }}>{product.id}</td>
                                <td style={{ padding: "12px" }}>{product.product_name}</td>
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
            </motion.div>
        </>
    );
}
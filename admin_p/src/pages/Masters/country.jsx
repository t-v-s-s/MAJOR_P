import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Country() {
    const [countryData, setCountryData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/master/country");
            setCountryData(res.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    // ADD
    const handleAddCountry = () => {
        setEditId(null);
        setCountryName("");
        setShowModal(true);
    };

    // EDIT
    const handleEdit = (item) => {
        setEditId(item.id);
        setCountryName(item.name);
        setShowModal(true);
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this country?")) return;

        try {
            await axios.delete(`http://localhost:3000/api/master/country/${id}`);
            fetchCountries();
        } catch (error) {
            console.error("Error deleting country:", error);
        }
    };

    // SAVE
    const saveCountry = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:3000/api/master/country/${editId}`, {
                    name: countryName
                });
            } else {
                await axios.post("http://localhost:3000/api/master/country", {
                    name: countryName
                });
            }

            setCountryName("");
            setEditId(null);
            setShowModal(false);
            fetchCountries();

            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);

        } catch (error) {
            console.error("Error saving country:", error);
        }
    };

    const iconButtonStyle = {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        marginRight: "10px"
    };

    const thStyle = {
        padding: "12px",
        textAlign: "left",
        color: "#555"
    };

    const tdStyle = {
        padding: "12px",
        color: "#666"
    };

    const popupStyle = {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#22c55e",
        color: "white",
        padding: "14px 22px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
        fontWeight: "500"
    };

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    };

    const modalStyle = {
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        width: "300px",
        textAlign: "center"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    };

    return (
        <>
            {/* Popup */}
            {showPopup && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={popupStyle}
                >
                    {editId ? "Country Updated Successfully" : "Country Added Successfully"}
                </motion.div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={overlayStyle}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={modalStyle}
                    >
                        <h3>{editId ? "Edit Country" : "Add Country"}</h3>

                        <input
                            type="text"
                            placeholder="Enter country name"
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                            style={inputStyle}
                        />

                        <div style={{ marginTop: "15px" }}>
                            <button
                                onClick={saveCountry}
                                style={{
                                    background: "#22c55e",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 15px",
                                    marginRight: "10px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
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
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    marginTop: "10px",
                    background: "rgba(255,255,255,0.8)",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#555" }}>
                        Country List
                    </h2>

                    <button
                        onClick={handleAddCountry}
                        style={{
                            border: "none",
                            background: "#f97316",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <Plus size={18} />
                        Add Country
                    </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px" }}>
                    <thead>
                        <tr style={{ background: "#fff3eb" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Country Name</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countryData.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={tdStyle}>{item.id}</td>
                                <td style={tdStyle}>{item.name}</td>
                                <td style={tdStyle}>
                                    <button onClick={() => handleEdit(item)} style={iconButtonStyle}>
                                        <Pencil size={18} color="#f97316" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={iconButtonStyle}>
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
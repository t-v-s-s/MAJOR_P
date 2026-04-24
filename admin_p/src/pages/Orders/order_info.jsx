import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { Eye, RefreshCcw, X } from "lucide-react";

export default function OrderInfo() {
    const token = localStorage.getItem("token");

    const api = useMemo(() => {
        return axios.create({
            baseURL: "http://localhost:3000",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }, [token]);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 8;

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/orders/admin/all");
            setOrders(res.data || []);
        } catch (e) {
            console.error(e);
            setOrders([]);
            setError(e.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = orders.filter((o) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        const hay = [
            o.id,
            o.username,
            o.user_email,
            o.shipping_email,
            o.address_line,
            o.status,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return hay.includes(q);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const pageSafe = Math.min(Math.max(1, page), totalPages);
    const paginated = filtered.slice((pageSafe - 1) * limit, pageSafe * limit);

    const thStyle = {
        padding: "12px",
        textAlign: "left",
        color: "#555",
        fontSize: "13px",
        whiteSpace: "nowrap",
    };
    const tdStyle = {
        padding: "12px",
        color: "#666",
        fontSize: "13px",
        verticalAlign: "top",
    };

    const formatDateTime = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return String(iso);
        return d.toLocaleString();
    };

    const formatMoney = (value) => {
        const n = Number(value);
        if (!Number.isFinite(n)) return value ?? "";
        return n.toFixed(2);
    };

    const addressOneLine = (o) => {
        const line = o.address_line || "";
        const parts = [o.area_name, o.city_name, o.state_name, o.country_name].filter(Boolean);
        const region = parts.length ? `, ${parts.join(", ")}` : "";
        const pin = o.pincode ? ` - ${o.pincode}` : "";
        return `${line}${region}${pin}`.trim();
    };

    const itemSummary = (items) => {
        if (!Array.isArray(items) || items.length === 0) return "—";
        const names = items.map((i) => i.product_name).filter(Boolean);
        if (names.length === 0) return "—";
        const head = names.slice(0, 2).join(", ");
        return names.length > 2 ? `${head} +${names.length - 2}` : head;
    };

    return (
        <>
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    marginTop: "10px",
                    background: "rgba(255,255,255,0.8)",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#444" }}>
                            Orders
                        </h2>
                        <p style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
                            Shows all placed orders with shipping snapshot.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by user, email, order id..."
                            style={{
                                padding: "10px 12px",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                outline: "none",
                                minWidth: "260px",
                            }}
                        />

                        <button
                            onClick={fetchOrders}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 12px",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <RefreshCcw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#fef2f2",
                            color: "#991b1b",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #fecaca",
                            marginBottom: "12px",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        borderRadius: "10px",
                        overflow: "hidden",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#fff3eb" }}>
                            <th style={thStyle}>Order</th>
                            <th style={thStyle}>User</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Items</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td style={tdStyle} colSpan={9}>
                                    Loading...
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td style={tdStyle} colSpan={9}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((o) => (
                                <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={tdStyle}>#{o.id}</td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 600, color: "#444" }}>
                                            {o.username || "—"}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                                            {o.shipping_full_name || ""}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div>{o.user_email || "—"}</div>
                                        {o.shipping_email && (
                                            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                                                Ship: {o.shipping_email}
                                            </div>
                                        )}
                                    </td>
                                    <td style={tdStyle}>{itemSummary(o.items)}</td>
                                    <td style={tdStyle}>
                                        <div style={{ maxWidth: "360px" }}>{addressOneLine(o) || "—"}</div>
                                    </td>
                                    <td style={tdStyle}>₹{formatMoney(o.total_amount)}</td>
                                    <td style={tdStyle}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "6px 10px",
                                                borderRadius: "999px",
                                                background: "#dcfce7",
                                                color: "#166534",
                                                fontWeight: 600,
                                                fontSize: "12px",
                                            }}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{formatDateTime(o.created_at)}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => setSelected(o)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 10px",
                                                borderRadius: "10px",
                                                border: "1px solid #e5e7eb",
                                                background: "#fff",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "14px",
                        gap: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ fontSize: "12px", color: "#777" }}>
                        Showing {(pageSafe - 1) * limit + 1}-{Math.min(pageSafe * limit, filtered.length)} of{" "}
                        {filtered.length}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pageSafe === 1}
                            style={{
                                padding: "8px 10px",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                cursor: pageSafe === 1 ? "not-allowed" : "pointer",
                                opacity: pageSafe === 1 ? 0.6 : 1,
                            }}
                        >
                            Prev
                        </button>
                        <div style={{ fontSize: "12px", color: "#777" }}>
                            Page {pageSafe} / {totalPages}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={pageSafe === totalPages}
                            style={{
                                padding: "8px 10px",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                cursor: pageSafe === totalPages ? "not-allowed" : "pointer",
                                opacity: pageSafe === totalPages ? 0.6 : 1,
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Motion.div>

            {selected && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 50,
                    }}
                >
                    <Motion.div
                        initial={{ x: 120, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{
                            width: "100%",
                            maxWidth: "520px",
                            background: "#fff",
                            height: "100%",
                            padding: "18px",
                            overflowY: "auto",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#444" }}>
                                    Order #{selected.id}
                                </h3>
                                <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
                                    {formatDateTime(selected.created_at)} • {selected.status}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#555" }}>Customer</h4>
                            <div style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
                                <div style={{ fontWeight: 600, color: "#444" }}>{selected.username || "—"}</div>
                                <div>{selected.user_email || "—"}</div>
                                {selected.user_phone && <div>{selected.user_phone}</div>}
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#555" }}>Shipping Address</h4>
                            <div
                                style={{
                                    marginTop: "8px",
                                    background: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    fontSize: "13px",
                                    color: "#666",
                                }}
                            >
                                <div style={{ fontWeight: 600, color: "#444" }}>
                                    {selected.shipping_full_name || "—"}
                                </div>
                                <div>{addressOneLine(selected) || "—"}</div>
                                {selected.shipping_phone && <div style={{ marginTop: "8px" }}>Phone: {selected.shipping_phone}</div>}
                                {selected.shipping_email && <div>Email: {selected.shipping_email}</div>}
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#555" }}>Items</h4>
                            <div style={{ marginTop: "10px" }}>
                                {Array.isArray(selected.items) && selected.items.length > 0 ? (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ background: "#fff3eb" }}>
                                                <th style={{ ...thStyle, fontSize: "12px" }}>Product</th>
                                                <th style={{ ...thStyle, fontSize: "12px" }}>Qty</th>
                                                <th style={{ ...thStyle, fontSize: "12px" }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selected.items.map((it, idx) => (
                                                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                                    <td style={{ ...tdStyle, fontSize: "12px" }}>{it.product_name}</td>
                                                    <td style={{ ...tdStyle, fontSize: "12px" }}>{it.quantity}</td>
                                                    <td style={{ ...tdStyle, fontSize: "12px" }}>₹{formatMoney(it.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ fontSize: "13px", color: "#777" }}>No item snapshot available.</div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#555" }}>Total</h4>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginTop: "6px" }}>
                                ₹{formatMoney(selected.total_amount)}
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </>
    );
}

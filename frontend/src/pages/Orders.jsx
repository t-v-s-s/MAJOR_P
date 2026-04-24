import { useEffect, useState } from "react";

import axios from "axios";

const steps = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("http://localhost:3000/api/orders/my", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(res.data || []);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const filtered = orders.filter((o) => {
        const matchSearch = o.id.toString().includes(search);
        const matchFilter = filter === "All" || o.status === filter;
        return matchSearch && matchFilter;
    });

    const downloadInvoice = (id) => {
        alert(`Downloading invoice for order #${id}`);
    };

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return String(iso);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const getStepIndex = (status) => {
        const idx = steps.indexOf(String(status || "").toUpperCase());
        return idx === -1 ? 0 : idx;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">My Orders</h1>

                {/* Search + Filter */}
                <div className="flex gap-3 mt-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search order ID..."
                        className="w-full px-4 py-2 border rounded-xl bg-white"
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border rounded-xl bg-white"
                    >
                        <option>All</option>
                        <option>PLACED</option>
                        <option>PACKED</option>
                        <option>SHIPPED</option>
                        <option>DELIVERED</option>
                    </select>
                </div>
            </div>

            {/* Orders */}
            <div className="max-w-4xl mx-auto mt-6 space-y-4">
                {loading ? (
                    Array(2).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
                            <div className="h-4 bg-gray-200 w-1/3 mb-3 rounded" />
                            <div className="h-4 bg-gray-200 w-1/2 rounded" />
                        </div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl text-center text-gray-500">
                        No orders found
                    </div>
                ) : (
                    filtered.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                                    <p className="font-semibold">{formatDate(order.created_at)}</p>
                                    {order.address_line && (
                                        <p className="text-sm text-gray-600 mt-1">{order.address_line}</p>
                                    )}
                                </div>

                                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                    {order.status}
                                </span>
                            </div>

                            {/* timeline */}
                            <div className="flex mt-5 text-xs">
                                {steps.map((s, i) => (
                                    <div key={i} className="flex-1 text-center">
                                        <div
                                            className={`h-1 rounded ${i <= getStepIndex(order.status) ? "bg-blue-500" : "bg-gray-200"
                                                }`}
                                        />
                                        <p className="mt-1 text-gray-500">{s}</p>
                                    </div>
                                ))}
                            </div>

                            {/* actions */}
                            <div className="flex justify-between mt-5">
                                <p className="font-bold">₹{order.total_amount}</p>

                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-blue-600 font-medium"
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* DRAWER */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
                    <div className="w-full max-w-md bg-white h-full p-5 overflow-y-auto">

                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Order #{selectedOrder.id}
                            </h2>
                            <button onClick={() => setSelectedOrder(null)}>✕</button>
                        </div>

                        <p className="text-gray-500">{selectedOrder.status}</p>

                        <div className="mt-5">
                            <h3 className="font-semibold mb-2">Delivery Address</h3>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                                <div className="font-medium text-gray-900">
                                    {selectedOrder.full_name || "—"}
                                </div>
                                <div>{selectedOrder.address_line || "—"}</div>
                                <div>
                                    {[selectedOrder.area_name, selectedOrder.city_name, selectedOrder.state_name, selectedOrder.country_name]
                                        .filter(Boolean)
                                        .join(", ")}
                                </div>
                                <div>{selectedOrder.pincode}</div>
                                {selectedOrder.phone && <div className="mt-2">Phone: {selectedOrder.phone}</div>}
                                {selectedOrder.email && <div>Email: {selectedOrder.email}</div>}
                            </div>
                        </div>

                        {/* tracking */}
                        <div className="mt-5">
                            <h3 className="font-semibold mb-2">Tracking</h3>

                            <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                                Live Map (Google Maps)
                            </div>
                        </div>

                        {/* invoice */}
                        <button
                            onClick={() => downloadInvoice(selectedOrder.id)}
                            className="w-full mt-4 border py-2 rounded-xl"
                        >
                            Download Invoice
                        </button>

                        {/* whatsapp */}
                        <button className="w-full mt-3 bg-green-500 text-white py-2 rounded-xl">
                            WhatsApp Updates
                        </button>

                        {/* actions */}
                        <div className="flex gap-3 mt-5">
                            {selectedOrder.status === "Delivered" ? (
                                <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl">
                                    Return
                                </button>
                            ) : (
                                <button className="flex-1 bg-gray-100 py-2 rounded-xl">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

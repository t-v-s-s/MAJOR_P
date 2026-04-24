import City from "../pages/Masters/city";
import Area from "../pages/Masters/area";
import PropertyType from "../pages/Masters/property_type";
import Country from "../pages/Masters/country";
import State from "../pages/Masters/state";
import User_info from "../pages/Users/user_info";
import Products_info from "../pages/Products/products_info"
import OrderInfo from "../pages/Orders/order_info";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    LogOut,
    ChevronDown,
    ChevronRight,
    Building2,
    MapPinned,
    Map,
    Globe,
    User,
    Package,
    ClipboardList
} from "lucide-react";



export default function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [active, setActive] = useState("home");
    const [masterOpen, setMasterOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [hovered, setHovered] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("username");
        navigate("/login");
    };

    const getMenuItemStyle = (name) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px",
        borderRadius: "10px",
        cursor: "pointer",
        marginBottom: "10px",
        transition: "0.3s",
        background: hovered === name ? "#ffe8d6" : "transparent",
        color: hovered === name ? "#f97316" : "#555"
    });

    const getSubMenuItemStyle = (name) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "10px",
        cursor: "pointer",
        marginBottom: "8px",
        transition: "0.3s",
        background:
            active === name
                ? "#fff3eb"
                : hovered === name
                    ? "#ffe8d6"
                    : "transparent",
        color:
            active === name
                ? "#f97316"
                : hovered === name
                    ? "#f97316"
                    : "#555"
    });

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)"
            }}
        >
            <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{
                    width: "250px",
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "20px",
                    borderRight: "1px solid #ddd"
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#f97316",
                            marginBottom: "25px"
                        }}
                    >
                        Dashboard
                    </h2>

                    <p
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#f97316",
                            textTransform: "uppercase",
                            marginBottom: "15px",
                            letterSpacing: "1px"
                        }}
                    >
                        Menu
                    </p>

                    <div
                        onClick={() => setActive("home")}
                        onMouseEnter={() => setHovered("home")}
                        onMouseLeave={() => setHovered("")}
                        style={getMenuItemStyle("home")}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </div>

                    <div
                        onClick={() => setMasterOpen(!masterOpen)}
                        onMouseEnter={() => setHovered("master")}
                        onMouseLeave={() => setHovered("")}
                        style={{
                            ...getMenuItemStyle("master"),
                            justifyContent: "space-between"
                        }}
                    >
                        <span style={{ fontWeight: "500" }}>Master</span>
                        {masterOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>

                    {masterOpen && (
                        <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                            <div
                                onClick={() => setActive("property type")}
                                onMouseEnter={() => setHovered("property type")}
                                onMouseLeave={() => setHovered("")}
                                style={getSubMenuItemStyle("property type")}
                            >
                                <Building2 size={18} />
                                <span>Property Type</span>
                            </div>

                            <div
                                onClick={() => setActive("city")}
                                onMouseEnter={() => setHovered("city")}
                                onMouseLeave={() => setHovered("")}
                                style={getSubMenuItemStyle("city")}
                            >
                                <MapPinned size={18} />
                                <span>City</span>
                            </div>

                            <div
                                onClick={() => setActive("area")}
                                onMouseEnter={() => setHovered("area")}
                                onMouseLeave={() => setHovered("")}
                                style={getSubMenuItemStyle("area")}
                            >
                                <Map size={18} />
                                <span>Area</span>
                            </div>
                            <div
                                onClick={() => setActive("country")}
                                onMouseEnter={() => setHovered("country")}
                                onMouseLeave={() => setHovered("")}
                                style={getSubMenuItemStyle("country")}
                            >
                                <Globe size={18} />
                                <span>Country</span>
                            </div>

                            <div
                                onClick={() => setActive("state")}
                                onMouseEnter={() => setHovered("state")}
                                onMouseLeave={() => setHovered("")}
                                style={getSubMenuItemStyle("state")}
                            >
                                <Map size={18} />
                                <span>State</span>
                            </div>
                        </div>
                    )}

                    <div
                        onClick={() => setActive("user")}
                        onMouseEnter={() => setHovered("user")}
                        onMouseLeave={() => setHovered("")}
                        style={{
                            ...getSubMenuItemStyle("user"),
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <User size={18} />
                            <span>User</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setActive("products")}
                        onMouseEnter={() => setHovered("products")}
                        onMouseLeave={() => setHovered("")}
                        style={getSubMenuItemStyle("products")}
                    >
                        <Package size={20} />
                        <span>Products</span>
                    </div>

                    <div
                        onClick={() => setActive("orders")}
                        onMouseEnter={() => setHovered("orders")}
                        onMouseLeave={() => setHovered("")}
                        style={getSubMenuItemStyle("orders")}
                    >
                        <ClipboardList size={20} />
                        <span>Orders</span>
                    </div>

                </div>

                <button
                    onClick={logout}
                    onMouseEnter={() => setHovered("logout")}
                    onMouseLeave={() => setHovered("")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "12px",
                        background: hovered === "logout" ? "#dc2626" : "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "0.3s"
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </motion.div>

            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto"
                }}
            >
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(10px)",
                        padding: "20px",
                        borderRadius: "15px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        marginBottom: "20px"
                    }}
                >
                    <h2 style={{ fontSize: "20px", color: "#555" }}>
                        Welcome,{" "}
                        <span style={{ color: "#f97316", fontWeight: "bold" }}>
                            {username}
                        </span>{" "}
                        👋
                    </h2>
                </motion.div>

                {active === "home" && (
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
                        <h2 style={{ fontSize: "22px", color: "#555", fontWeight: "bold" }}>
                            Welcome to Dashboard
                        </h2>
                        <p style={{ color: "#777", marginTop: "10px" }}>
                            Select a master item from the left menu to view data.
                        </p>
                    </motion.div>
                )}

                {active === "property type" && <PropertyType />}
                {active === "city" && <City />}
                {active === "area" && <Area />}
                {active === "country" && <Country />}
                {active === "state" && <State />}
                {active === "user" && <User_info />}
                {active === "products" && <Products_info />}
                {active === "orders" && <OrderInfo />}
            </div>
        </div>
    );
}

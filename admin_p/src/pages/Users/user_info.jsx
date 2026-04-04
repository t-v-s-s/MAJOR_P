import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function User_info() {
    const [userInfoData, setUserInfoData] = useState([]);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/user/userinfo");
            setUserInfoData(res.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
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


    return (
        <>
            {/* Main Table */}
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
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px" }}>
                    <thead>
                        <tr style={{ background: "#fff3eb" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userInfoData.map((userinfo) => (
                            <tr key={userinfo.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={tdStyle}>{userinfo.id}</td>
                                <td style={tdStyle}>{userinfo.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </>
    );
}
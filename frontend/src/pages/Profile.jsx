import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        setUser({ username, email });
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top - rect.height / 2) / 35;
        const y = (e.clientX - rect.left - rect.width / 2) / 35;
        setRotate({ x: -x, y: y });
    };

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#f7f9fc] text-[#5aa9c7] text-xl">
                Preparing your soft luxury experience...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] relative overflow-hidden">

            {/* 🌸 Pink + 🌊 Blue ambient glow */}
            <div className="absolute w-[450px] h-[450px] bg-pink-300 opacity-30 blur-3xl rounded-full top-[-120px] right-[-120px]" />
            <div className="absolute w-[450px] h-[450px] bg-blue-300 opacity-30 blur-3xl rounded-full bottom-[-120px] left-[-120px]" />

            {/* 🧊 Glass Card */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setRotate({ x: 0, y: 0 })}
                animate={{ rotateX: rotate.x, rotateY: rotate.y }}
                transition={{ type: "spring", stiffness: 90 }}
                className="relative w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-r from-pink-300 via-blue-300 to-pink-300"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="relative bg-white/60 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-white/40">

                    {/* ✨ Soft shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-40 rounded-3xl pointer-events-none" />

                    {/* 👤 Avatar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center mb-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-white border border-pink-200 flex items-center justify-center text-3xl font-semibold text-blue-400 shadow-md">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <span className="text-pink-400 text-lg mt-2">✿ ✦ ✿</span>
                    </motion.div>

                    {/* 🏷 Title */}
                    <h1 className="text-3xl text-center text-[#1f2a37] font-semibold tracking-wide mb-8">

                    </h1>

                    {/* 📄 Info */}
                    <div className="space-y-5 text-[15px]">
                        <div className="flex justify-between border-b border-blue-100 pb-2">
                            <span className="text-gray-500">Name</span>
                            <span className="text-gray-800 font-medium">
                                {user.username || "Not provided"}
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-pink-100 pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="text-gray-800 font-medium">
                                {user.email || "Not provided"}
                            </span>
                        </div>
                    </div>

                    {/* 🌸 Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className="mt-10 w-full py-3 rounded-xl bg-gradient-to-r from-pink-300 to-blue-300 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        Edit Profile
                    </motion.button>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-xs mt-6 tracking-wide">

                    </p>
                </div>
            </motion.div>
        </div>
    );
}
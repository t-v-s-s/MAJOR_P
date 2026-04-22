import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function DealCard({ product, onExpire }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    // Countdown logic
    useEffect(() => {
        if (!product.dealEndsAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = product.dealEndsAt - now;

            if (distance <= 0) {
                setIsExpired(true);
                setTimeLeft("Expired");
                if (onExpire) setTimeout(() => onExpire(product.id), 1000); // Call onExpire after visually showing expired for a moment
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        // Initial update
        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [product.dealEndsAt, product.id, onExpire]);

    if (isExpired) {

        return null;
    }

    // Determine Best Value (High rating + High discount)
    const isBestValue = product.rating >= 4 && product.discountPercent >= 25;
    const isLimitedTime = product.dealEndsAt && (product.dealEndsAt - new Date().getTime() < 3600000); // Less than 1 hr

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 relative border border-gray-100 flex flex-col h-full"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.discountPercent > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-md bg-opacity-90">
                        🔥 {product.discountPercent}% OFF
                    </span>
                )}
                {isBestValue && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        ⭐ Best Value
                    </span>
                )}
            </div>

            {/* Ending Soon Badge / Timer */}
            {product.dealEndsAt && (
                <div className="absolute top-3 right-3 z-10">
                    <div className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${isLimitedTime ? 'bg-orange-500 text-white animate-pulse' : 'bg-gray-800 text-white'}`}>
                        ⏳ {timeLeft}
                    </div>
                </div>
            )}

            {/* Image */}
            <div className="overflow-hidden relative h-52 bg-gray-50 flex-shrink-0">
                <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay gradient for contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Category & Title */}
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    {product.category}
                </span>

                <h2 className="font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">
                    {product.title}
                </h2>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                {/* Pricing & Add to Cart */}
                <div className="mt-auto">
                    {product.originalPrice > product.price && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-400 line-through text-sm decoration-red-400/50">
                                ₹{product.originalPrice}
                            </span>
                            <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded text-green-700">
                                💰 Price Drop
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
                                ₹{product.price}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                addToCart(product);
                                setAdded(true);
                                setTimeout(() => setAdded(false), 1500);
                            }}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center min-w-[100px] ${added
                                    ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/30"
                                }`}
                        >
                            {added ? (
                                <motion.span
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                >
                                    Added ✔
                                </motion.span>
                            ) : (
                                "Add to Cart"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

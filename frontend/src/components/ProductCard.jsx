import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { motion as Motion } from "framer-motion";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const [added, setAdded] = useState(false);
    const [wishlist, setWishlist] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
        return saved.includes(product.id);
    });
    const [showModal, setShowModal] = useState(false);

    const [rating] = useState(() => Math.floor(Math.random() * 2) + 4);

    const rawPrice = product?.price;
    const priceNumber = typeof rawPrice === "number" ? rawPrice : Number(rawPrice);
    const decimals =
        typeof rawPrice === "string" && rawPrice.includes(".")
            ? Math.min(rawPrice.split(".")[1].length, 2)
            : 0;
    const formatPrice = (value) => {
        if (!Number.isFinite(value)) return rawPrice ?? "";
        if (decimals > 0) return value.toFixed(decimals);
        return String(Math.round(value));
    };

    const discountPercentRaw = product?.discounts ?? product?.discount ?? 0;
    const discountPercent = Number(discountPercentRaw) || 0;
    const hasDiscount = Number.isFinite(priceNumber) && discountPercent > 0;
    const discountedPrice = hasDiscount
        ? priceNumber - (priceNumber * discountPercent) / 100
        : priceNumber;

    // Toggle wishlist
    const toggleWishlist = () => {
        let saved = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (saved.includes(product.id)) {
            saved = saved.filter((id) => id !== product.id);
            setWishlist(false);
        } else {
            saved.push(product.id);
            setWishlist(true);
        }

        localStorage.setItem("wishlist", JSON.stringify(saved));
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition relative">

                {/* Wishlist */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                >
                    {wishlist ? "❤️" : "🤍"}
                </button>

                {/* Image */}
                <div className="overflow-hidden">
                    <img
                        src={`http://localhost:3000/uploads/${product.image}`}
                        alt={product.product_name}
                        className="h-48 w-full object-cover group-hover:scale-110 transition"
                    />
                </div>

                <div className="p-4">

                    <h2 className="font-semibold truncate">
                        {product.product_name}
                    </h2>

                    <p className="text-gray-500 text-sm line-clamp-2">
                        {product.description}
                    </p>

                    {/* Rating */}
                    <div className="text-yellow-400 text-sm">
                        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                    </div>

                    {/* Price + Add */}
                    <div className="flex justify-between items-center mt-3">

                        <div className="price">
                            {hasDiscount ? (
                                <>
                                    <span className="text-lg font-semibold text-green-600">
                                        ₹{formatPrice(discountedPrice)}
                                    </span>

                                    <span className="text-sm text-gray-500 line-through ml-2">
                                        ₹{formatPrice(priceNumber)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-semibold text-blue-600">
                                    ₹{formatPrice(priceNumber)}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                addToCart(product);
                                setAdded(true);
                                setTimeout(() => setAdded(false), 1000);
                            }}
                            className={`px-3 py-1 rounded text-white transition ${added ? "bg-green-500" : "bg-blue-500"
                                }`}
                        >
                            {added ? "Added ✔" : "Add"}
                        </button>
                    </div>

                    {/* Quick View */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-xs text-blue-500 mt-2 hover:underline"
                    >
                        Quick View
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <Motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-5 rounded-2xl w-[90%] max-w-md"
                    >
                        <h2 className="text-xl font-bold">
                            {product.product_name}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {product.description}
                        </p>

                        <p className="mt-3 font-bold text-blue-600">
                            {hasDiscount ? (
                                <>
                                    <span className="text-lg font-semibold text-green-600">
                                        ₹{formatPrice(discountedPrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                        ₹{formatPrice(priceNumber)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-semibold text-blue-600">
                                    ₹{formatPrice(priceNumber)}
                                </span>
                            )}
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 text-red-500"
                        >
                            Close
                        </button>
                    </Motion.div>
                </div>
            )}
        </>
    );
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
                if (isMounted) setProduct(res.data);
            } catch (err) {
                console.error("Error loading product:", err);
                if (isMounted) setError("Could not load product details.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProduct();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const pricing = useMemo(() => {
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

        return { priceNumber, hasDiscount, discountedPrice, formatPrice, discountPercent };
    }, [product]);

    const renderInformation = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
    };

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow max-w-6xl mx-auto w-full px-6 md:px-10 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-blue-600 hover:underline mb-6"
                >
                    ← Back
                </button>

                {loading ? (
                    <div className="bg-white rounded-3xl shadow p-8">
                        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
                        <div className="h-80 bg-gray-200 rounded-2xl mb-6" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-3xl shadow p-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : !product ? (
                    <div className="bg-white rounded-3xl shadow p-8">
                        <p className="text-gray-600">Product not found.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
                            <div className="rounded-2xl overflow-hidden bg-gray-50 border">
                                <img
                                    src={`http://localhost:3000/uploads/${product.image}`}
                                    alt={product.product_name}
                                    className="w-full h-96 object-cover"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {product.product_name}
                                </h1>

                                <p className="text-gray-500 mt-2">
                                    Category:{" "}
                                    <span className="font-medium text-gray-700">
                                        {product.category || "—"}
                                    </span>
                                </p>

                                <div className="mt-5">
                                    {pricing.hasDiscount ? (
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-2xl font-semibold text-green-600">
                                                ₹{pricing.formatPrice(pricing.discountedPrice)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{pricing.formatPrice(pricing.priceNumber)}
                                            </span>
                                            <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                                                {pricing.discountPercent}% OFF
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-semibold text-blue-600">
                                            ₹{pricing.formatPrice(pricing.priceNumber)}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    {product.description || "—"}
                                </p>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                                    >
                                        Go to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t bg-gray-50 p-6 md:p-10">
                            <h2 className="text-xl font-bold mb-4">Product Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white rounded-2xl border p-4">
                                    <div className="text-gray-500 mb-1">Information</div>
                                    <div className="text-gray-800 whitespace-pre-wrap">
                                        {renderInformation(product.information)}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl border p-4">
                                    <div className="text-gray-500 mb-1">Discount</div>
                                    <div className="text-gray-800">
                                        {product.discounts ?? product.discount ?? 0}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}


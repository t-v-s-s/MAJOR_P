import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const categories = [
        { id: 1, name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80" },
        { id: 2, name: "Fashion", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80" },
        { id: 3, name: "Home & Garden", img: "https://plus.unsplash.com/premium_photo-1678836292808-b8dabf70f838?w=900&auto=format&fit=crop&q=60" },
        { id: 4, name: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80" },
    ];

    // Fetch products (adjust API if needed)
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch(() => console.log("Error loading products"));
    }, []);

    return (
        <div className="bg-background text-textmain">

            {/* HEADER */}
            <Header />

            {/* HERO SECTION */}
            <Hero />

            {/* FEATURED CATEGORIES */}
            <section className="px-10 py-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold mb-10 tracking-wide">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate("/shop")}
                            className="relative h-48 rounded-2xl overflow-hidden flex items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer group"
                        >
                            <img
                                src={cat.img}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                            <h3 className="relative z-10 text-white text-xl font-bold tracking-wider">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="px-10 py-20 bg-secondary">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-semibold mb-10 tracking-wide">
                        Trending Products
                    </h2>

                    {products.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {products.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* PREMIUM STORY SECTION */}
            <section className="px-10 py-20 max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-light mb-6">
                    Crafted for Modern Living
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Experience a curated collection of premium products designed
                    to elevate your lifestyle with elegance and simplicity.
                </p>
            </section>

            {/* DEALS SECTION */}
            <section className="bg-accent text-white py-16 text-center">
                <h2 className="text-3xl mb-4">Exclusive Deals</h2>
                <p className="mb-6">Up to 50% off on selected items</p>
                <button
                    onClick={() => navigate("/deals")}
                    className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 transition"
                >
                    Shop Deals
                </button>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
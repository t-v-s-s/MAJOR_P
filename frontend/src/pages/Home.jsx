import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
    const [products, setProducts] = useState([]);

    // Fetch products (adjust API if needed)
    useEffect(() => {
        fetch("http://localhost:3000/products")
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {["Electronics", "Fashion", "Home", "Sports"].map((cat, i) => (
                        <div
                            key={i}
                            className="h-40 bg-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer"
                        >
                            {cat}
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
                <button className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 transition">
                    Shop Deals
                </button>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
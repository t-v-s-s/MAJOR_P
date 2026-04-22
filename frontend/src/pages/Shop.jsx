import React from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

export default function Shop() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow px-10 py-8 max-w-7xl mx-auto w-full">
                {/* Shop Banner */}
                <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden relative mb-12 shadow-lg">
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80" 
                        alt="Shop Banner" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">Explore Our Shop</h1>
                        <p className="text-white/90 text-lg max-w-xl">Find everything you need in our extensive collection of premium products.</p>
                    </div>
                </div>

                <ProductList />
            </div>
            <Footer />
        </div>
    );
}

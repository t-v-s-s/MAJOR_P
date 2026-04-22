import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DealCard from "../components/DealCard";

import {
    normalizeProductData,
    isAppliableDeal,
    sortDeals
} from "../utils/dealsEngine";

export default function Deals() {
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                const normalized = data.map(normalizeProductData);
                const validDeals = normalized.filter(isAppliableDeal);
                const sorted = sortDeals(validDeals, "discount");

                console.log("ALL:", data);
                console.log("NORMALIZED:", normalized);
                console.log("DEALS:", sorted);

                setProducts(normalized);
                setDeals(sorted);
            });
    }, []);

    // remove expired deal from UI
    const handleExpire = (id) => {
        setDeals(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="bg-background min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-10 py-12">
                <h1 className="text-3xl font-bold mb-8">
                    🔥 Hot Deals
                </h1>

                {deals.length === 0 ? (
                    <p>No deals available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {deals.map(product => (
                            <DealCard
                                key={product.id}
                                product={product}
                                onExpire={handleExpire}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
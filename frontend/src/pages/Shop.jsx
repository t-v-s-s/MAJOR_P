import React from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

export default function Shop() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow px-10 py-8">
                <h1 className="text-3xl font-semibold text-textmain mb-8 tracking-wide">Our Shop</h1>
                <ProductList />
            </div>
            <Footer />
        </div>
    );
}

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Categories() {
    const navigate = useNavigate();
    const categories = [
        { id: 1, name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80" },
        { id: 2, name: "Fashion", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80" },
        { id: 3, name: "Home & Garden", img: "https://plus.unsplash.com/premium_photo-1678836292808-b8dabf70f838?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SG9tZSUyMCUyNiUyMEdhcmRlbnxlbnwwfHwwfHx8MA%3D%3D" },
        { id: 4, name: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80" },
    ];

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow px-10 py-10 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-semibold text-textmain mb-8 tracking-wide text-center">Shop by Category</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate("/shop")}
                            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all"
                        >
                            <img
                                src={cat.img}
                                alt={cat.name}
                                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-semibold tracking-wider">{cat.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

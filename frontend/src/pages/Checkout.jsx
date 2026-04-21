import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow p-6 py-12 flex items-center justify-center">
                <div className="bg-white max-w-lg w-full rounded-3xl shadow-lg p-10">
                    <h1 className="text-2xl font-bold mb-6 text-textmain text-center">Secure Checkout</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                            <input className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="John Doe" />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Shipping Address</label>
                            <input className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="123 Main St, City, Country" />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                            <input className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="XXXX XXXX XXXX XXXX" />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button 
                            onClick={() => {
                                alert('Order placed successfully!');
                                navigate('/orders');
                            }}
                            className="w-full bg-accent text-white py-4 rounded-xl font-medium shadow-md hover:opacity-90 hover:scale-[1.02] transition"
                        >
                            Complete Order
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
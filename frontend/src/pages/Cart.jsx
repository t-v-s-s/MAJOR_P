import React from "react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const {
        cart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalPrice,
    } = useCart();
    
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-semibold text-textmain mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <p className="text-gray-500 text-lg mb-4">Your cart is feeling a bit empty 😢</p>
                        <button onClick={() => navigate('/shop')} className="bg-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition inline-block">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
                                >
                                    <div>
                                        <h2 className="font-semibold text-lg text-textmain">
                                            {item.product_name}
                                        </h2>
                                        <p className="text-gray-500 mt-1">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                        <button onClick={() => decreaseQty(item.id)} className="text-gray-600 hover:text-black font-medium text-lg px-2">-</button>
                                        <span className="font-medium text-textmain w-4 text-center">{item.qty}</span>
                                        <button onClick={() => increaseQty(item.id)} className="text-gray-600 hover:text-black font-medium text-lg px-2">+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 text-sm hover:text-red-600 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
                            <span className="text-gray-500 text-lg">Total Amount</span>
                            <span className="text-2xl font-bold text-textmain">₹{totalPrice}</span>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => navigate('/checkout')} className="bg-accent text-white px-8 py-4 rounded-full font-medium text-lg shadow-md hover:scale-105 hover:bg-opacity-90 transition duration-300">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
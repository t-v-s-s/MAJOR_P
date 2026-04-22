import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [open, setOpen] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const { cart, cartCount, totalPrice } = useCart();

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 w-full bg-secondary px-10 py-4 flex justify-between items-center shadow-sm z-50">

            {/* Logo */}
            <h1
                className="text-2xl font-semibold text-primary tracking-wide cursor-pointer"
                onClick={() => navigate("/")}
            >
                Kartique
            </h1>

            {/* Links */}
            <div className="hidden md:flex space-x-8 text-sm text-muted">
                <NavLink to="/" className="hover:text-primary">Home</NavLink>
                <NavLink to="/shop" className="hover:text-primary">Shop</NavLink>
                <NavLink to="/categories" className="hover:text-primary">Categories</NavLink>
                <NavLink to="/contact" className="hover:text-primary">Contact</NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 relative">

                {/* Cart Button */}
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-primary text-white px-5 py-2 rounded-full hover:bg-opacity-90 transition"
                >
                    Cart

                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Mini Cart Dropdown */}
                {showCart && (
                    <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-4 z-50">

                        <h3 className="font-semibold mb-3">My Cart</h3>

                        {cart.length === 0 ? (
                            <p className="text-gray-500">Cart is empty</p>
                        ) : (
                            <>
                                {cart.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm mb-2">
                                        <span>{item.name}</span>
                                        <span>x{item.qty}</span>
                                    </div>
                                ))}

                                <div className="border-t pt-2 mt-2 font-semibold">
                                    Total: ₹{totalPrice}
                                </div>

                                <button
                                    onClick={() => {
                                        setShowCart(false);
                                        navigate("/cart");
                                    }}
                                    className="mt-3 w-full bg-primary text-white py-2 rounded"
                                >
                                    View Full Cart
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Auth Section */}
                {username ? (
                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-sm text-gray-700 font-medium"
                        >
                            {username} ▼
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">

                                <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                                    Hello, {username}
                                </div>

                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/profile");
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    My Profile
                                </button>

                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/orders");
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    My Orders
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                >
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-primary"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="text-primary"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
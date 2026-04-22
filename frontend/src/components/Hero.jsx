import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const MotionDiv = motion.div;

    return (
        <section className="bg-gradient-to-br from-background via-white to-secondary px-10 py-20 flex flex-col md:flex-row items-center justify-between overflow-hidden">

            {/* LEFT CONTENT (Animated) */}
            <MotionDiv
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl"
            >
                <h1 className="text-4xl md:text-5xl font-semibold text-textmain leading-tight tracking-tight">
                    Discover Premium <br /> Shopping Experience
                </h1>

                <p className="text-gray-500 mt-4">
                    Curated collections designed to elevate your everyday lifestyle.
                </p>

                <button className="mt-6 bg-accent text-white px-6 py-3 rounded-full shadow-md hover:scale-105 hover:bg-opacity-90 transition duration-300">
                    Shop Now
                </button>
            </MotionDiv>

            {/* RIGHT SIDE (Floating + Main Card Combined) */}
            <div className="relative mt-16 md:mt-0 w-[320px] h-[320px] flex items-center justify-center">

                {/* Main Center Image */}
                <div className="absolute bg-white w-72 h-72 rounded-2xl flex items-center justify-center shadow-lg z-10 overflow-hidden p-2">
                    <img
                        src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"
                        alt="Featured product"
                        className="rounded-xl object-cover w-full h-full"
                    />
                </div>

                {/* Floating Card 1 */}
                <MotionDiv
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-0 left-5 md:-left-10 bg-white p-3 rounded-2xl shadow-xl w-32 z-20"
                >
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" alt="Headphones" className="rounded-lg w-full h-24 object-cover" />
                    <p className="text-xs mt-1 text-textmain font-medium">Headphones</p>
                </MotionDiv>

                {/* Floating Card 2 */}
                <MotionDiv
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-0 -left-6 md:-left-16 bg-white p-3 rounded-2xl shadow-xl w-36 z-20"
                >
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" alt="Shoes" className="rounded-lg w-full h-28 object-cover" />
                    <p className="text-xs mt-1 text-textmain font-medium">Shoes</p>
                </MotionDiv>

                {/* Floating Card 3 */}
                <MotionDiv
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute top-20 -right-6 md:-right-12 bg-white p-3 rounded-2xl shadow-xl w-32 z-20"
                >
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" alt="Watch" className="rounded-lg w-full h-24 object-cover" />
                    <p className="text-xs mt-1 text-textmain font-medium">Watch</p>
                </MotionDiv>

            </div>
        </section>
    );
}

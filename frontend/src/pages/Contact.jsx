import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="bg-white max-w-3xl w-full rounded-3xl shadow-lg p-10 md:p-14">
                    <h1 className="text-3xl font-semibold text-textmain mb-4 text-center">Get in Touch</h1>
                    <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
                        Have a question about our products or your order? Fill out the form below and our team will get back to you shortly.
                    </p>
                    
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm" placeholder="Doe" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm" placeholder="john@example.com" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows="5" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm resize-none" placeholder="How can we help you?"></textarea>
                        </div>
                        
                        <button type="button" className="w-full bg-primary text-white font-medium px-6 py-4 rounded-xl hover:bg-opacity-90 hover:shadow-md transition duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

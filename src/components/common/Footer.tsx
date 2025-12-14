import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 py-16 mt-auto border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black text-white font-display flex items-center gap-2">
                            <span>🛍️</span>
                            <span>Store</span>
                        </Link>
                        <p className="text-sm opacity-70 leading-relaxed max-w-xs">
                            Discover premium quality products curated for the modern lifestyle. We bring you the best in fashion and electronics.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-primary-400 transition-colors">All Products</Link></li>
                            <li><Link to="/" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
                            <li><Link to="/" className="hover:text-primary-400 transition-colors">Jewelery</Link></li>
                            <li><Link to="/" className="hover:text-primary-400 transition-colors">Mens Clothing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Returns & Exchanges</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6">Newsletter</h4>
                        <p className="text-sm opacity-70 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary-500"
                            />
                            <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 font-medium transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
                    <p>© 2024 Store Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

import React from 'react';
import { useCart } from '../../context/CartContext';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, isDrawerOpen, setIsDrawerOpen } = useCart();

    return (
        <>
            {/* Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-dark-card shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-card">
                        <h2 className="text-xl font-bold font-display dark:text-white">Shopping Cart ({cart.length})</h2>
                        <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setIsDrawerOpen(false)}>
                            ✕
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="text-center py-20 opacity-50 space-y-4">
                                <span className="text-6xl block mb-4">🛒</span>
                                <p className="text-lg font-medium">Your cart is empty</p>
                                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Start Shopping</Button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0">
                                        <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md text-xs">-</button>
                                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md text-xs">+</button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Total</span>
                                <span className="text-2xl font-bold text-primary-600 font-display">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="space-y-3">
                                <Link to="/checkout" onClick={() => setIsDrawerOpen(false)}>
                                    <Button className="w-full" size="lg">Checkout</Button>
                                </Link>
                                <Button variant="ghost" className="w-full" onClick={() => setIsDrawerOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

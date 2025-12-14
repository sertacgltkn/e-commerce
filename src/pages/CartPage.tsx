import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

export const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 space-y-4">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <Link to="/">
                    <Button variant="outline">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold font-display">Shopping Cart</h1>

            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6 border-b border-gray-100 dark:border-dark-border last:border-0 items-center">
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-contain p-2 bg-white rounded-lg" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg dark:text-white">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-xs btn-circle btn-ghost dark:text-white">-</button>
                            <span className="w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-xs btn-circle btn-ghost dark:text-white">+</button>
                        </div>
                        <div className="text-right min-w-[100px]">
                            <p className="font-bold text-lg dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border w-full max-w-sm space-y-4">
                    <div className="flex justify-between text-lg font-bold dark:text-white">
                        <span>Total</span>
                        <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="block w-full">
                        <Button size="lg" className="w-full">
                            Checkout
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

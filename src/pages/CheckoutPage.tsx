import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const CheckoutPage: React.FC = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            clearCart();
            setIsProcessing(false);
            alert('Payment Successful! Thank you for your order.');
            navigate('/');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Shipping Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" placeholder="John" required />
                        <Input label="Last Name" placeholder="Doe" required />
                        <Input className="col-span-2" label="Address" placeholder="123 Main St" required />
                        <Input label="City" placeholder="New York" required />
                        <Input label="ZIP Code" placeholder="10001" required />
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Payment Details</h3>
                    <div className="space-y-4">
                        <Input label="Card Number" placeholder="0000 0000 0000 0000" required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Expiry Date" placeholder="MM/YY" required />
                            <Input label="CVC" placeholder="123" required />
                        </div>
                        <Input label="Cardholder Name" placeholder="John Doe" required />
                    </div>
                </div>
            </div>

            <div className="h-fit bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border sticky top-24">
                <h3 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h3>
                <div className="space-y-4 mb-6 max-h-96 overflow-auto">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-contain bg-white rounded-md p-1" />
                            <div className="flex-1">
                                <h4 className="text-sm font-medium line-clamp-2 dark:text-white">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full mt-6 btn-primary"
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </Button>
            </div>
        </div>
    );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product);
        showToast(`${product.title} added to cart!`, 'success');
        onClose();
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product);
        showToast(
            isInWishlist(product.id) 
                ? 'Removed from wishlist' 
                : 'Added to wishlist!', 
            'success'
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid md:grid-cols-2 gap-8 p-8">
                                    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 flex items-center justify-center">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="max-h-96 w-full object-contain"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold uppercase">
                                                    {product.category}
                                                </span>
                                                <button
                                                    onClick={handleToggleWishlist}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isInWishlist(product.id)
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                    }`}
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                                                    />
                                                </button>
                                            </div>

                                            <h2 className="text-3xl font-bold dark:text-white mb-2">{product.title}</h2>

                                            {product.rating && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.floor(product.rating!.rate)
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {product.rating.rate} ({product.rating.count} reviews)
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-4xl font-black text-primary-600 dark:text-primary-400 mb-6">
                                                ${product.price}
                                            </p>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {product.description}
                                        </p>

                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                onClick={handleAddToCart}
                                                size="lg"
                                                className="flex-1"
                                            >
                                                Add to Cart
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="flex-1"
                                                onClick={() => {
                                                    window.location.href = `/product/${product.id}`;
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


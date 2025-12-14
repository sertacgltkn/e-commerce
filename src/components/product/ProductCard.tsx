import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full"
        >
            <Link to={`/product/${product.id}`} className="block relative pt-[100%] overflow-hidden bg-white">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-contain p-8"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-900 dark:text-white rounded-full shadow-sm capitalize border border-gray-100 dark:border-dark-border">
                        {product.category}
                    </span>
                    {product.rating && (
                        <span className="bg-yellow-400/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white rounded-full shadow-sm flex items-center gap-1 w-fit">
                            <Star size={12} fill="white" /> {product.rating.rate}
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col pt-6">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 mb-2" title={product.title}>
                        {product.title}
                    </h3>
                </Link>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white font-display">${product.price}</span>
                    </div>
                    <Button
                        onClick={() => addToCart(product)}
                        className="rounded-xl shadow-lg shadow-primary-500/20"
                        size="sm"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

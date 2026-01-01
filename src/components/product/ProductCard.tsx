import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useComparison } from '../../context/ComparisonContext';
import { useToast } from '../../context/ToastContext';
import { ProductBadges } from './ProductBadges';
import { Star, Heart, Eye, GitCompare } from 'lucide-react';
const QuickViewModal = React.lazy(() => import('./QuickViewModal'));

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { isInComparison, addToComparison, canAddMore } = useComparison();
    const { showToast } = useToast();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);


    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        showToast(
            isInWishlist(product.id) 
                ? 'Removed from wishlist' 
                : 'Added to wishlist!', 
            'success'
        );
    };

    const handleAddToComparison = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!canAddMore) {
            showToast('You can compare up to 3 products', 'warning');
            return;
        }
        if (isInComparison(product.id)) {
            showToast('Product already in comparison', 'info');
            return;
        }
        addToComparison(product);
        showToast('Added to comparison!', 'success');
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

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

                {/* Product Badges */}
                <ProductBadges
                    badges={
                        product.id % 3 === 0
                            ? ['new']
                            : product.id % 5 === 0
                            ? ['sale']
                            : product.id % 7 === 0
                            ? ['featured']
                            : []
                    }
                    discount={product.id % 5 === 0 ? 20 : undefined}
                />


                {/* Category Badge & Out of Stock */}
                <div className="absolute bottom-3 left-3 flex gap-2 items-end">
                    <span className="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-900 dark:text-white rounded-full shadow-sm capitalize border border-gray-100 dark:border-dark-border">
                        {product.category}
                    </span>
                    {!product.inStock && (
                        <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full font-bold shadow-sm animate-pulse ml-2">Stokta Yok</span>
                    )}
                </div>

                {/* Rating Badge */}
                {product.rating && (
                    <div className="absolute bottom-3 right-3">
                        <span className="bg-yellow-400/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white rounded-full shadow-sm flex items-center gap-1 w-fit">
                            <Star size={12} fill="white" /> {product.rating.rate}
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-110 ${
                            isInWishlist(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 dark:bg-dark-bg/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                        }`}
                        title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={16} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                    </button>
                    <button
                        onClick={handleQuickView}
                        className="p-2 rounded-full bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 shadow-lg transition-all hover:scale-110 hover:bg-primary-500 hover:text-white"
                        title="Quick view"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={handleAddToComparison}
                        disabled={!canAddMore && !isInComparison(product.id)}
                        className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-110 ${
                            isInComparison(product.id)
                                ? 'bg-blue-500 text-white'
                                : canAddMore
                                ? 'bg-white/90 dark:bg-dark-bg/90 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        title={isInComparison(product.id) ? 'In comparison' : canAddMore ? 'Add to comparison' : 'Max 3 products'}
                    >
                        <GitCompare size={16} className={isInComparison(product.id) ? 'fill-current' : ''} />
                    </button>
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!product.inStock) return;
                            addToCart(product);
                            showToast(`${product.title} added to cart!`, 'success');
                        }}
                        className="rounded-xl shadow-lg shadow-primary-500/20"
                        size="sm"
                        disabled={!product.inStock}
                    >
                        {product.inStock === false ? 'Stokta Yok' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            <Suspense fallback={<div className="p-8"><span>Loading Quick View...</span></div>}>
                {isQuickViewOpen && (
                    <QuickViewModal
                        product={product}
                        isOpen={isQuickViewOpen}
                        onClose={() => setIsQuickViewOpen(false)}
                    />
                )}
            </Suspense>
        </motion.div>
    );
};

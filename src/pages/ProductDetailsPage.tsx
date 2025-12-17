import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useComparison } from '../context/ComparisonContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Button } from '../components/common/Button';
import { ImageGallery } from '../components/product/ImageGallery';
import { ProductReviews } from '../components/product/ProductReviews';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { ShareButton } from '../components/common/ShareButton';
import { ProductBadges } from '../components/product/ProductBadges';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, GitCompare, Bell } from 'lucide-react';
import { getProducts } from '../services/api';
import { usePriceAlert } from '../context/PriceAlertContext';


export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { isInComparison, addToComparison, canAddMore } = useComparison();
    const { showToast } = useToast();
    const { addToRecentlyViewed } = useRecentlyViewed();
    const { addPriceAlert } = usePriceAlert();

    useEffect(() => {
        if (id) {
            getProduct(id).then((product) => {
                setProduct(product);
                if (product) {
                    addToRecentlyViewed(product);
                }
            });
            getProducts().then(setAllProducts);
        }
    }, [id, addToRecentlyViewed]);

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 transition-colors dark:text-gray-400 dark:hover:text-primary-400">
                <ArrowLeft size={20} />
                Back to Shopping
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="relative">
                    <ProductBadges
                        badges={product.id % 3 === 0 ? ['new'] : product.id % 5 === 0 ? ['sale'] : ['featured']}
                        discount={product.id % 5 === 0 ? 20 : undefined}
                    />
                    <ImageGallery
                        images={[product.image, product.image, product.image]} // In real app, fetch multiple images
                        productTitle={product.title}
                    />
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <span className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                                {product.rating && (
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                                        <Star size={16} fill="currentColor" />
                                        <span>{product.rating.rate}</span>
                                        <span className="text-gray-400 font-normal">({product.rating.count} reviews)</span>
                                    </div>
                                )}
                            </div>
                            <ShareButton product={product} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white leading-tight">
                            {product.title}
                        </h1>
                    </div>

                    <p className="text-4xl font-black text-primary-600 dark:text-primary-400 font-display">
                        ${product.price}
                    </p>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg border-l-4 border-primary-200 dark:border-primary-800 pl-6">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-dark-border">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <Truck size={24} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Free Delivery</h4>
                                <p className="text-xs text-gray-500">Orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">2 Year Warranty</h4>
                                <p className="text-xs text-gray-500">100% Guarantee</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                        <div className="flex gap-4">
                            <Button
                                onClick={() => {
                                    addToCart(product!);
                                    showToast(`${product!.title} added to cart!`, 'success');
                                }}
                                size="lg"
                                className="flex-1 text-lg shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30"
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 text-lg dark:text-white dark:border-gray-600 dark:hover:bg-white/5"
                            >
                                Buy Now
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    toggleWishlist(product!);
                                    showToast(
                                        isInWishlist(product!.id)
                                            ? 'Removed from wishlist'
                                            : 'Added to wishlist!',
                                        'success'
                                    );
                                }}
                                className={`flex-1 ${
                                    isInWishlist(product!.id)
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                                        : ''
                                }`}
                            >
                                <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product!.id) ? 'fill-current' : ''}`} />
                                {isInWishlist(product!.id) ? 'In Wishlist' : 'Add to Wishlist'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!canAddMore) {
                                        showToast('You can compare up to 3 products', 'warning');
                                        return;
                                    }
                                    if (isInComparison(product!.id)) {
                                        showToast('Product already in comparison', 'info');
                                        return;
                                    }
                                    addToComparison(product!);
                                    showToast('Added to comparison!', 'success');
                                }}
                                disabled={!canAddMore && !isInComparison(product!.id)}
                                className={`flex-1 ${
                                    isInComparison(product!.id)
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                                        : ''
                                }`}
                            >
                                <GitCompare className={`w-5 h-5 mr-2 ${isInComparison(product!.id) ? 'fill-current' : ''}`} />
                                {isInComparison(product!.id) ? 'In Comparison' : 'Compare'}
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const targetPrice = product.price * 0.8; // 20% discount target
                                    addPriceAlert(product, targetPrice);
                                }}
                                className="flex-1"
                            >
                                <Bell className="w-5 h-5 mr-2" />
                                Price Alert
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews productId={product.id} />

            {/* Related Products */}
            {allProducts.length > 0 && (
                <RelatedProducts currentProduct={product} allProducts={allProducts} />
            )}
        </div>
    );
};

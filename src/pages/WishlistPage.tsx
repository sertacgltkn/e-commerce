import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const WishlistPage: React.FC = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20 space-y-6">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                    <Heart className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold dark:text-white">Your wishlist is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Start adding products you love to your wishlist. They'll be saved here for later!
                </p>
                <Link to="/">
                    <Button size="lg" className="mt-4">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display dark:text-white flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};


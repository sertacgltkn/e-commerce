import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';


export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) {
            getProduct(id).then(setProduct);
        }
    }, [id]);

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
                <div className="bg-white dark:bg-dark-card p-12 rounded-[2.5rem] border border-gray-100 dark:border-dark-border flex items-center justify-center shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-900/5 dark:bg-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[500px] w-full object-contain mix-blend-multiply dark:mix-blend-normal z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
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

                    <div className="flex gap-4 pt-2">
                        <Button
                            onClick={() => addToCart(product!)}
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
                </div>
            </div>
        </div>
    );
};

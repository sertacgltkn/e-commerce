import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';

interface SearchAutocompleteProps {
    products: Product[];
    onSelect?: (product: Product) => void;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    products,
    onSelect,
    value: controlledValue,
    onChange,
    className = '',
}) => {
    const [internalValue, setInternalValue] = useState('');
    const searchTerm = controlledValue !== undefined ? controlledValue : internalValue;
    const setSearchTerm = onChange || setInternalValue;
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { recentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = products
                .filter((product) =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 5);
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [searchTerm, products]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (product: Product) => {
        setSearchTerm('');
        setIsOpen(false);
        onSelect?.(product);
    };

    const trendingProducts = products
        .filter((p) => p.rating && p.rating.rate >= 4.5)
        .slice(0, 3);

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && suggestions.length > 0) {
                            onSelect?.(suggestions[0]);
                        }
                    }}
                    className="input-field pl-10 pr-4 rounded-full w-full"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-full bg-white dark:bg-dark-card rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border z-50 max-h-[500px] overflow-y-auto"
                    >
                        {suggestions.length > 0 ? (
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                    Search Results
                                </div>
                                {suggestions.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        onClick={() => handleSelect(product)}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ${product.price}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : searchTerm.length > 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p>No products found</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {recentlyViewed.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                            <Clock className="w-4 h-4" />
                                            Recently Viewed
                                        </div>
                                        {recentlyViewed.slice(0, 3).map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                onClick={() => handleSelect(product)}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {trendingProducts.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                            <TrendingUp className="w-4 h-4" />
                                            Trending
                                        </div>
                                        {trendingProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                onClick={() => handleSelect(product)}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


import React, { useEffect, useState, useMemo } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SearchAutocomplete } from '../components/common/SearchAutocomplete';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { Zap, Filter, X, Clock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

type SortOption = 'default' | 'price-low' | 'price-high' | 'rating-high' | 'rating-low' | 'name-asc' | 'name-desc';

export const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [showFilters, setShowFilters] = useState(false);
    const { recentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        getProducts().then(data => {
            const allProducts = [...data]; // Just use the original data for now
            setProducts(allProducts);
            // Simulate "Featured" by picking random or first few
            setFeaturedProducts(allProducts.slice(0, 4));
            setLoading(false);
        });
    }, []);

    const categories = ["all", ...new Set(products.map(p => p.category))];

    const maxProductPrice = useMemo(() => {
        return products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            const matchesRating = product.rating ? product.rating.rate >= minRating : false;
            return matchesSearch && matchesCategory && matchesPrice && matchesRating;
        });

        // Sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating-high':
                filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
                break;
            case 'rating-low':
                filtered.sort((a, b) => (a.rating?.rate || 0) - (b.rating?.rate || 0));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchTerm, selectedCategory, minPrice, maxPrice, minRating, sortBy]);

    if (loading) {
        return (
            <div className="space-y-20 pb-12">
                <div className="container mx-auto px-4">
                    <ProductGridSkeleton count={8} />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-20 pb-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                <div className="relative px-8 py-24 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            New Collection Available
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1]">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                                Lifestyle.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-indigo-100 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
                            Discover a curated selection of premium products designed for the modern individual. Quality meets style in every piece.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-xl shadow-indigo-900/20">
                                Shop Now
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                                View Lookbook
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md md:max-w-xl relative">
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                        {featuredProducts.length > 0 && (
                            <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={featuredProducts[0].image}
                                    alt="Hero Product"
                                    className="w-full h-64 md:h-80 object-contain drop-shadow-2xl"
                                />
                                <div className="mt-4 text-white">
                                    <h3 className="text-lg font-bold truncate">{featuredProducts[0].title}</h3>
                                    <p className="text-white/80">${featuredProducts[0].price}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-display dark:text-white flex items-center gap-2">
                            <Zap className="text-yellow-500" fill="currentColor" /> Trending Now
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Top picks from our premium collection</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={`featured-${product.id}`} product={product} />
                    ))}
                </div>
            </section>

            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold font-display dark:text-white flex items-center gap-2">
                                <Clock className="text-blue-500" /> Recently Viewed
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Continue browsing where you left off</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentlyViewed.slice(0, 4).map((product) => (
                            <ProductCard key={`recent-${product.id}`} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Search and Filter */}
            <section className="container mx-auto px-4 sticky top-24 z-30 bg-gray-50/90 dark:bg-dark-bg/90 backdrop-blur-md py-4 -mx-4 px-4 transition-colors duration-300">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar w-full md:w-auto mask-linear-fade">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full capitalize whitespace-nowrap transition-all font-medium text-sm ${selectedCategory === cat
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                                        : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-dark-border'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <SearchAutocomplete
                                products={products}
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onSelect={(product) => {
                                    window.location.href = `/product/${product.id}`;
                                }}
                                className="flex-1 md:w-96"
                            />
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="whitespace-nowrap"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border space-y-6 animate-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg dark:text-white">Advanced Filters</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-white">
                                        Price Range: ${minPrice} - ${maxPrice}
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxProductPrice}
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                            className="w-full"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxProductPrice}
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-white">
                                        Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-white">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="w-full input-field"
                                    >
                                        <option value="default">Default</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating-high">Rating: High to Low</option>
                                        <option value="rating-low">Rating: Low to High</option>
                                        <option value="name-asc">Name: A to Z</option>
                                        <option value="name-desc">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Grid */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-bold font-display dark:text-white">All Products</h2>
                    <span className="text-sm text-gray-500">{filteredAndSortedProducts.length} items</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredAndSortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </section>

            {/* Newsletter Section equivalent */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-primary-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] opacity-10 bg-cover bg-center"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-display">Join our exclusive club</h2>
                        <p className="text-primary-100 text-lg">
                            Get early access to new drops, special offers, and personalized recommendations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email" className="input-field rounded-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-white/50" />
                            <Button className="bg-white text-primary-900 hover:bg-gray-100 border-none rounded-full px-8">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Star } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
    const { comparison, removeFromComparison, clearComparison } = useComparison();

    if (comparison.length === 0) {
        return (
            <div className="text-center py-20 space-y-6">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold dark:text-white">No products to compare</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Add up to 3 products to compare their features, prices, and ratings side by side.
                </p>
                <Link to="/">
                    <Button size="lg" className="mt-4">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display dark:text-white">Compare Products</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Compare {comparison.length} {comparison.length === 1 ? 'product' : 'products'}
                    </p>
                </div>
                <Button variant="outline" onClick={clearComparison}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </Button>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-dark-border">
                            <th className="p-4 text-left font-bold dark:text-white">Feature</th>
                            {comparison.map((product) => (
                                <th key={product.id} className="p-4 text-center min-w-[250px]">
                                    <div className="relative">
                                        <button
                                            onClick={() => removeFromComparison(product.id)}
                                            className="absolute top-0 right-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-32 h-32 object-contain mx-auto mb-4"
                                        />
                                        <h3 className="font-bold dark:text-white text-sm mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 dark:border-dark-border">
                            <td className="p-4 font-semibold dark:text-white">Price</td>
                            {comparison.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                                        ${product.price}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-dark-border">
                            <td className="p-4 font-semibold dark:text-white">Rating</td>
                            {comparison.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    {product.rating ? (
                                        <div className="flex items-center justify-center gap-2">
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
                                                {product.rating.rate} ({product.rating.count})
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-dark-border">
                            <td className="p-4 font-semibold dark:text-white">Category</td>
                            {comparison.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold uppercase">
                                        {product.category}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold dark:text-white">Description</td>
                            {comparison.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {product.description}
                                    </p>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-4">
                {comparison.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <Button variant="outline">
                            View {product.title.substring(0, 15)}...
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
};


import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
    currentProduct: Product;
    allProducts: Product[];
    limit?: number;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    currentProduct,
    allProducts,
    limit = 4,
}) => {
    const relatedProducts = useMemo(() => {
        return allProducts
            .filter(
                (product) =>
                    product.id !== currentProduct.id &&
                    (product.category === currentProduct.category ||
                        product.title.toLowerCase().split(' ').some((word) =>
                            currentProduct.title.toLowerCase().includes(word)
                        ))
            )
            .slice(0, limit);
    }, [currentProduct, allProducts, limit]);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-16 space-y-8">
            <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-3xl font-bold font-display dark:text-white">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};


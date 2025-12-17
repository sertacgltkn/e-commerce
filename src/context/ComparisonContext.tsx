import React, { createContext, useContext, useState } from 'react';
import type { Product } from '../types';

interface ComparisonContextType {
    comparison: Product[];
    addToComparison: (product: Product) => void;
    removeFromComparison: (productId: number) => void;
    isInComparison: (productId: number) => boolean;
    clearComparison: () => void;
    canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [comparison, setComparison] = useState<Product[]>([]);
    const MAX_COMPARISON = 3;

    const addToComparison = (product: Product) => {
        setComparison((prev) => {
            if (prev.find((item) => item.id === product.id)) {
                return prev;
            }
            if (prev.length >= MAX_COMPARISON) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromComparison = (productId: number) => {
        setComparison((prev) => prev.filter((item) => item.id !== productId));
    };

    const isInComparison = (productId: number) => {
        return comparison.some((item) => item.id === productId);
    };

    const clearComparison = () => {
        setComparison([]);
    };

    return (
        <ComparisonContext.Provider
            value={{
                comparison,
                addToComparison,
                removeFromComparison,
                isInComparison,
                clearComparison,
                canAddMore: comparison.length < MAX_COMPARISON,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
};


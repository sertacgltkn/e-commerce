import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
    clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
};

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
        const saved = localStorage.getItem('recentlyViewed');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((item) => item.id !== product.id);
            return [product, ...filtered].slice(0, 10); // Keep only last 10
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
    };

    return (
        <RecentlyViewedContext.Provider
            value={{
                recentlyViewed,
                addToRecentlyViewed,
                clearRecentlyViewed,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    );
};


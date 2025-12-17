import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useToast } from './ToastContext';

interface PriceAlert {
    id: string;
    productId: number;
    product: Product;
    targetPrice: number;
    currentPrice: number;
    createdAt: string;
}

interface PriceAlertContextType {
    alerts: PriceAlert[];
    addPriceAlert: (product: Product, targetPrice: number) => void;
    removePriceAlert: (alertId: string) => void;
    checkPriceDrops: () => void;
}

const PriceAlertContext = createContext<PriceAlertContextType | undefined>(undefined);

export const usePriceAlert = () => {
    const context = useContext(PriceAlertContext);
    if (!context) {
        throw new Error('usePriceAlert must be used within a PriceAlertProvider');
    }
    return context;
};

export const PriceAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
        const saved = localStorage.getItem('priceAlerts');
        return saved ? JSON.parse(saved) : [];
    });
    const { showToast } = useToast();

    useEffect(() => {
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    }, [alerts]);

    useEffect(() => {
        // Simulate price checking every 30 seconds
        const interval = setInterval(() => {
            checkPriceDrops();
        }, 30000);

        return () => clearInterval(interval);
    }, [alerts]);

    const addPriceAlert = (product: Product, targetPrice: number) => {
        const alert: PriceAlert = {
            id: Date.now().toString(),
            productId: product.id,
            product,
            targetPrice,
            currentPrice: product.price,
            createdAt: new Date().toISOString(),
        };

        setAlerts((prev) => {
            const exists = prev.find((a) => a.productId === product.id);
            if (exists) {
                showToast('Price alert already exists for this product', 'info');
                return prev;
            }
            showToast('Price alert created!', 'success');
            return [...prev, alert];
        });
    };

    const removePriceAlert = (alertId: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        showToast('Price alert removed', 'success');
    };

    const checkPriceDrops = () => {
        alerts.forEach((alert) => {
            // Simulate random price changes (in real app, fetch from API)
            const randomChange = Math.random() * 0.2 - 0.1; // -10% to +10%
            const newPrice = alert.currentPrice * (1 + randomChange);

            if (newPrice <= alert.targetPrice && alert.currentPrice > alert.targetPrice) {
                showToast(
                    `Price dropped! ${alert.product.title} is now $${newPrice.toFixed(2)}`,
                    'success'
                );
            }

            setAlerts((prev) =>
                prev.map((a) =>
                    a.id === alert.id ? { ...a, currentPrice: newPrice } : a
                )
            );
        });
    };

    return (
        <PriceAlertContext.Provider
            value={{
                alerts,
                addPriceAlert,
                removePriceAlert,
                checkPriceDrops,
            }}
        >
            {children}
        </PriceAlertContext.Provider>
    );
};


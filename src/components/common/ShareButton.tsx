import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Facebook, Twitter, Link2, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareButtonProps {
    product: {
        id: number;
        title: string;
        image: string;
        price: number;
    };
    className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ product, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const productUrl = `${window.location.origin}/product/${product.id}`;
    const shareText = `Check out ${product.title} - $${product.price}`;

    const shareOptions = [
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
                    '_blank'
                );
            },
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            action: () => {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
                    '_blank'
                );
            },
        },
        {
            name: 'Copy Link',
            icon: copied ? Check : Link2,
            color: 'bg-gray-600 hover:bg-gray-700',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(productUrl);
                    setCopied(true);
                    showToast('Link copied to clipboard!', 'success');
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    showToast('Failed to copy link', 'error');
                }
            },
        },
    ];

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute bottom-full right-0 mb-2 bg-white dark:bg-dark-card rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border p-2 z-50 min-w-[200px]"
                        >
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Share Product
                            </div>
                            <div className="space-y-1">
                                {shareOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.name}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                option.action();
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors ${option.color}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{option.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};


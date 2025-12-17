import React from 'react';
import { Sparkles, Tag, Award, AlertCircle } from 'lucide-react';

export type BadgeType = 'new' | 'sale' | 'featured' | 'out-of-stock' | 'limited';

interface ProductBadgesProps {
    badges: BadgeType[];
    discount?: number;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ badges, discount }) => {
    const badgeConfig = {
        new: {
            label: 'New',
            icon: Sparkles,
            className: 'bg-green-500 text-white',
        },
        sale: {
            label: discount ? `-${discount}%` : 'Sale',
            icon: Tag,
            className: 'bg-red-500 text-white',
        },
        featured: {
            label: 'Featured',
            icon: Award,
            className: 'bg-yellow-500 text-white',
        },
        'out-of-stock': {
            label: 'Out of Stock',
            icon: AlertCircle,
            className: 'bg-gray-500 text-white',
        },
        limited: {
            label: 'Limited',
            icon: Sparkles,
            className: 'bg-purple-500 text-white',
        },
    };

    if (badges.length === 0) return null;

    return (
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {badges.map((badge) => {
                const config = badgeConfig[badge];
                const Icon = config.icon;
                return (
                    <div
                        key={badge}
                        className={`${config.className} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm`}
                    >
                        <Icon className="w-3 h-3" />
                        <span>{config.label}</span>
                    </div>
                );
            })}
        </div>
    );
};


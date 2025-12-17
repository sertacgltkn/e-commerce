import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, User, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Review, ReviewStats } from '../../types/reviews';

interface ProductReviewsProps {
    productId: number;
}

const mockReviews: Review[] = [
    {
        id: '1',
        productId: 1,
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent product! Exceeded my expectations. The quality is outstanding and delivery was fast.',
        date: '2024-01-15',
        helpful: 12,
    },
    {
        id: '2',
        productId: 1,
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Very good product, but could be improved in some areas. Overall satisfied with the purchase.',
        date: '2024-01-10',
        helpful: 8,
    },
    {
        id: '3',
        productId: 1,
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Amazing quality! Worth every penny. Highly recommend to everyone.',
        date: '2024-01-05',
        helpful: 15,
    },
];

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [showForm, setShowForm] = useState(false);
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const stats: ReviewStats = useMemo(() => {
        const total = reviews.length;
        const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            distribution[r.rating as keyof typeof distribution]++;
        });
        return { totalReviews: total, averageRating: average, ratingDistribution: distribution };
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        if (filterRating === null) return reviews;
        return reviews.filter((r) => r.rating === filterRating);
    }, [reviews, filterRating]);

    const handleSubmitReview = () => {
        if (!user) {
            showToast('Please login to write a review', 'warning');
            return;
        }
        if (!newReview.comment.trim()) {
            showToast('Please write a comment', 'warning');
            return;
        }

        const review: Review = {
            id: Date.now().toString(),
            productId,
            userId: user.email,
            userName: user.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
        };

        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setShowForm(false);
        showToast('Review submitted successfully!', 'success');
    };

    const handleHelpful = (reviewId: string) => {
        setReviews((prev) =>
            prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
        );
        showToast('Thank you for your feedback!', 'success');
    };

    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold dark:text-white">Customer Reviews</h2>
                <Button onClick={() => setShowForm(!showForm)} variant="outline">
                    Write a Review
                </Button>
            </div>

            {/* Review Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-dark-border space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setNewReview({ ...newReview, rating })}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            rating <= newReview.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Your Review</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full input-field min-h-[120px]"
                            placeholder="Share your experience..."
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Review Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-dark-border">
                    <div className="text-center mb-6">
                        <div className="text-5xl font-black text-primary-600 dark:text-primary-400 mb-2">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i <= Math.round(stats.averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Based on {stats.totalReviews} reviews
                        </p>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-20">
                                        <span className="text-sm font-medium dark:text-white">{rating}</span>
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-yellow-400 h-full rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-dark-border">
                    <h3 className="font-bold mb-4 dark:text-white">Filter by Rating</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setFilterRating(null)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                filterRating === null
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            All Reviews ({stats.totalReviews})
                        </button>
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                            return (
                                <button
                                    key={rating}
                                    onClick={() => setFilterRating(rating)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                                        filterRating === rating
                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
                        <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-dark-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold dark:text-white">{review.userName}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                {review.comment}
                            </p>
                            <button
                                onClick={() => handleHelpful(review.id)}
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful})</span>
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};


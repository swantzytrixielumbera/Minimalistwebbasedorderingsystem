import React, { useState } from 'react';
import { Star, MessageSquare, Trash2, User, Calendar } from 'lucide-react';
import { type Review, getReviews, saveReviews, getOrders } from '../../data/mockData';

interface ReviewManagementProps {
  onUpdate: () => void;
}

export default function ReviewManagement({ onUpdate }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>(getReviews());
  const orders = getOrders();

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updatedReviews = reviews.filter(r => r.id !== id);
      saveReviews(updatedReviews);
      setReviews(updatedReviews);
      onUpdate();
    }
  };

  const getOrderDetails = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-300 dark:text-neutral-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Customer Reviews</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">View and manage customer feedback</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Average Rating</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">{averageRating}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">out of 5.0</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Reviews</h3>
            <MessageSquare className="w-5 h-5 text-stone-400 dark:text-stone-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">{reviews.length}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">customer reviews</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 w-3">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">All Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const order = getOrderDetails(review.orderId);
              return (
                <div
                  key={review.id}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {review.customerName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 mb-3">{review.comment}</p>

                  {order && (
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-3 text-sm">
                      <p className="text-neutral-600 dark:text-neutral-400 mb-1">
                        <span className="font-medium">Order ID:</span> {order.id}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Items:</span>{' '}
                        {order.items.map(item => item.productName).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

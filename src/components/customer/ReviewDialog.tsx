import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { type Order, type Review, getReviews, saveReviews } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';
import { toast } from 'sonner@2.0.3';

interface ReviewDialogProps {
  order: Order;
  customerName: string;
  onClose: () => void;
}

export default function ReviewDialog({ order, customerName, onClose }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(order.items[0]?.productId || '');
  const { broadcastChange } = useDataSync();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const newReview: Review = {
      id: `r${Date.now()}`,
      productId: selectedProductId,
      orderId: order.id,
      customerName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const reviews = getReviews();
    saveReviews([newReview, ...reviews]);
    
    // Broadcast review creation to all tabs/users
    broadcastChange('reviews', 'create');
    
    toast.success('Review submitted successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Order Info */}
          <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Order ID</p>
            <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{order.id.toUpperCase()}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {order.items.length} item(s) • ₱{order.total.toLocaleString()}
            </p>
          </div>

          {/* Product Selection (if multiple products) */}
          {order.items.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Select Product to Review *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                required
              >
                {order.items.map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {item.productName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this order..."
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-stone-400 dark:bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-500 dark:hover:bg-stone-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
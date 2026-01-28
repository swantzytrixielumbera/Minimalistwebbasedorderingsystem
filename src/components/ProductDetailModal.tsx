import React, { useState } from 'react';
import { X, Package, Star, Plus, User, Calendar } from 'lucide-react';
import { type Product, type Review, getReviews } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  isCustomer?: boolean;
}

export default function ProductDetailModal({ product, onClose, onAddToCart, isCustomer = false }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const reviews = getReviews().filter(r => r.productId === product.id);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-300 dark:text-neutral-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    if (onAddToCart && quantity > 0) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 flex items-start justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200 pr-4">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Product Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Product Image */}
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-xl overflow-hidden flex items-center justify-center h-64 sm:h-80">
              {product.image && product.image !== 'product-placeholder' ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg class="w-20 h-20 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                      parent.appendChild(icon.firstElementChild!);
                    }
                  }}
                />
              ) : (
                <Package className="w-20 h-20 text-neutral-400 dark:text-neutral-500" />
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                <span className="text-sm px-3 py-1 bg-stone-200 dark:bg-stone-700 text-neutral-700 dark:text-neutral-300 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">{product.name}</h3>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{product.description}</p>

              <div className="mb-4">
                <p className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-200">₱{product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Stock Available</p>
                  <p className={`text-xl font-bold ${
                    product.stock <= product.lowStockThreshold ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {product.stock} units
                  </p>
                </div>

                {reviews.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">{averageRating}</span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">({reviews.length})</span>
                    </div>
                  </div>
                )}
              </div>

              {isCustomer && product.stock > 0 && onAddToCart && (
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="w-16 px-2 py-1 text-center border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              Customer Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">No reviews yet for this product</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
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
                        {renderStars(review.rating, 'lg')}
                      </div>
                    </div>

                    <p className="text-neutral-700 dark:text-neutral-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Package, FileText, Star, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { type Order, getOrders, getReviews } from '../../data/mockData';
import { useAutoRefresh } from '../../contexts/DataSyncContext';
import Receipt from './Receipt';
import ReviewDialog from './ReviewDialog';

interface OrderHistoryProps {
  customerName: string;
  onBack: () => void;
}

export default function OrderHistory({ customerName, onBack }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-refresh when orders or reviews change
  useAutoRefresh(['orders', 'reviews'], () => {
    setRefreshTrigger(prev => prev + 1);
  });

  const orders = getOrders().filter(o => o.customerName === customerName);
  const reviews = getReviews();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400';
      case 'pending': return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400';
      default: return 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
    }
  };

  const hasReview = (orderId: string) => {
    return reviews.some(r => r.orderId === orderId);
  };

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handleReviewOrder = (order: Order) => {
    setReviewingOrder(order);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Order History</h2>
          <p className="text-neutral-600 dark:text-neutral-400">View your past orders and receipts</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Shop</span>
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">No Orders Yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Start shopping to see your order history here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{order.id.toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">₱{order.total.toLocaleString()}</p>
                  {order.promoCode && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Promo: {order.promoCode} ({order.discount}% off)
                    </p>
                  )}
                </div>
              </div>

              {/* Items Summary */}
              <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Items ({order.items.length})</p>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewReceipt(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-200 dark:bg-stone-700 text-neutral-800 dark:text-neutral-200 rounded-lg font-medium hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Receipt
                </button>
                
                {order.status === 'completed' && !hasReview(order.id) && (
                  <button
                    onClick={() => handleReviewOrder(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Write Review
                  </button>
                )}

                {hasReview(order.id) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Reviewed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <Receipt order={selectedOrder} onClose={() => setShowReceipt(false)} />
      )}

      {/* Review Dialog */}
      {reviewingOrder && (
        <ReviewDialog
          order={reviewingOrder}
          customerName={customerName}
          onClose={() => setReviewingOrder(null)}
        />
      )}
    </div>
  );
}
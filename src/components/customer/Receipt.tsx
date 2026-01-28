import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { type Order } from '../../data/mockData';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
}

export default function Receipt({ order, onClose }: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = order.discount ? (subtotal * order.discount) / 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between print:hidden">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8">
          {/* Store Header */}
          <div className="text-center mb-6 pb-6 border-b-2 border-neutral-300 dark:border-neutral-600">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">B. Laroza Electrical</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Lights Trading</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">Quality Lighting Solutions</p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Receipt No.</p>
              <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{order.id.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Date</p>
              <p className="font-medium text-neutral-800 dark:text-neutral-200">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Customer</p>
              <p className="font-medium text-neutral-800 dark:text-neutral-200">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Status</p>
              <p className="font-medium text-neutral-800 dark:text-neutral-200 capitalize">{order.status}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200 mb-4">Items Purchased</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Item</th>
                  <th className="text-center py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Qty</th>
                  <th className="text-right py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Price</th>
                  <th className="text-right py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-700">
                    <td className="py-3 text-neutral-800 dark:text-neutral-200">{item.productName}</td>
                    <td className="py-3 text-center text-neutral-600 dark:text-neutral-400">{item.quantity}</td>
                    <td className="py-3 text-right text-neutral-600 dark:text-neutral-400">₱{item.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-neutral-800 dark:text-neutral-200">₱{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6 pb-6 border-b-2 border-neutral-300 dark:border-neutral-600">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            {order.promoCode && order.discount && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount ({order.promoCode} - {order.discount}%)</span>
                <span>-₱{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-neutral-800 dark:text-neutral-200 pt-2">
              <span>Total</span>
              <span>₱{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-neutral-500 dark:text-neutral-500">
            <p className="mb-2">Thank you for your purchase!</p>
            <p>For inquiries, please contact us through our Facebook page</p>
          </div>
        </div>
      </div>
    </div>
  );
}

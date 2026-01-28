import React, { useState } from 'react';
import { ShoppingCart, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { type Order, getOrders, saveOrders } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';

interface OrderManagementProps {
  orders: Order[];
  onUpdate: () => void;
}

export default function OrderManagement({ orders, onUpdate }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const { broadcastChange } = useDataSync();

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrders(updatedOrders);
    
    // Broadcast order status change to all tabs/users
    broadcastChange('orders', 'update');
    
    onUpdate();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400';
      case 'pending': return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400';
      default: return 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Order Management</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">View and process customer orders</p>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2">
          {['All', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-stone-300 dark:bg-stone-600 text-neutral-800 dark:text-neutral-200'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Items</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-neutral-800 dark:text-neutral-200">{order.id.toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{order.customerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-neutral-600 dark:text-neutral-400">{order.date}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium">
                      {order.items.length} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">₱{order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                          title="Start Processing"
                        >
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                          title="Cancel Order"
                        >
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">Order ID: {selectedOrder.id.toUpperCase()}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Customer</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Date</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total</p>
                  <p className="text-xl font-bold text-neutral-800 dark:text-neutral-200">₱{selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.productName}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Processing
                  </button>
                )}
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp
} from 'lucide-react';
import { type Product, type Order } from '../../data/mockData';

interface DashboardOverviewProps {
  products: Product[];
  orders: Order[];
  onNavigate: (tab: 'dashboard' | 'catalog' | 'inventory' | 'orders') => void;
}

export default function DashboardOverview({ products, orders, onNavigate }: DashboardOverviewProps) {
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  // Format currency in Philippine Peso
  const formatPeso = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      onClick: () => onNavigate('catalog')
    },
    {
      label: 'Total Stock Units',
      value: totalStock,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      onClick: () => onNavigate('inventory')
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: ShoppingCart,
      color: 'bg-orange-50 text-orange-600',
      onClick: () => onNavigate('orders')
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      onClick: () => onNavigate('inventory')
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Overview of your stock and orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow md:cursor-pointer" 
              onClick={(e) => {
                // Only allow navigation on medium screens and up
                if (window.innerWidth >= 768) {
                  stat.onClick();
                }
              }}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} dark:opacity-90 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg md:text-xl font-semibold text-neutral-800 dark:text-neutral-200">Low Stock Alerts</h2>
          </div>
          
          {lowStockProducts.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400 text-center py-6 md:py-8 text-sm md:text-base">No low stock items</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm md:text-base truncate">{product.name}</p>
                    <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{product.stock}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">units left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-lg md:text-xl font-semibold text-neutral-800 dark:text-neutral-200">Recent Orders</h2>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                <div className="min-w-0 flex-1 mr-2">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm md:text-base truncate">{order.customerName}</p>
                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">{order.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 text-sm md:text-base">₱{order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                    order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                    order.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' :
                    order.status === 'pending' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400' :
                    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="mt-4 md:mt-6 bg-gradient-to-r from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 rounded-2xl shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-neutral-700 dark:text-neutral-300 mb-1 text-sm md:text-base">Total Revenue (Completed Orders)</p>
            <p className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">₱{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
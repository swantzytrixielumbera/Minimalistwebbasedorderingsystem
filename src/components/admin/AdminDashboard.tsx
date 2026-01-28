import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Archive, 
  LogOut,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
  Menu,
  X,
  Tag,
  Star
} from 'lucide-react';
import { initializeData, getProducts, getOrders, type Product, type Order } from '../../data/mockData';
import DashboardOverview from './DashboardOverview';
import ProductCatalog from './ProductCatalog';
import InventoryManagement from './InventoryManagement';
import OrderManagement from './OrderManagement';
import PromotionManagement from './PromotionManagement';
import ReviewManagement from './ReviewManagement';
import ThemeToggle from '../ThemeToggle';
import { useAutoRefresh } from '../../contexts/DataSyncContext';
import logo from 'figma:asset/46e0ee2264b593a90453c65b27bdf24f99b9df2e.png';

interface AdminDashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

type TabType = 'dashboard' | 'catalog' | 'inventory' | 'orders' | 'promotions' | 'reviews';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = useCallback(() => {
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  useEffect(() => {
    initializeData();
    loadData();
    
    // Close sidebar on mobile by default
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-refresh data when changes occur from any source (including other tabs/admins)
  useAutoRefresh(['orders', 'products', 'inventory', 'promotions', 'reviews'], loadData);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog' as TabType, label: 'Product Catalog', icon: Package },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Archive },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
    { id: 'promotions' as TabType, label: 'Promotions', icon: Tag },
    { id: 'reviews' as TabType, label: 'Reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen bg-white dark:bg-neutral-800 shadow-lg flex flex-col z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${sidebarOpen ? 'w-64' : 'hidden lg:flex lg:w-16'}`}>
        {/* Logo */}
        <div className={`p-6 border-b border-neutral-200 dark:border-neutral-700 ${!sidebarOpen && 'lg:p-3'}`}>
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'lg:justify-center'}`}>
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="B. Laroza Electrical" 
                className={`${sidebarOpen ? 'w-12 h-12' : 'w-10 h-10'} object-contain flex-shrink-0`}
              />
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-neutral-800 dark:text-neutral-200">B. Laroza</h1>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Admin Panel</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 ${!sidebarOpen && 'lg:p-2'}`}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${sidebarOpen ? 'gap-3' : 'lg:justify-center'} px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-stone-200 dark:bg-stone-700 text-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    } ${!sidebarOpen && 'lg:px-2'}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className={`p-4 border-t border-neutral-200 dark:border-neutral-700 ${!sidebarOpen && 'lg:p-2'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 bg-stone-300 dark:bg-stone-700 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{user.username}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'gap-2' : 'lg:justify-center'} px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors ${!sidebarOpen && 'lg:px-2'}`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Header with Menu Toggle */}
        <div className="sticky top-0 z-50 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 md:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="B. Laroza Electrical" 
                className="w-8 h-8 object-contain"
              />
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-200">B. Laroza Electrical</h2>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <DashboardOverview products={products} orders={orders} onNavigate={setActiveTab} />
          )}
          {activeTab === 'catalog' && (
            <ProductCatalog products={products} onUpdate={loadData} />
          )}
          {activeTab === 'inventory' && (
            <InventoryManagement products={products} onUpdate={loadData} />
          )}
          {activeTab === 'orders' && (
            <OrderManagement orders={orders} onUpdate={loadData} />
          )}
          {activeTab === 'promotions' && (
            <PromotionManagement onUpdate={loadData} />
          )}
          {activeTab === 'reviews' && (
            <ReviewManagement onUpdate={loadData} />
          )}
        </div>
      </main>
    </div>
  );
}
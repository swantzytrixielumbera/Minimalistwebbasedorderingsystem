import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, User, Zap, Package, History } from 'lucide-react';
import { initializeData, getProducts, getOrders, saveOrders, getPromotions, savePromotions, saveProducts, type Product, type Order } from '../../data/mockData';
import ProductListing from './ProductListing';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import ThemeToggle from '../ThemeToggle';
import { toast, Toaster } from 'sonner@2.0.3';
import { useDataSync, useAutoRefresh } from '../../contexts/DataSyncContext';

interface CustomerShopProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

type ViewType = 'shop' | 'cart' | 'history';

export default function CustomerShop({ user, onLogout }: CustomerShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('shop');
  const { broadcastChange } = useDataSync();

  useEffect(() => {
    initializeData();
    setProducts(getProducts());
  }, []);

  // Auto-refresh products when inventory changes
  useAutoRefresh(['products', 'inventory'], () => {
    setProducts(getProducts());
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (promoCode?: string, discount?: number) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = discount ? (subtotal * discount) / 100 : 0;
    const total = subtotal - discountAmount;

    // Validate stock availability before placing order
    const currentProducts = getProducts();
    for (const cartItem of cart) {
      const currentProduct = currentProducts.find(p => p.id === cartItem.product.id);
      if (!currentProduct || currentProduct.stock < cartItem.quantity) {
        toast.error(`Insufficient stock for ${cartItem.product.name}. Please update your cart.`);
        return;
      }
    }

    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerName: user.username,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      promoCode,
      discount
    };

    // Update product stock - reduce by ordered quantities
    const updatedProducts = currentProducts.map(product => {
      const cartItem = cart.find(item => item.product.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    saveProducts(updatedProducts);
    
    // Broadcast inventory change so admin sees updated stock immediately
    broadcastChange('inventory', 'update');
    broadcastChange('products', 'update');

    const orders = getOrders();
    saveOrders([newOrder, ...orders]);
    
    // Broadcast order creation to all tabs/users
    broadcastChange('orders', 'create');
    
    // Increment promotion usage count if promo code was used
    if (promoCode) {
      const promotions = getPromotions();
      const updatedPromotions = promotions.map(promo => {
        if (promo.code.toUpperCase() === promoCode.toUpperCase()) {
          return {
            ...promo,
            currentUses: (promo.currentUses || 0) + 1
          };
        }
        return promo;
      });
      savePromotions(updatedPromotions);
      
      // Broadcast promotion update
      broadcastChange('promotions', 'update');
    }
    
    clearCart();
    setCurrentView('history');
    toast.success(`Order placed successfully! Order ID: ${newOrder.id.toUpperCase()}`);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200 truncate">B. Laroza Electrical</h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 hidden xs:block">Quality Lighting Products</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Info - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{user.username}</span>
              </div>

              {/* History Button */}
              <button
                onClick={() => setCurrentView('history')}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors touch-manipulation"
                title="Order History"
              >
                <History className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setCurrentView('cart')}
                className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors touch-manipulation"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-400 dark:bg-stone-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors touch-manipulation"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {currentView === 'shop' && (
          <ProductListing products={products} onAddToCart={addToCart} />
        )}
        {currentView === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onPlaceOrder={placeOrder}
            onContinueShopping={() => setCurrentView('shop')}
          />
        )}
        {currentView === 'history' && (
          <OrderHistory customerName={user.username} onBack={() => setCurrentView('shop')} />
        )}
      </main>
    </div>
  );
}
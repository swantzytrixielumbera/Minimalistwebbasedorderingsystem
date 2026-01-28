import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package, Tag } from 'lucide-react';
import { type CartItem } from './CustomerShop';
import { getPromotions, getProducts } from '../../data/mockData';
import QRCode from 'react-qr-code';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (promoCode?: string, discount?: number) => void;
  onContinueShopping: () => void;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  onPlaceOrder,
  onContinueShopping
}: CartProps) {
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState<{code: string; discount: number} | null>(null);
  const [promoError, setPromoError] = React.useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const total = subtotal - discountAmount;

  // Format currency in Philippine Peso
  const formatPeso = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const applyPromoCode = () => {
    setPromoError('');
    const promotions = getPromotions();
    const today = new Date().toISOString().split('T')[0];
    
    const promo = promotions.find(p => 
      p.code.toUpperCase() === promoCode.toUpperCase() &&
      p.active &&
      today >= p.validFrom &&
      today <= p.validTo
    );

    if (promo) {
      // Check usage limits
      if (promo.maxUses && promo.currentUses && promo.currentUses >= promo.maxUses) {
        setPromoError('This promo code has reached its usage limit');
        setAppliedPromo(null);
        return;
      }
      
      setAppliedPromo({ code: promo.code, discount: promo.discount });
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code');
      setAppliedPromo(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-1 sm:mb-2">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">{cart.length} items in your cart</p>
        </div>
        <button
          onClick={onContinueShopping}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Continue Shopping</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-8 sm:p-12 text-center">
          <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6">Add some products to get started</p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 rounded-lg font-medium transition-colors touch-manipulation"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-3 sm:gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 dark:text-neutral-500" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-200 mb-1 truncate">{item.product.name}</h3>
                        <span className="text-xs px-2 py-1 bg-stone-200 dark:bg-stone-700 text-neutral-700 dark:text-neutral-300 rounded-full inline-block">
                          {item.product.category}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors group flex-shrink-0 touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{item.product.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors touch-manipulation"
                        >
                          <Minus className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </button>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                        >
                          <Plus className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">₱{item.product.price.toLocaleString()} each</p>
                        <p className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {item.quantity >= item.product.stock && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Maximum available quantity reached</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={onClearCart}
              className="w-full py-3 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors touch-manipulation"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatPeso(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                    <span>Discount ({appliedPromo.discount}%)</span>
                    <span>-{formatPeso(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200">{formatPeso(total)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4" />
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Promo code "{appliedPromo.code}" applied! ({appliedPromo.discount}% off)
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {promoError}
                  </p>
                )}
              </div>

              <button
                onClick={() => onPlaceOrder(appliedPromo?.code, appliedPromo?.discount)}
                className="w-full bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 font-semibold py-3.5 sm:py-4 rounded-lg transition-colors mb-3 touch-manipulation"
              >
                Place Order
              </button>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                By placing this order, you agree to our terms and conditions
              </p>

              {/* QR Code Section */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Visit Our Facebook Page
                  </p>
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <QRCode
                        value="https://www.facebook.com/profile.php/?id=61568660799032"
                        size={100}
                        level="H"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Scan to follow us on Facebook
                  </p>
                </div>
              </div>

              {/* Cart Items Summary */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Items in Cart:</p>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="truncate flex-1 mr-2">{item.product.name}</span>
                      <span className="font-medium flex-shrink-0">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { type Product } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

interface ProductListingProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductListing({ products, onAddToCart }: ProductListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Ceiling', 'Wall', 'Decorative', 'LED Bulbs', 'Fixtures'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.stock > 0;
  });

  const handleAddToCart = (product: Product) => {
    // Check if product is still in stock
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    onAddToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-2 sm:mb-3">Welcome to Our Store</h1>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base lg:text-lg">Browse our collection of quality electrical lighting products</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 appearance-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation ${
                selectedCategory === category
                  ? 'bg-stone-300 dark:bg-stone-600 text-neutral-800 dark:text-neutral-200 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Product Image */}
            <div className="h-40 sm:h-48 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center relative">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 dark:text-neutral-500" />
              {product.stock <= product.lowStockThreshold && (
                <div className="absolute top-3 right-3 bg-orange-500 dark:bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Low Stock
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-3 sm:p-4">
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-stone-200 dark:bg-stone-700 text-neutral-700 dark:text-neutral-300 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-200 mb-2">{product.name}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200">₱{product.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">{product.stock} available</p>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 font-medium py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                <Plus className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-md p-8 sm:p-12 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">No products found</p>
          <p className="text-neutral-500 dark:text-neutral-500 text-xs sm:text-sm mt-2">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
}
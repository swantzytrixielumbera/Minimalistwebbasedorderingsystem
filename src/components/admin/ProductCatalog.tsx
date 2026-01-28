import React, { useState } from 'react';
import { Package, Search, Filter, Star } from 'lucide-react';
import { type Product, getProducts, saveProducts, getReviews } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';
import AddProductDialog from './AddProductDialog';
import ProductDetailModal from '../ProductDetailModal';

interface ProductCatalogProps {
  products: Product[];
  onUpdate: () => void;
}

export default function ProductCatalog({ products, onUpdate }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { broadcastChange } = useDataSync();

  const categories = ['All', 'Ceiling', 'Wall', 'Decorative', 'LED Bulbs', 'Fixtures'];
  const allReviews = getReviews();

  const getProductReviews = (productId: string) => {
    return allReviews.filter(r => r.productId === productId);
  };

  const getAverageRating = (productId: string) => {
    const reviews = getProductReviews(productId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Product Catalog</h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">Browse and manage your product inventory</p>
        </div>
        <AddProductDialog onProductAdded={onUpdate} />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-4 md:p-6 mb-4 md:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 appearance-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const productReviews = getProductReviews(product.id);
          const avgRating = getAverageRating(product.id);
          
          return (
          <div 
            key={product.id} 
            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Product Image */}
            <div className="h-48 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
              {product.image && product.image !== 'product-placeholder' ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<svg class="w-16 h-16 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                  }}
                />
              ) : (
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">{product.name}</h3>
                <span className="text-xs px-2 py-1 bg-stone-200 dark:bg-stone-700 text-neutral-700 dark:text-neutral-300 rounded-full">
                  {product.category}
                </span>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{product.description}</p>

              {/* Reviews */}
              {productReviews.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(avgRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {avgRating.toFixed(1)} ({productReviews.length})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Price</p>
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">₱{product.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Stock</p>
                  <p className={`text-lg font-bold ${
                    product.stock <= product.lowStockThreshold ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {product.stock}
                  </p>
                </div>
              </div>

              <div className={`text-center text-xs font-medium px-3 py-2 rounded-lg ${
                product.stock > product.lowStockThreshold 
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : product.stock > 0
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {product.stock > product.lowStockThreshold 
                  ? 'In Stock' 
                  : product.stock > 0
                  ? 'Low Stock'
                  : 'Out of Stock'}
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">No products found</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isCustomer={false}
        />
      )}
    </div>
  );
}
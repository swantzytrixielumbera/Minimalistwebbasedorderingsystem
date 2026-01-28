import React, { useState } from 'react';
import { Archive, Plus, Minus, Edit2, AlertTriangle } from 'lucide-react';
import { type Product, getProducts, saveProducts } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';

interface InventoryManagementProps {
  products: Product[];
  onUpdate: () => void;
}

export default function InventoryManagement({ products, onUpdate }: InventoryManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockChange, setStockChange] = useState<{ [key: string]: number }>({});
  const { broadcastChange } = useDataSync();

  const handleStockUpdate = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = Math.max(0, product.stock + change);
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, stock: newStock } : p
    );
    
    saveProducts(updatedProducts);
    
    // Broadcast inventory change to all tabs/users
    broadcastChange('inventory', 'update');
    
    onUpdate();
    setStockChange({ ...stockChange, [productId]: 0 });
  };

  const handleQuickAdjust = (productId: string, amount: number) => {
    setStockChange({ ...stockChange, [productId]: amount });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Inventory Management</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">Monitor and update product stock levels</p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Category</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Current Stock</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Low Stock Alert</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLowStock = product.stock <= product.lowStockThreshold;
                const currentChange = stockChange[product.id] || 0;
                
                return (
                  <tr key={product.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Archive className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">{product.name}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">₱{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-stone-200 dark:bg-stone-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                        {product.stock}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-neutral-600 dark:text-neutral-400">{product.lowStockThreshold}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isLowStock ? (
                        <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Low Stock</span>
                        </div>
                      ) : (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Good</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Quick Adjust Buttons */}
                        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
                          <button
                            onClick={() => handleQuickAdjust(product.id, -10)}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                            title="Decrease by 10"
                          >
                            <Minus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          <input
                            type="number"
                            value={currentChange}
                            onChange={(e) => handleQuickAdjust(product.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-800 dark:text-neutral-200"
                          />
                          <button
                            onClick={() => handleQuickAdjust(product.id, 10)}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                            title="Increase by 10"
                          >
                            <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                        </div>
                        
                        {/* Update Button */}
                        {currentChange !== 0 && (
                          <button
                            onClick={() => handleStockUpdate(product.id, currentChange)}
                            className="px-4 py-2 bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Stock Units</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {products.filter(p => p.stock <= p.lowStockThreshold).length}
          </p>
        </div>
      </div>
    </div>
  );
}